let _gifCallback = null;
let _gifTimer = null;
let _gifPicker = null;

function openGifPicker(anchorId, callback) {
  if (!TENOR_KEY) {
    showToast('Add your Tenor API key in js/config.js to enable GIFs');
    return;
  }
  _gifCallback = callback;

  if (!_gifPicker) {
    _gifPicker = document.createElement('div');
    _gifPicker.id = 'gif-picker';
    _gifPicker.className = 'gif-picker';
    _gifPicker.innerHTML = `
      <div class="gif-picker-search">
        <input type="text" id="gif-search-input" placeholder="Search GIFs..." autocomplete="off" oninput="gifSearch(this.value)">
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
      ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(q)}&key=${TENOR_KEY}&limit=24&media_filter=gif,tinygif`
      : `https://tenor.googleapis.com/v2/featured?key=${TENOR_KEY}&limit=24&media_filter=gif,tinygif`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    renderGifs(data.results || []);
  } catch {
    grid.innerHTML = '<p style="color:var(--text2);padding:20px;text-align:center;grid-column:span 2">Could not load GIFs</p>';
  }
}

function gifSearch(q) {
  clearTimeout(_gifTimer);
  _gifTimer = setTimeout(() => fetchGifs(q.trim()), 400);
}

function renderGifs(results) {
  const grid = document.getElementById('gif-grid');
  if (!grid) return;
  if (!results.length) {
    grid.innerHTML = '<p style="color:var(--text2);padding:20px;text-align:center;grid-column:span 2">No GIFs found</p>';
    return;
  }
  grid.innerHTML = results.map(r => {
    const preview = r.media_formats?.tinygif?.url || r.media_formats?.gif?.url || '';
    const full    = r.media_formats?.gif?.url || preview;
    return `<img src="${preview}" alt="" loading="lazy" onclick="pickGif('${full.replace(/'/g,'%27')}')">`;
  }).join('');
}

function pickGif(url) {
  closeGifPicker();
  if (_gifCallback) _gifCallback(decodeURIComponent(url));
}
