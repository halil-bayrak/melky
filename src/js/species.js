// ── Helpers ──────────────────────────────────────────────

function getBadge(edibility) {
  if (edibility.toLowerCase().includes('choice')) {
    return '<span class="badge badge-choice">Choice edible</span>';
  }
  return '<span class="badge badge-edible">Edible</span>';
}

// ── Build the cards grid ──────────────────────────────────

function renderGrid(species) {
  const grid = document.getElementById('species-grid');
  grid.innerHTML = '';

  if (species.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted)">No mushrooms found.</p>';
    return;
  }

  species.forEach(function(s) {
    const card = document.createElement('div');
    card.className = 'species-card';
    card.innerHTML = `
      <h3>${s.name}</h3>
      <div class="turkish-name">${s.turkish_name}</div>
      <div class="season">🗓 ${s.season}</div>
      ${getBadge(s.edibility)}
      <p style="margin-top:12px; font-size:0.88rem; color:var(--text-muted); line-height:1.5">
        ${s.description.substring(0, 100)}…
      </p>
    `;
    card.addEventListener('click', function() {
      showDetail(s);
    });
    grid.appendChild(card);
  });
}

// ── Build the detail view ─────────────────────────────────

function showDetail(s) {
  const grid      = document.getElementById('species-grid');
  const search    = document.getElementById('species-search');
  const detail    = document.getElementById('species-detail');
  const content   = document.getElementById('detail-content');

  // Hide grid and search, show detail
  grid.style.display   = 'none';
  search.style.display = 'none';
  detail.style.display = 'block';

  // Build lookalikes HTML
  const lookalikesHTML = s.lookalikes.map(function(l) {
    return `
      <divclass="lookalike-item">
        <div class="danger-label">⚠️ ${l.danger}: ${l.name}</div>
        <div style="margin-top:6px; font-size:0.88rem">${l.difference}</div>
      </div>
    `;
  }).join('');

  // Build sources HTML
  const sourcesHTML = s.sources.map(function(src) {
    return `<a class="source-link" href="${src.url}" target="_blank">${src.name} ↗</a>`;
  }).join('');

  // Build identification tips HTML
  const tipsHTML = s.identification_tips.map(function(tip) {
    return `<li>${tip}</li>`;
  }).join('');

  content.innerHTML = `
    <h2>${s.name}</h2>
    <div class="turkish-name">${s.turkish_name}</div>
    ${getBadge(s.edibility)}

    <div class="detail-section">
      <h4>About</h4>
      <p style="line-height:1.7">${s.description}</p>
    </div>

    <div class="detail-section">
      <h4>Season & Habitat</h4>
      <p>🗓 ${s.season}</p>
      <p style="margin-top:6px">🌲 ${s.habitat}</p>
    </div>

    <div class="detail-section">
      <h4>How to identify</h4>
      <ul>${tipsHTML}</ul>
    </div>

    <div class="detail-section">
      <h4>Dangerous lookalikes</h4>
      ${lookalikesHTML}
    </div>

    <div class="detail-section">
      <h4>Safety warning</h4>
      <div class="safety-banner">${s.safety_warning}</div>
    </div>

    <div class="detail-section">
      <h4>Learn more</h4>
      <div class="sources-list">${sourcesHTML}</div>
    </div>
  `;
}

// ── Back button ───────────────────────────────────────────

document.getElementById('detail-back').addEventListener('click', function() {
  document.getElementById('species-grid').style.display   = 'grid';
  document.getElementById('species-search').style.display = 'block';
  document.getElementById('species-detail').style.display = 'none';
});

// ── Search ────────────────────────────────────────────────

document.getElementById('species-search').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const filtered = window.allSpecies.filter(function(s) {
    return s.name.toLowerCase().includes(query) ||
           s.turkish_name.toLowerCase().includes(query) ||
           s.description.toLowerCase().includes(query);
  });
  renderGrid(filtered);
});

// ── Load data and initialise ──────────────────────────────

fetch('../data/species.json')
  .then(function(response) { return response.json(); })
  .then(function(data) {
    window.allSpecies = data;
    renderGrid(data);
  })
  .catch(function(error) {
    console.error('Could not load species data:', error);
  });