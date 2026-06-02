var currentTheme = localStorage.getItem('theme') || 'dark';
var captchaType = 'turnstile';
var captchaWidgetId = null;
var bypassedUrl = null;

function applyTheme() {
  document.documentElement.classList.remove('dark-mode', 'light-mode');
  document.documentElement.classList.add(currentTheme === 'dark' ? 'dark-mode' : 'light-mode');
  document.getElementById('icon-sun').style.display = currentTheme === 'dark' ? 'block' : 'none';
  document.getElementById('icon-moon').style.display = currentTheme === 'dark' ? 'none' : 'block';
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
  applyTheme();
}

applyTheme();

function toggleMenu() {
  var menu = document.getElementById('mobile-menu');
  var iconMenu = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');
  var open = menu.style.display !== 'none' && menu.style.display !== '';
  menu.style.display = open ? 'none' : 'flex';
  if (iconMenu) iconMenu.style.display = open ? 'block' : 'none';
  if (iconClose) iconClose.style.display = open ? 'none' : 'block';
}

function closeMenu() {
  var menu = document.getElementById('mobile-menu');
  var iconMenu = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');
  if (menu) menu.style.display = 'none';
  if (iconMenu) iconMenu.style.display = 'block';
  if (iconClose) iconClose.style.display = 'none';
}

function scrollToSection(id) {
  if (window.location.pathname !== '/' && window.location.pathname !== (window.BASE_URL || '/')) {
    window.location.href = '/#' + id;
    return;
  }
  var el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
}

function animateHero() {
  var heroText = document.getElementById('hero-text');
  var bypassCard = document.getElementById('bypass-card');
  if (heroText) setTimeout(function() { heroText.classList.add('visible'); }, 50);
  if (bypassCard) setTimeout(function() { bypassCard.classList.add('visible'); }, 200);
}

var TYPING_SERVICES = ['Linkvertise','Platoboost','Lootlabs','Work.ink','Admaven','Lockr.so','Shortfly','Rekonise'];
var twIdx = 0, twText = '', twDeleting = false, twTimer = null;

function initTypewriter() {
  var el = document.getElementById('typewriter');
  if (!el) return;
  twTick(el);
}

function twTick(el) {
  var current = TYPING_SERVICES[twIdx % TYPING_SERVICES.length];
  if (!twDeleting && twText === current) {
    twTimer = setTimeout(function() { twDeleting = true; twTick(el); }, 1400);
  } else if (twDeleting && twText === '') {
    twDeleting = false;
    twIdx++;
    twTimer = setTimeout(function() { twTick(el); }, 100);
  } else {
    twText = twDeleting ? current.slice(0, twText.length - 1) : current.slice(0, twText.length + 1);
    el.textContent = twText;
    twTimer = setTimeout(function() { twTick(el); }, twDeleting ? 60 : 90);
  }
}

function setUrl(url) {
  var input = document.getElementById('url-input');
  if (input) {
    input.value = url;
    var shield = document.getElementById('input-shield');
    if (shield) shield.style.display = url ? 'block' : 'none';
  }
}

(function() {
  var input = document.getElementById('url-input');
  if (!input) return;
  input.addEventListener('input', function() {
    var shield = document.getElementById('input-shield');
    if (shield) shield.style.display = input.value ? 'block' : 'none';
  });
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleBypassClick();
  });
})();

function loadStats() {
  fetch('/api/stats')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var suffixes = ['', '+', ''];
      var values = [data.linksTotal, data.supportedServices, data.monthsOfService];
      for (var i = 0; i < 3; i++) {
        var el = document.getElementById('stat-num-' + i);
        if (el) {
          el.dataset.target = values[i];
          el.dataset.suffix = suffixes[i];
        }
      }
    })
    .catch(function() {});
}

function animateNumber(el, target, suffix) {
  var start = 0;
  var duration = 2200;
  var startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var val = Math.floor(progress * target);
    el.textContent = val.toLocaleString() + (suffix || '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + (suffix || '');
  }
  requestAnimationFrame(step);
}

function observeStats() {
  var cards = document.querySelectorAll('.stat-card');
  if (!('IntersectionObserver' in window)) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        for (var i = 0; i < 3; i++) {
          var el = document.getElementById('stat-num-' + i);
          if (el && el.dataset.target) {
            animateNumber(el, parseInt(el.dataset.target), el.dataset.suffix);
          }
        }
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (cards[0]) obs.observe(cards[0]);
}

function toggleFaq(btn) {
  var item = btn.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i) { i.classList.remove('open'); });
  if (!wasOpen) item.classList.add('open');
}

function handleBypassClick() {
  var input = document.getElementById('url-input');
  var url = input ? input.value.trim() : '';
  if (!url) { showToast('Please enter a URL', '', true); return; }
  bypassedUrl = null;
  openCaptchaModal();
}

function openCaptchaModal() {
  var modal = document.getElementById('captcha-modal');
  if (modal) modal.style.display = 'flex';
  captchaType = 'turnstile';
  updateCaptchaLabels();
  loadCaptchaWidget();
}

function closeCaptchaModal() {
  var modal = document.getElementById('captcha-modal');
  if (modal) modal.style.display = 'none';
  destroyCaptchaWidget();
}

function closeCaptchaOnOverlay(e) {
  if (e.target === e.currentTarget) closeCaptchaModal();
}

function updateCaptchaLabels() {
  var label = document.getElementById('captcha-label');
  var switchLabel = document.getElementById('switch-label');
  if (label) label.textContent = captchaType === 'turnstile' ? 'Cloudflare Turnstile' : 'hCaptcha';
  if (switchLabel) switchLabel.textContent = captchaType === 'turnstile' ? 'hCaptcha' : 'Turnstile';
}

function switchCaptcha() {
  destroyCaptchaWidget();
  captchaType = captchaType === 'turnstile' ? 'hcaptcha' : 'turnstile';
  updateCaptchaLabels();
  loadCaptchaWidget();
}

function destroyCaptchaWidget() {
  if (captchaWidgetId !== null) {
    try {
      if (captchaType === 'turnstile' && window.turnstile) window.turnstile.remove(captchaWidgetId);
      else if (captchaType === 'hcaptcha' && window.hcaptcha) window.hcaptcha.remove(captchaWidgetId);
    } catch(e) {}
    captchaWidgetId = null;
  }
  var container = document.getElementById('captcha-container');
  if (container) container.innerHTML = '';
}

function loadCaptchaWidget() {
  var container = document.getElementById('captcha-container');
  if (!container) return;

  if (captchaType === 'turnstile') {
    var sitekey = window.CF_SITEKEY || '';
    var scriptId = 'turnstile-script';
    var render = function() {
      if (window.turnstile && container) {
        captchaWidgetId = window.turnstile.render(container, {
          sitekey: sitekey,
          theme: currentTheme === 'dark' ? 'dark' : 'light',
          callback: function(token) { onCaptchaSuccess(token, 'turnstile'); }
        });
      }
    };
    var script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = function() { setTimeout(render, 100); };
      document.head.appendChild(script);
    } else {
      setTimeout(render, 100);
    }
  } else {
    var sitekey = window.HCAPTCHA_SITEKEY || '';
    var scriptId = 'hcaptcha-script';
    var render = function() {
      if (window.hcaptcha && container) {
        captchaWidgetId = window.hcaptcha.render(container, {
          sitekey: sitekey,
          theme: currentTheme === 'dark' ? 'dark' : 'light',
          callback: function(token) { onCaptchaSuccess(token, 'hcaptcha'); }
        });
      }
    };
    var script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
      script.async = true;
      script.onload = function() { setTimeout(render, 100); };
      document.head.appendChild(script);
    } else {
      setTimeout(render, 100);
    }
  }
}

function onCaptchaSuccess(token, type) {
  closeCaptchaModal();
  performBypass(token, type);
}

function performBypass(token, type) {
  var input = document.getElementById('url-input');
  var url = input ? input.value.trim() : '';
  var btn = document.getElementById('bypass-btn');
  var btnText = document.getElementById('bypass-btn-text');

  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = 'Bypassing...';

  var resultSection = document.getElementById('result-section');
  var resultLoading = document.getElementById('result-loading');
  var resultContent = document.getElementById('result-content');

  if (resultSection) resultSection.style.display = 'block';
  if (resultLoading) resultLoading.style.display = 'block';
  if (resultContent) resultContent.style.display = 'none';

  fetch('/api/bypass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url, captchaToken: token, captchaType: type })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = 'Bypass';
    if (resultLoading) resultLoading.style.display = 'none';

    if (data.success && data.bypassedUrl) {
      bypassedUrl = data.bypassedUrl;
      var resultInput = document.getElementById('result-url');
      if (resultInput) resultInput.value = bypassedUrl;
      if (resultContent) resultContent.style.display = 'block';
      showToast('Bypass successful', 'Done in ' + (data.timeTaken || 0) + 'ms');
    } else {
      if (resultSection) resultSection.style.display = 'none';
      showToast('Bypass failed', data.error || 'Unknown error', true);
    }
  })
  .catch(function(err) {
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = 'Bypass';
    if (resultLoading) resultLoading.style.display = 'none';
    if (resultSection) resultSection.style.display = 'none';
    showToast('Bypass failed', 'Failed to bypass link', true);
  });
}

function openResult() {
  if (bypassedUrl) window.open(bypassedUrl, '_blank');
}

function copyResult() {
  if (!bypassedUrl) return;
  navigator.clipboard.writeText(bypassedUrl).then(function() {
    var btn = document.getElementById('copy-btn');
    var icon = document.getElementById('copy-icon');
    if (icon) icon.innerHTML = '<path d="M20 6 9 17l-5-5"/>';
    setTimeout(function() {
      if (icon) icon.innerHTML = '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>';
    }, 2000);
    showToast('Copied to clipboard');
  });
}

function showToast(title, desc, isError) {
  var container = document.getElementById('toast-container');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.innerHTML = '<div class="toast-title">' + title + '</div>' + (desc ? '<div class="toast-desc">' + desc + '</div>' : '');
  container.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 4000);
}
