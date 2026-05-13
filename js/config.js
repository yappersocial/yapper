// ── Theme + accent (applied before render to prevent flash) ──────────────
(function applyTheme() {
  const html = document.documentElement;
  html.setAttribute('data-theme',  localStorage.getItem('yapper-theme')  || 'dark');
  html.setAttribute('data-accent', localStorage.getItem('yapper-accent') || 'iris');
})();

function setYapperTheme(theme) {
  localStorage.setItem('yapper-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}
function setYapperAccent(accent) {
  localStorage.setItem('yapper-accent', accent);
  document.documentElement.setAttribute('data-accent', accent);
}

function openThemeModal() {
  const theme  = localStorage.getItem('yapper-theme')  || 'dark';
  const accent = localStorage.getItem('yapper-accent') || 'iris';
  let modal = document.getElementById('theme-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'theme-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:480px" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="document.getElementById('theme-modal').style.display='none'">✕</button>
        <h2 style="margin-bottom:20px">Customize your view</h2>

        <div class="theme-section">
          <h3>Background</h3>
          <div class="theme-options">
            <button class="theme-option" data-theme="dark"  onclick="pickTheme('dark')">
              <div class="theme-preview theme-preview-dark"></div>
              <span>Dark</span>
            </button>
            <button class="theme-option" data-theme="light" onclick="pickTheme('light')">
              <div class="theme-preview theme-preview-light"></div>
              <span>Light</span>
            </button>
          </div>
        </div>

        <div class="theme-section" style="margin-bottom:0">
          <h3>Color accent</h3>
          <div class="accent-options">
            <button class="accent-option" data-accent="iris"   onclick="pickAccent('iris')">
              <div class="accent-swatch accent-iris"></div><span>Iris</span>
            </button>
            <button class="accent-option" data-accent="sunset" onclick="pickAccent('sunset')">
              <div class="accent-swatch accent-sunset"></div><span>Sunset</span>
            </button>
            <button class="accent-option" data-accent="forest" onclick="pickAccent('forest')">
              <div class="accent-swatch accent-forest"></div><span>Forest</span>
            </button>
            <button class="accent-option" data-accent="mono"   onclick="pickAccent('mono')">
              <div class="accent-swatch accent-mono"></div><span>Mono</span>
            </button>
          </div>
        </div>
      </div>`;
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    document.body.appendChild(modal);
  }
  modal.querySelectorAll('.theme-option').forEach(b => b.classList.toggle('selected', b.dataset.theme === (localStorage.getItem('yapper-theme') || 'dark')));
  modal.querySelectorAll('.accent-option').forEach(b => b.classList.toggle('selected', b.dataset.accent === (localStorage.getItem('yapper-accent') || 'iris')));
  modal.style.display = 'flex';
}

function pickTheme(theme) {
  setYapperTheme(theme);
  document.querySelectorAll('#theme-modal .theme-option').forEach(b => b.classList.toggle('selected', b.dataset.theme === theme));
}
function pickAccent(accent) {
  setYapperAccent(accent);
  document.querySelectorAll('#theme-modal .accent-option').forEach(b => b.classList.toggle('selected', b.dataset.accent === accent));
}

const SUPABASE_URL = 'https://fcnahusuafrxppxwrfau.supabase.co';
// Get a free Giphy key: developers.giphy.com → Log in → Create an App → API Key
const GIPHY_KEY = 'RRX4WFoj81k1wqEbRwvKhxjvJKFFcSxn';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbmFodXN1YWZyeHBweHdyZmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MDU1MDMsImV4cCI6MjA5NDE4MTUwM30.64OocHwwuNRWw5k0IrkY9aq7KKaCBiI5_PqoQGc4n2k';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function requireAuth(redirectTo = 'auth.html') {
  const { data: { session } } = await _supabase.auth.getSession();
  if (!session) { window.location.href = redirectTo; return null; }
  return session;
}

async function requireNoAuth(redirectTo = 'home.html') {
  const { data: { session } } = await _supabase.auth.getSession();
  if (session) { window.location.href = redirectTo; return null; }
  return true;
}

async function getCurrentProfile() {
  const { data: { session } } = await _supabase.auth.getSession();
  if (!session) return null;
  const { data } = await _supabase.from('profiles').select('*').eq('id', session.user.id).single();
  if (data?.is_banned) { window.location.href = 'banned.html'; return null; }
  return data;
}

// Batch-fetches original posts for any reposts/quotes in the array.
// Attaches .original_post and sets liked_by_me/likes_count on originals.
async function attachOriginals(posts, myId) {
  const ids = [...new Set(posts.filter(p => p.repost_of).map(p => p.repost_of))];
  if (!ids.length) return posts;
  const { data } = await _supabase.from('posts')
    .select(`*, profiles!user_id(id,username,display_name,avatar_url,is_verified,is_admin,is_super_admin), likes(user_id)`)
    .in('id', ids);
  const map = {};
  for (const p of (data || [])) {
    map[p.id] = { ...p, liked_by_me: (p.likes||[]).some(l => l.user_id === myId), likes_count: (p.likes||[]).length };
  }
  return posts.map(p => p.repost_of ? { ...p, original_post: map[p.repost_of] || null } : p);
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  if (diff < 604800) return `${Math.floor(diff/86400)}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
