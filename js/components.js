function avatarHtml(profile, size = 40) {
  if (profile.avatar_url) {
    return `<img src="${escapeHtml(profile.avatar_url)}" class="avatar" style="width:${size}px;height:${size}px;" alt="">`;
  }
  const initials = (profile.display_name || profile.username || '?').slice(0,2).toUpperCase();
  return `<div class="avatar-placeholder" style="width:${size}px;height:${size}px;font-size:${Math.floor(size*0.4)}px;">${escapeHtml(initials)}</div>`;
}

function badgeHtml(profile) {
  if (!profile) return '';
  if (profile.is_super_admin) return `<span class="badge badge-super-admin" data-tooltip="Super Admin"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg></span>`;
  if (profile.is_admin) return `<span class="badge badge-admin" data-tooltip="Administrator"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg></span>`;
  if (profile.is_verified) return `<span class="badge badge-verified" data-tooltip="Verified"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg></span>`;
  return '';
}

// Escapes text and turns #hashtags into clickable links
function hashtagify(text) {
  if (!text) return '';
  return escapeHtml(text).replace(/#(\w+)/g,
    '<a href="explore.html?q=%23$1" onclick="event.stopPropagation()" style="color:var(--accent)">#$1</a>');
}

function sidebarHtml(active, profile) {
  const navItems = [
    { href: 'home.html',   id: 'home',          label: 'Home',          icon: `<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>` },
    { href: 'shorts.html', id: 'shorts',         label: 'Shorts',        icon: `<path d="M6 3h12c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm4 4v10l8-5-8-5z"/>` },
    { href: 'explore.html',id: 'explore',        label: 'Explore',       icon: `<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>` },
    { href: 'notifications.html', id: 'notifications', label: 'Notifications', icon: `<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>` },
    { href: 'dm.html',     id: 'dm',            label: 'Messages',      icon: `<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>` },
    { href: 'bookmarks.html', id: 'bookmarks',  label: 'Bookmarks',     icon: `<path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>` },
    { href: `profile.html?id=${profile ? profile.id : ''}`, id: 'profile', label: 'Profile', icon: `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>` },
  ];

  const adminItem = profile && (profile.is_admin || profile.is_super_admin)
    ? `<a href="admin.html" class="nav-item ${active==='admin'?'active':''}">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
        <span>Admin</span></a>` : '';

  const links = navItems.map(item => `
    <a href="${item.href}" class="nav-item ${active===item.id?'active':''}">
      <svg viewBox="0 0 24 24" fill="currentColor">${item.icon}</svg>
      <span>${item.label}</span>
    </a>`).join('') + adminItem;

  const profileSection = profile ? `
    <div class="sidebar-profile-wrap" id="sidebar-profile-wrap">
      <div class="sidebar-profile-inner">
        <a href="profile.html?id=${profile.id}" class="sidebar-profile-link">
          ${avatarHtml(profile, 40)}
          <div class="info">
            <div class="display-name">${escapeHtml(profile.display_name||profile.username)}${badgeHtml(profile)}</div>
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
        <a href="dm.html">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          Messages
        </a>
        <a href="bookmarks.html">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
          Bookmarks
        </a>
        ${profile.is_admin || profile.is_super_admin ? `<a href="admin.html">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
          Admin panel
        </a>` : ''}
        <button onclick="openThemeModal()">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
          Display
        </button>
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
    <button class="nav-yap-btn" id="compose-nav-btn"><span>Yap</span></button>
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
  const bookmarked = window._bookmarks?.has(post.id);
  const isSimpleRepost = !!post.repost_of && !post.content;
  const isQuote       = !!post.repost_of &&  !!post.content;
  const orig          = post.original_post;

  // For a simple repost, display the original's data as the main content
  const dp    = (isSimpleRepost && orig) ? orig.profiles : post.profiles; // display profile
  const dc    = isSimpleRepost ? (orig?.content || null) : post.content;   // display content
  const dmu   = isSimpleRepost ? (orig?.media_url || null) : post.media_url;
  const dmt   = isSimpleRepost ? (orig?.media_type || null) : post.media_type;
  const dTime = isSimpleRepost ? (orig?.created_at || post.created_at) : post.created_at;
  const dId   = isSimpleRepost ? (orig?.id || post.id) : post.id;
  const dLiked = isSimpleRepost ? (orig?.liked_by_me || false) : liked;
  const dCount = isSimpleRepost ? (orig?.likes_count || 0) : (post.likes_count || 0);

  const hasReposted = window._reposts?.has(dId);
  const myRepostId  = window._reposts?.get(dId);

  const repostHeader = post.repost_of ? `
    <div class="repost-header">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 20H2v-10h5m0 10-3-3m3 3 3-3M17 4h5v10h-5m0-10 3 3m-3-3-3 3"/></svg>
      ${escapeHtml(post.profiles.display_name || post.profiles.username)} reposted
    </div>` : '';

  const mediaHtml = dmu ? `
    <div class="post-media" onclick="event.stopPropagation()">
      ${dmt === 'video'
        ? `<video src="${escapeHtml(dmu)}" controls preload="none"></video>`
        : `<img src="${escapeHtml(dmu)}" alt="" loading="lazy">`}
    </div>` : '';

  // Embedded original card for quote posts
  const quoteHtml = (isQuote && orig) ? `
    <div class="quote-card" onclick="event.stopPropagation();window.location.href='post.html?id=${orig.id}'">
      <div class="quote-card-header">
        ${avatarHtml(orig.profiles || {}, 18)}
        <span class="quote-name">${escapeHtml(orig.profiles?.display_name || orig.profiles?.username || 'Unknown')}${badgeHtml(orig.profiles||{})}</span>
        <span class="quote-handle">@${escapeHtml(orig.profiles?.username || '')}</span>
      </div>
      ${orig.content ? `<div class="quote-text">${hashtagify(orig.content)}</div>` : ''}
      ${orig.media_url ? `<img src="${escapeHtml(orig.media_url)}" style="width:100%;border-radius:8px;margin-top:6px;max-height:160px;object-fit:cover;display:block" alt="">` : ''}
    </div>` : '';

  return `
    <div class="post" data-post-id="${post.id}" onclick="openPost('${dId}',event)">
      ${repostHeader}
      <a href="profile.html?id=${dp.id}" onclick="event.stopPropagation()">${avatarHtml(dp, 40)}</a>
      <div class="post-content">
        <div class="post-header">
          <a href="profile.html?id=${dp.id}" style="display:inline-flex;align-items:center;gap:2px;font-weight:700;font-size:15px" onclick="event.stopPropagation()">${escapeHtml(dp.display_name||dp.username)}${badgeHtml(dp)}</a>
          <span class="dot">·</span>
          <span class="username">@${escapeHtml(dp.username)}</span>
          <span class="dot">·</span>
          <span class="time">${timeAgo(dTime)}</span>
        </div>
        ${dc ? `<div class="post-text">${hashtagify(dc)}</div>` : ''}
        ${mediaHtml}
        ${quoteHtml}
        <div class="post-actions">
          <button class="action-btn reply-btn" onclick="event.stopPropagation();replyToPost('${dId}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>${post.replies_count||0}</span>
          </button>
          <button class="action-btn repost-btn ${hasReposted?'reposted':''}"
            onclick="event.stopPropagation();toggleRepost('${dId}','${myRepostId||''}',this)"
            data-reposted="${hasReposted?'1':'0'}" title="${hasReposted?'Undo repost':'Repost'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          </button>
          <button class="action-btn like-btn ${dLiked?'liked':''}" onclick="event.stopPropagation();toggleLike('${dId}',this)" data-liked="${dLiked?'1':'0'}" data-count="${dCount}">
            <svg viewBox="0 0 24 24" fill="${dLiked?'currentColor':'none'}" stroke="currentColor" stroke-width="1.75"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>${dCount}</span>
          </button>
          <button class="action-btn bookmark-btn ${bookmarked?'bookmarked':''}"
            onclick="event.stopPropagation();toggleBookmark('${post.id}',this)"
            data-bookmarked="${bookmarked?'1':'0'}" title="${bookmarked?'Remove bookmark':'Bookmark'}">
            <svg viewBox="0 0 24 24" fill="${bookmarked?'currentColor':'none'}" stroke="currentColor" stroke-width="1.75"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button class="action-btn share-btn"
            data-post-id="${dId}"
            data-post-content="${escapeHtml(((dc||'')).slice(0,120))}"
            onclick="event.stopPropagation();openShareMenu(this,event)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </button>
          ${(post.user_id === currentUserId || window.currentProfile?.is_admin || window.currentProfile?.is_super_admin) ? `
          <button class="action-btn" style="color:var(--danger);margin-left:auto" title="Delete Yap"
            onclick="event.stopPropagation();feedDeletePost('${post.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>` : ''}
        </div>
      </div>
    </div>`;
}

// ── Repost toggle ─────────────────────────────────────────────
async function toggleRepost(originalPostId, myRepostId, btn) {
  const hasReposted = btn.dataset.reposted === '1';
  btn.disabled = true;
  if (hasReposted && myRepostId) {
    const { error } = await _supabase.from('posts').delete().eq('id', myRepostId);
    if (error) { showToast('Error: ' + error.message); btn.disabled = false; return; }
    window._reposts?.delete(originalPostId);
    btn.dataset.reposted = '0';
    btn.classList.remove('reposted');
    btn.title = 'Repost';
  } else {
    const { data, error } = await _supabase.from('posts').insert({
      user_id: window.currentProfile.id,
      repost_of: originalPostId,
      content: null
    }).select('id').single();
    if (error) { showToast('Error: ' + error.message); btn.disabled = false; return; }
    window._reposts = window._reposts || new Map();
    window._reposts.set(originalPostId, data.id);
    btn.dataset.reposted = '1';
    btn.classList.add('reposted');
    btn.title = 'Undo repost';
    showToast('Reposted!');
  }
  btn.disabled = false;
}

// ── Quote post modal ──────────────────────────────────────────
let _quotePostId = null;

function openQuoteModal(postId, previewText) {
  _quotePostId = postId;
  let modal = document.getElementById('quote-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quote-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:500px" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="document.getElementById('quote-modal').style.display='none'">✕</button>
        <h2 style="margin-bottom:16px">Quote Yap</h2>
        <textarea id="quote-text" placeholder="Add a comment…" maxlength="280"
          style="width:100%;background:none;border:none;outline:none;color:var(--text);font-size:17px;resize:none;min-height:80px;font-family:inherit;margin-bottom:12px"
          oninput="document.getElementById('quote-send').disabled=!this.value.trim()"></textarea>
        <div class="quote-card" id="quote-preview" style="cursor:default;margin-bottom:16px"></div>
        <button class="btn-accent" id="quote-send" onclick="submitQuote()" disabled>Quote Yap</button>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
    document.body.appendChild(modal);
  }
  document.getElementById('quote-text').value = '';
  document.getElementById('quote-send').disabled = true;
  document.getElementById('quote-preview').textContent = previewText ? `"${previewText}"` : '(media post)';
  modal.style.display = 'flex';
}

async function submitQuote() {
  const content = document.getElementById('quote-text').value.trim();
  if (!content || !_quotePostId) return;
  const btn = document.getElementById('quote-send');
  btn.disabled = true; btn.textContent = 'Posting…';
  const { error } = await _supabase.from('posts').insert({
    user_id: window.currentProfile.id,
    content,
    repost_of: _quotePostId
  });
  if (error) { showToast('Error: ' + error.message); btn.disabled = false; btn.textContent = 'Quote Yap'; return; }
  document.getElementById('quote-modal').style.display = 'none';
  showToast('Quoted!');
  btn.textContent = 'Quote Yap';
  if (typeof loadFeed === 'function') loadFeed();
}

// ── Bookmark toggle ───────────────────────────────────────────
async function toggleBookmark(postId, btn) {
  const isBookmarked = btn.dataset.bookmarked === '1';
  btn.disabled = true;
  if (isBookmarked) {
    await _supabase.from('bookmarks').delete().eq('user_id', window.currentProfile.id).eq('post_id', postId);
    window._bookmarks?.delete(postId);
    btn.dataset.bookmarked = '0';
    btn.classList.remove('bookmarked');
    btn.querySelector('svg').setAttribute('fill', 'none');
    btn.title = 'Bookmark';
    showToast('Bookmark removed');
  } else {
    await _supabase.from('bookmarks').insert({ user_id: window.currentProfile.id, post_id: postId });
    window._bookmarks = window._bookmarks || new Set();
    window._bookmarks.add(postId);
    btn.dataset.bookmarked = '1';
    btn.classList.add('bookmarked');
    btn.querySelector('svg').setAttribute('fill', 'currentColor');
    btn.title = 'Remove bookmark';
    showToast('Bookmarked!');
  }
  btn.disabled = false;
}

// ── Share menu ────────────────────────────────────────────────
let _sharePost = null;

function openShareMenu(btn, e) {
  e.stopPropagation();
  _sharePost = { id: btn.dataset.postId, content: btn.dataset.postContent };
  let menu = document.getElementById('share-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'share-menu';
    menu.className = 'share-menu';
    menu.innerHTML = `
      <div class="share-menu-item" onclick="copyPostLink()">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
        Copy link
      </div>
      <div class="share-menu-item" onclick="openQuoteModal(_sharePost.id, _sharePost.content);document.getElementById('share-menu').style.display='none'">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm-2 12H5V7h14v8z"/></svg>
        Quote Yap
      </div>
      <div class="share-menu-item" onclick="openShareDMModal()">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        Send via DM
      </div>`;
    document.body.appendChild(menu);
    document.addEventListener('click', () => { menu.style.display = 'none'; });
  }
  const rect = btn.getBoundingClientRect();
  const menuH = 140;
  const top = rect.bottom + 4 + menuH > window.innerHeight ? rect.top - menuH - 4 : rect.bottom + 4;
  menu.style.cssText = `display:block;top:${top}px;left:${Math.min(rect.left, window.innerWidth - 224)}px`;
}

function copyPostLink() {
  if (!_sharePost) return;
  const url = new URL(`post.html?id=${_sharePost.id}`, window.location.href).href;
  navigator.clipboard.writeText(url).then(() => showToast('Link copied!'));
  document.getElementById('share-menu').style.display = 'none';
}

// ── Share via DM modal ────────────────────────────────────────
let _shareDMRecipient = null;
let _shareDMSearchTimer = null;

function openShareDMModal() {
  document.getElementById('share-menu').style.display = 'none';
  let modal = document.getElementById('share-dm-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'share-dm-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:420px" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="document.getElementById('share-dm-modal').style.display='none'">✕</button>
        <h2 style="margin-bottom:16px">Send via DM</h2>
        <div class="share-post-preview" id="sdm-preview"></div>
        <input class="share-search-input" id="sdm-search" placeholder="Search people..." autocomplete="off" oninput="searchShareUsers(this.value)">
        <div class="share-user-list" id="sdm-users"><p style="color:var(--text2);text-align:center;padding:16px;font-size:14px">Type a name or username</p></div>
        <textarea class="share-msg-input" id="sdm-msg" placeholder="Add a message... (optional)" rows="2"></textarea>
        <button class="btn-accent" id="sdm-send" onclick="sendShareDM()" disabled>Send</button>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
    document.body.appendChild(modal);
  }
  _shareDMRecipient = null;
  document.getElementById('sdm-preview').textContent = _sharePost?.content ? `"${_sharePost.content}${_sharePost.content.length >= 120 ? '…' : ''}"` : '(media post)';
  document.getElementById('sdm-search').value = '';
  document.getElementById('sdm-users').innerHTML = '<p style="color:var(--text2);text-align:center;padding:16px;font-size:14px">Type a name or username</p>';
  document.getElementById('sdm-msg').value = '';
  document.getElementById('sdm-send').disabled = true;
  modal.style.display = 'flex';
}

async function searchShareUsers(q) {
  clearTimeout(_shareDMSearchTimer);
  const list = document.getElementById('sdm-users');
  if (!q.trim()) { list.innerHTML = '<p style="color:var(--text2);text-align:center;padding:16px;font-size:14px">Type a name or username</p>'; return; }
  _shareDMSearchTimer = setTimeout(async () => {
    const me = window.currentProfile?.id;
    const { data } = await _supabase.from('profiles').select('id,username,display_name,avatar_url,is_verified,is_admin,is_super_admin')
      .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`).neq('id', me || '').limit(8);
    if (!data?.length) { list.innerHTML = '<p style="color:var(--text2);text-align:center;padding:16px;font-size:14px">No users found</p>'; return; }
    list.innerHTML = data.map(u => `
      <div class="share-user-row" id="srow-${u.id}" onclick="selectShareUser('${u.id}','${escapeHtml(u.display_name||u.username)}',this)">
        ${avatarHtml(u,36)}
        <div><div class="sname">${escapeHtml(u.display_name||u.username)}${badgeHtml(u)}</div><div class="shandle">@${escapeHtml(u.username)}</div></div>
      </div>`).join('');
  }, 300);
}

function selectShareUser(userId, name, row) {
  _shareDMRecipient = userId;
  document.querySelectorAll('.share-user-row').forEach(r => r.classList.remove('sel'));
  row.classList.add('sel');
  document.getElementById('sdm-search').value = name;
  document.getElementById('sdm-send').disabled = false;
}

async function sendShareDM() {
  if (!_shareDMRecipient || !_sharePost) return;
  const btn = document.getElementById('sdm-send');
  btn.disabled = true; btn.textContent = 'Sending…';
  const content = document.getElementById('sdm-msg').value.trim() || null;
  const { error } = await _supabase.from('messages').insert({
    sender_id: window.currentProfile.id,
    recipient_id: _shareDMRecipient,
    content,
    shared_post_id: _sharePost.id
  });
  if (error) { showToast('Error: ' + error.message); btn.disabled=false; btn.textContent='Send'; return; }
  document.getElementById('share-dm-modal').style.display = 'none';
  showToast('Sent!');
  btn.textContent = 'Send';
}

// ── Feed delete ───────────────────────────────────────────────
async function feedDeletePost(postId) {
  if (!confirm('Delete this Yap?')) return;
  const { error } = await _supabase.from('posts').delete().eq('id', postId);
  if (error) { showToast('Error: ' + error.message); return; }
  const el = document.querySelector(`[data-post-id="${postId}"]`);
  if (el) el.remove();
  showToast('Yap deleted');
}

// ── Sidebar dropdown ──────────────────────────────────────────
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

// ── Utilities ─────────────────────────────────────────────────
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
  const url = new URL(`post.html?id=${postId}`, window.location.href).href;
  navigator.clipboard.writeText(url).then(()=>showToast('Link copied!')).catch(()=>showToast('Could not copy'));
}
