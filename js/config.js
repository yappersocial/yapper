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
