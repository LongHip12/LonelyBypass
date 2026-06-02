var allServices = [];
var activeCategory = 'All';

var CAT_CFG = {
  adLinks:    { label: 'Ad-link',     emoji: '🔗', cls: 'cat-adLinks' },
  socials:    { label: 'Social-lock', emoji: '👥', cls: 'cat-socials' },
  pastes:     { label: 'Paste',       emoji: '📋', cls: 'cat-pastes' },
  shorteners: { label: 'Shortener',   emoji: '✂️', cls: 'cat-shorteners' },
  roblox:     { label: 'Roblox Key',  emoji: '🎮', cls: 'cat-roblox' }
};

function domainFromEntry(entry) {
  return entry.replace(/\s*\(.*?\)\s*/g, '').trim().split(' ')[0] || entry;
}

function nameFromEntry(entry) {
  var d = domainFromEntry(entry);
  var base = d.split('.')[0] || d;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function loadSupported() {
  fetch('/api/supported')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.error) throw new Error(data.error);

      allServices = [];
      var cats = Object.keys(CAT_CFG);
      cats.forEach(function(cat) {
        (data[cat] || []).forEach(function(entry) {
          allServices.push({
            entry: entry,
            category: cat,
            domain: domainFromEntry(entry),
            name: nameFromEntry(entry)
          });
        });
      });

      var total = allServices.length;
      var sub = document.getElementById('supported-sub');
      if (sub) sub.textContent = total + ' services supported and growing';

      var countAll = document.getElementById('count-All');
      if (countAll) countAll.textContent = total;

      cats.forEach(function(cat) {
        var el = document.getElementById('count-' + cat);
        if (el) el.textContent = (data[cat] || []).length;
      });

      document.getElementById('supported-loading').style.display = 'none';
      renderCards();
    })
    .catch(function() {
      document.getElementById('supported-loading').style.display = 'none';
      document.getElementById('supported-error').style.display = 'flex';
    });
}

function setCategory(btn, cat) {
  activeCategory = cat;
  document.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('active'); });
  btn.classList.add('active');
  renderCards();
}

function filterServices() {
  renderCards();
}

function renderCards() {
  var search = (document.getElementById('search-input').value || '').toLowerCase();
  var filtered = allServices.filter(function(s) {
    var matchCat = activeCategory === 'All' || s.category === activeCategory;
    var matchSearch = !search || s.name.toLowerCase().includes(search) || s.domain.toLowerCase().includes(search) || s.entry.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  var grid = document.getElementById('services-grid');
  var noResults = document.getElementById('no-results');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'flex';
    return;
  }

  noResults.style.display = 'none';
  var html = '';
  filtered.forEach(function(s, i) {
    var cfg = CAT_CFG[s.category];
    html += '<div class="service-card">' +
      '<div class="service-card-info">' +
        '<div class="service-card-name">' + escHtml(s.name) + '</div>' +
        '<div class="service-card-domain">' + escHtml(s.domain) + '</div>' +
        '<span class="cat-badge ' + cfg.cls + '">' + cfg.emoji + ' ' + cfg.label + '</span>' +
      '</div>' +
      '<a href="https://' + escHtml(s.domain) + '" target="_blank" rel="noreferrer" class="service-card-link" aria-label="Visit ' + escHtml(s.name) + '">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>' +
      '</a>' +
    '</div>';
  });
  grid.innerHTML = html;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.addEventListener('DOMContentLoaded', loadSupported);
