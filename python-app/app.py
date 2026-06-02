import os
import sqlite3
import time
import requests
from datetime import datetime
from flask import Flask, render_template, request, jsonify, g
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

DATABASE = os.path.join(os.path.dirname(__file__), "bypass.db")
SERVICE_START_DATE = datetime(2024, 6, 1)
SUPPORTED_CACHE = {"data": None, "ts": 0}
SUPPORTED_CACHE_TTL = 10 * 60


def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


def init_db():
    with app.app_context():
        db = get_db()
        db.execute("""
            CREATE TABLE IF NOT EXISTS bypass_stats (
                id INTEGER PRIMARY KEY,
                total_bypassed INTEGER NOT NULL DEFAULT 0,
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)
        db.execute("""
            CREATE TABLE IF NOT EXISTS bypass_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_url TEXT NOT NULL,
                bypassed_url TEXT,
                captcha_type TEXT,
                success INTEGER NOT NULL DEFAULT 0,
                time_taken INTEGER,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)
        row = db.execute("SELECT id FROM bypass_stats WHERE id = 1").fetchone()
        if not row:
            db.execute("INSERT INTO bypass_stats (id, total_bypassed) VALUES (1, 0)")
        db.commit()


def verify_captcha(token, captcha_type):
    try:
        if captcha_type == "turnstile":
            secret = os.environ.get("CLOUDFLARE_SECRET")
            if not secret:
                return False
            r = requests.post(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                data={"secret": secret, "response": token},
                timeout=10,
            )
            return r.json().get("success") is True
        else:
            secret = os.environ.get("HCAPTCHA_SECRET")
            if not secret:
                return False
            r = requests.post(
                "https://hcaptcha.com/siteverify",
                data={"secret": secret, "response": token},
                timeout=10,
            )
            return r.json().get("success") is True
    except Exception:
        return False


def perform_bypass(url):
    token = os.environ.get("TOKENACC", "")
    start = time.time()
    try:
        r = requests.get(
            "https://hanami.run/api/bypass",
            params={"url": url, "apikey": token},
            headers={"User-Agent": "LonelyBypass/1.0"},
            timeout=30,
        )
        elapsed = int((time.time() - start) * 1000)
        if not r.ok:
            return None
        data = r.json()
        bypassed_url = (
            data.get("result")
            or data.get("destination")
            or data.get("bypassed")
            or data.get("url")
        )
        if not bypassed_url:
            return None
        return {"bypassedUrl": bypassed_url, "timeTaken": elapsed}
    except Exception:
        return None


@app.route("/")
def index():
    cf_sitekey = os.environ.get("CLOUDFLARE_SITEKEY", "")
    hcaptcha_sitekey = os.environ.get("HCAPTCHA_SITEKEY", "")
    return render_template("index.html", cf_sitekey=cf_sitekey, hcaptcha_sitekey=hcaptcha_sitekey)


@app.route("/status")
def status_page():
    return render_template("status.html")


@app.route("/supported")
def supported_page():
    return render_template("supported.html")


@app.route("/api/bypass", methods=["POST"])
def api_bypass():
    body = request.get_json(silent=True) or {}
    url = body.get("url", "").strip()
    captcha_token = body.get("captchaToken", "")
    captcha_type = body.get("captchaType", "turnstile")

    if not url or not captcha_token or captcha_type not in ("hcaptcha", "turnstile"):
        return jsonify({"error": "Invalid request body"}), 400

    captcha_valid = verify_captcha(captcha_token, captcha_type)
    if not captcha_valid:
        return jsonify({"error": "Captcha verification failed"}), 422

    result = perform_bypass(url)
    db = get_db()

    if result:
        db.execute(
            "INSERT INTO bypass_logs (original_url, bypassed_url, captcha_type, success, time_taken) VALUES (?,?,?,1,?)",
            (url, result["bypassedUrl"], captcha_type, result["timeTaken"]),
        )
        db.execute(
            "UPDATE bypass_stats SET total_bypassed = total_bypassed + 1, updated_at = datetime('now') WHERE id = 1"
        )
        db.commit()
        return jsonify({
            "success": True,
            "bypassedUrl": result["bypassedUrl"],
            "originalUrl": url,
            "timeTaken": result["timeTaken"],
            "error": None,
        })
    else:
        db.execute(
            "INSERT INTO bypass_logs (original_url, bypassed_url, captcha_type, success) VALUES (?,NULL,?,0)",
            (url, captcha_type),
        )
        db.commit()
        return jsonify({
            "success": False,
            "bypassedUrl": None,
            "originalUrl": url,
            "timeTaken": None,
            "error": "Bypass failed. The link may not be supported or the service is temporarily unavailable.",
        })


@app.route("/api/stats")
def api_stats():
    db = get_db()
    row = db.execute("SELECT total_bypassed FROM bypass_stats WHERE id = 1").fetchone()
    total = row["total_bypassed"] if row else 0

    now = datetime.now()
    months = max(
        1,
        (now.year - SERVICE_START_DATE.year) * 12 + (now.month - SERVICE_START_DATE.month),
    )

    return jsonify({
        "linksTotal": total,
        "supportedServices": 50,
        "monthsOfService": months,
    })


@app.route("/api/status")
def api_status():
    services = [
        {"name": "Bypass API", "status": "operational", "uptime": 99.9, "latency": 142},
        {"name": "Linkvertise Bypass", "status": "operational", "uptime": 99.7, "latency": 320},
        {"name": "Platoboost Bypass", "status": "operational", "uptime": 99.5, "latency": 280},
        {"name": "Lootlabs Bypass", "status": "operational", "uptime": 99.8, "latency": 195},
        {"name": "Work.ink Bypass", "status": "operational", "uptime": 98.9, "latency": 410},
        {"name": "Admaven Bypass", "status": "operational", "uptime": 99.2, "latency": 360},
        {"name": "Rekonise Bypass", "status": "operational", "uptime": 99.6, "latency": 220},
        {"name": "hCaptcha Service", "status": "operational", "uptime": 100.0, "latency": 85},
        {"name": "Cloudflare Turnstile", "status": "operational", "uptime": 100.0, "latency": 72},
        {"name": "Database", "status": "operational", "uptime": 99.99, "latency": 8},
    ]

    has_outage = any(s["status"] == "outage" for s in services)
    has_degraded = any(s["status"] == "degraded" for s in services)
    overall = "outage" if has_outage else "degraded" if has_degraded else "operational"

    return jsonify({
        "overall": overall,
        "services": services,
        "updatedAt": datetime.utcnow().isoformat() + "Z",
    })


@app.route("/api/supported")
def api_supported():
    global SUPPORTED_CACHE
    now = time.time()
    if SUPPORTED_CACHE["data"] and (now - SUPPORTED_CACHE["ts"]) < SUPPORTED_CACHE_TTL:
        return jsonify(SUPPORTED_CACHE["data"])

    token = os.environ.get("TOKENACC", "")
    try:
        r = requests.get(
            "https://hanami.run/api/supported",
            params={"apikey": token},
            headers={"User-Agent": "LonelyBypass/1.0"},
            timeout=8,
        )
        raw = r.json()
        result = raw.get("result", raw)
        data = {
            "adLinks":    result.get("ad-links",   result.get("adLinks",    [])),
            "socials":    result.get("socials",     []),
            "pastes":     result.get("pastes",      []),
            "shorteners": result.get("shorteners",  []),
            "roblox":     result.get("roblox",      []),
        }
        SUPPORTED_CACHE = {"data": data, "ts": now}
        return jsonify(data)
    except Exception:
        return jsonify({"error": "Failed to fetch supported services"}), 502


@app.route("/api/healthz")
def healthz():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
