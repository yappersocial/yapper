const SUPABASE_URL = 'https://fcnahusuafrxppxwrfau.supabase.co';
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
  return data;
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
