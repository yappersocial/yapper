function avatarHtml(profile, size = 40) {
  if (profile.avatar_url) {
    return `<img src="${escapeHtml(profile.avatar_url)}" class="avatar" style="width:${size}px;height:${size}px;" alt="">`;
  }
  const initials = (profile.display_name || profile.username || '?').slice(0,2).toUpperCase();
  return `<div class="avatar-placeholder" style="width:${size}px;height:${size}px;font-size:${Math.floor(size*0.4)}px;">${escapeHtml(initials)}</div>`;
}

function badgeHtml(profile) {
  if (!profile) return '';
  if (profile.is_admin) {
    return `<span class="badge badge-admin" data-tooltip="Administrator"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg></span>`;
  }
  if (profile.is_verified) {
    return `<span class="badge badge-verified" data-tooltip="Verified"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg></span>`;
  }
  return '';
}

function sidebarHtml(active, profile) {
  const navItems = [
    { href: 'home.html', icon: `<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>`, label: 'Home', id: 'home' },
    { href: 'explore.html', icon: `<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>`, label: 'Explore', id: 'explore' },
    { href: 'notifications.html', icon: `<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>`, label: 'Notifications', id: 'notifications' },
    { href: `profile.html?id=${profile ? profile.id : ''}`, icon: `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>`, label: 'Profile', id: 'profile' },
  ];

  const adminItem = profile && profile.is_admin
    ? `<a href="admin.html" class="nav-item ${active === 'admin' ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
        <span>Admin</span>
      </a>`
    : '';

  const links = navItems.map(item => `
    <a href="${item.href}" class="nav-item ${active === item.id ? 'active' : ''}">
      <svg viewBox="0 0 24 24" fill="currentColor">${item.icon}</svg>
      <span>${item.label}</span>
    </a>`).join('') + adminItem;

  const profileSection = profile ? `
    <div class="sidebar-profile-wrap" id="sidebar-profile-wrap">
      <div class="sidebar-profile-inner">
        <a href="profile.html?id=${profile.id}" class="sidebar-profile-link">
          ${avatarHtml(profile, 40)}
          <div class="info">
            <div class="display-name">${escapeHtml(profile.display_name || profile.username)}${badgeHtml(profile)}</div>
            <div class="username">@${escapeHtml(profile.username)}</div>
          </div>
        </a>
        <button class="sidebar-dots-btn" id="sidebar-dots-btn" onclick="toggleSidebarDropdown(event)">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>
      <div class="sidebar-dropdown" id="sidebar-dropdown">
        <a href="profile.html?id=${profile.id}">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          View profile
        </a>
        ${profile.is_admin ? `<a href="admin.html">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
          Admin panel
        </a>` : ''}
        <hr>
        <button class="danger" onclick="yapperLogout()">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
          Log out @${escapeHtml(profile.username)}
        </button>
      </div>
    </div>` : '';

  return `
    <div class="logo">
      <span style="font-size:24px;font-weight:900;letter-spacing:-1px;">Yapper</span>
    </div>
    ${links}
    <button class="nav-yap-btn" id="compose-nav-btn">
      <span>Yap</span>
    </button>
    ${profileSection}`;
}

function asideHtml() {
  return `
    <div class="search-box">
      <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <input type="text" id="aside-search" placeholder="Search Yapper">
    </div>
    <div class="widget" id="who-to-follow">
      <h3>Who to follow</h3>
      <div id="suggestions-list"><div class="loading"><div class="spinner"></div></div></div>
    </div>`;
}

function postHtml(post, currentUserId) {
  const liked = post.liked_by_me;
  const profile = post.profiles;
  return `
    <div class="post" data-post-id="${post.id}" onclick="openPost('${post.id}',event)">
      <a href="profile.html?id=${profile.id}" onclick="event.stopPropagation()">
        ${avatarHtml(profile, 40)}
      </a>
      <div class="post-content">
        <div class="post-header">
          <a href="profile.html?id=${profile.id}" style="display:inline-flex;align-items:center;gap:2px;font-weight:700;font-size:15px" onclick="event.stopPropagation()">${escapeHtml(profile.display_name || profile.username)}${badgeHtml(profile)}</a>
          <span class="dot">·</span>
          <span class="username">@${escapeHtml(profile.username)}</span>
          <span class="dot">·</span>
          <span class="time">${timeAgo(post.created_at)}</span>
        </div>
        <div class="post-text">${escapeHtml(post.content)}</div>
        <div class="post-actions">
          <button class="action-btn reply-btn" onclick="event.stopPropagation();replyToPost('${post.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>${post.replies_count || 0}</span>
          </button>
          <button class="action-btn like-btn ${liked ? 'liked' : ''}" onclick="event.stopPropagation();toggleLike('${post.id}',this)" data-liked="${liked ? '1':'0'}" data-count="${post.likes_count||0}">
            <svg viewBox="0 0 24 24" fill="${liked ? 'currentColor':'none'}" stroke="currentColor" stroke-width="1.75"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>${post.likes_count || 0}</span>
          </button>
          <button class="action-btn share-btn" onclick="event.stopPropagation();sharePost('${post.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </button>
        </div>
      </div>
    </div>`;
}

function toggleSidebarDropdown(e) {
  e.stopPropagation();
  const d = document.getElementById('sidebar-dropdown');
  if (d) d.classList.toggle('open');
}

document.addEventListener('click', () => {
  const d = document.getElementById('sidebar-dropdown');
  if (d) d.classList.remove('open');
});

async function yapperLogout() {
  await _supabase.auth.signOut();
  window.location.href = 'auth.html';
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function openPost(postId, e) {
  if (e && e.target.closest('a,button')) return;
  window.location.href = `post.html?id=${postId}`;
}

function sharePost(postId) {
  navigator.clipboard.writeText(window.location.href.replace(/\/[^/]*$/, `/post.html?id=${postId}`))
    .then(() => showToast('Link copied!'))
    .catch(() => showToast('Could not copy link'));
}
