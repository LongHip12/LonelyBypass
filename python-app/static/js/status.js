var STATUS_ICONS = {
  'Bypass API': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  'Linkvertise Bypass': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'Platoboost Bypass': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'Lootlabs Bypass': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'Work.ink Bypass': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'Admaven Bypass': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'Rekonise Bypass': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'hCaptcha Service': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'Cloudflare Turnstile': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'Database': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>'
};

var STATUS_LABELS = { operational: 'Operational', degraded: 'Degraded', outage: 'Outage' };

function buildServiceRow(service, idx) {
  var status = service.status;
  var iconPaths = STATUS_ICONS[service.name] || STATUS_ICONS['Linkvertise Bypass'];
  var bars = buildUptimeBar(service.uptime, status);
  var latencyColor = service.latency < 200 ? '#34d399' : service.latency < 500 ? '#fbbf24' : '#f87171';
  var dotPulse = '<span class="pulse-dot ' + status + '"></span>';

  return '<div class="service-row" style="animation:none;opacity:1;transform:none;transition:opacity 0.4s ' + (idx * 0.05) + 's, transform 0.5s ' + (idx * 0.05) + 's">' +
    '<div class="service-info">' +
      '<div class="service-icon ' + status + '">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + iconPaths + '</svg>' +
      '</div>' +
      '<div class="service-name-wrap">' +
        '<div class="service-name">' + service.name + '</div>' +
        '<div class="service-meta">' +
          '<span>' + service.uptime + '% uptime</span>' +
          (service.latency != null ? '<span><span class="latency-dot" style="background:' + latencyColor + '"></span>' + service.latency + 'ms</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="uptime-bar">' + bars + '</div>' +
    '<div class="status-pill ' + status + '">' + dotPulse + STATUS_LABELS[status] + '</div>' +
  '</div>';
}

function buildUptimeBar(uptime, status) {
  var total = 30;
  var filled = Math.round((uptime / 100) * total);
  var colorMap = { operational: '#34d399', degraded: '#fbbf24', outage: '#f87171' };
  var color = colorMap[status] || '#34d399';
  var html = '';
  for (var i = 0; i < total; i++) {
    var opacity = i < filled ? (0.7 + (i / filled) * 0.3) : 1;
    var bg = i < filled ? color : 'var(--border)';
    html += '<div class="uptime-bar-seg" style="background:' + bg + ';opacity:' + opacity + '"></div>';
  }
  return html;
}

function loadStatus() {
  fetch('/api/status')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var overall = data.overall || 'operational';
      var hero = document.getElementById('status-hero');
      var icon = document.getElementById('status-hero-icon');
      var headline = document.getElementById('status-headline');
      var updated = document.getElementById('status-updated');
      var counts = document.getElementById('status-counts');
      var glow = document.getElementById('status-glow');
      var pulseEl = document.querySelector('#status-hero-row .pulse-dot') || null;

      var headlineMap = { operational: 'All Systems Operational', degraded: 'Partial Degradation', outage: 'Major Outage' };
      var iconPathMap = {
        operational: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
        degraded: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/>',
        outage: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'
      };

      if (hero) { hero.classList.remove('operational','degraded','outage'); hero.classList.add(overall); }
      if (icon) {
        icon.classList.remove('operational','degraded','outage','loading');
        icon.classList.add(overall);
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + iconPathMap[overall] + '</svg>';
      }
      if (glow) { glow.classList.remove('operational','degraded','outage'); glow.classList.add(overall); }

      var dotClass = overall === 'operational' ? 'emerald' : overall === 'degraded' ? 'amber' : 'red';
      var heroRow = document.querySelector('.status-hero-row');
      if (heroRow) {
        var existingDot = heroRow.querySelector('.pulse-dot');
        if (existingDot) { existingDot.className = 'pulse-dot ' + dotClass; }
        else {
          var dot = document.createElement('span');
          dot.className = 'pulse-dot ' + dotClass;
          heroRow.insertBefore(dot, heroRow.firstChild);
        }
      }

      if (headline) headline.textContent = headlineMap[overall] || 'All Systems Operational';
      if (updated) {
        var d = new Date(data.updatedAt);
        updated.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Last updated ' + d.toLocaleString();
      }

      if (counts) {
        counts.style.display = 'flex';
        var online = data.services.filter(function(s) { return s.status === 'operational'; }).length;
        var degraded = data.services.filter(function(s) { return s.status === 'degraded'; }).length;
        var outage = data.services.filter(function(s) { return s.status === 'outage'; }).length;

        var countOnline = document.getElementById('count-online');
        var countDegraded = document.getElementById('count-degraded');
        var countOutage = document.getElementById('count-outage');

        if (countOnline) { countOnline.querySelector('.count-num').textContent = online; }
        if (countDegraded && degraded > 0) { countDegraded.style.display = 'block'; countDegraded.querySelector('.count-num').textContent = degraded; }
        if (countOutage && outage > 0) { countOutage.style.display = 'block'; countOutage.querySelector('.count-num').textContent = outage; }
      }

      var servicesCount = document.getElementById('services-count');
      if (servicesCount) servicesCount.textContent = data.services.length + ' monitored';

      var list = document.getElementById('services-list');
      if (list) {
        var loading = document.getElementById('services-loading');
        if (loading) loading.style.display = 'none';
        var html = '';
        data.services.forEach(function(s, i) { html += buildServiceRow(s, i); });
        list.innerHTML = html;
      }
    })
    .catch(function() {});
}

document.addEventListener('DOMContentLoaded', function() {
  loadStatus();
  setInterval(loadStatus, 30000);
});
