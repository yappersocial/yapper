// GIF picker powered by Giphy
// Get your free key at: https://developers.giphy.com
// Log in → Create an App → choose "API" type → copy the API Key → paste in js/config.js

let _gifCallback = null;
let _gifTimer = null;
let _gifPicker = null;

function openGifPicker(anchorId, callback) {
  if (!GIPHY_KEY) {
    showToast('Add your Giphy API key in js/config.js to enable GIFs');
    return;
  }
  _gifCallback = callback;

  if (!_gifPicker) {
    _gifPicker = document.createElement('div');
    _gifPicker.id = 'gif-picker';
    _gifPicker.className = 'gif-picker';
    _gifPicker.innerHTML = `
      <div class="gif-picker-search">
        <input type="text" id="gif-search-input" placeholder="Search GIFs…" autocomplete="off" oninput="gifSearch(this.value)">
      </div>
      <div class="gif-grid" id="gif-grid"></div>`;
    document.body.appendChild(_gifPicker);
    document.addEventListener('click', e => {
      if (_gifPicker && !_gifPicker.contains(e.target)) closeGifPicker();
    });
  }

  const anchor = typeof anchorId === 'string' ? document.getElementById(anchorId) : anchorId;
  const rect = anchor.getBoundingClientRect();
  const pickerH = 380;
  const top = rect.bottom + 8 + pickerH > window.innerHeight ? rect.top - pickerH - 8 : rect.bottom + 8;
  const left = Math.max(4, Math.min(rect.left, window.innerWidth - 344));
  _gifPicker.style.cssText = `display:flex;flex-direction:column;top:${top}px;left:${left}px`;
  document.getElementById('gif-search-input').value = '';
  fetchGifs('');
}

function closeGifPicker() {
  if (_gifPicker) _gifPicker.style.display = 'none';
}

async function fetchGifs(q) {
  const grid = document.getElementById('gif-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="gif-loading"><div class="spinner"></div></div>';
  try {
    const endpoint = q
      ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=24&rating=pg-13`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&limit=24&rating=pg-13`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Giphy API error ' + res.status);
    const { data } = await res.json();
    renderGifs(data || []);
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--text2);padding:20px;text-align:center;grid-column:span 2">Could not load GIFs</p>`;
  }
}

function gifSearch(q) {
  clearTimeout(_gifTimer);
  _gifTimer = setTimeout(() => fetchGifs(q.trim()), 400);
}

function renderGifs(data) {
  const grid = document.getElementById('gif-grid');
  if (!grid) return;
  if (!data.length) {
    grid.innerHTML = '<p style="color:var(--text2);padding:20px;text-align:center;grid-column:span 2">No GIFs found</p>';
    return;
  }
  grid.innerHTML = data.map(g => {
    const preview = g.images?.fixed_height_small?.url || g.images?.fixed_height?.url || '';
    const full    = g.images?.original?.url || preview;
    // strip giphy tracking params to get a clean URL
    const cleanUrl = full.split('?')[0];
    return `<img src="${preview}" alt="${escapeHtml(g.title||'')}" loading="lazy" onclick="pickGif('${encodeURIComponent(cleanUrl)}')">`;
  }).join('');
}

function pickGif(encodedUrl) {
  closeGifPicker();
  if (_gifCallback) _gifCallback(decodeURIComponent(encodedUrl));
}
