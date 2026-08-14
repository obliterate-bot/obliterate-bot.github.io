document.addEventListener('DOMContentLoaded', () => {
  initBackgroundParticles();
  initCursorGlow();
  initScrollReveal();
  initAvatar3DTilt();
  initCardGlow();
  initDiscordPreviewInteractions();
  initStatsCounter();
  initFaqAccordion();
  initCommandsExplorer();
  initKeyboardShortcuts();
});

/* ==========================================================================
   Cursor Glow Spotlight
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function update() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    glow.style.left = `${curX}px`;
    glow.style.top = `${curY}px`;
    requestAnimationFrame(update);
  }

  update();
}

/* ==========================================================================
   Scroll-Driven Reveal
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.feature-card, .section-header, .discord-window, .faq-item, .cta-box, .reveal'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
    observer.observe(el);
  });
}

/* ==========================================================================
   Card Mouse-Position Glow Illumination
   ========================================================================== */
function initCardGlow() {
  const cards = document.querySelectorAll('.feature-card, .command-card, .discord-window, .cta-box');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   Stats Counter Roll-Up Animation
   ========================================================================== */
function initStatsCounter() {
  const statEl = document.getElementById('stat-cmd-count');
  if (!statEl) return;

  const target = 1333;
  const duration = 1600;
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * target);

    statEl.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      statEl.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(animate);
}

/* ==========================================================================
   Interactive Discord Mockup Click Feedback
   ========================================================================== */
function initDiscordPreviewInteractions() {
  const buttons = document.querySelectorAll('.discord-btn');
  const msgContent = document.querySelector('.msg-content');
  if (!buttons.length || !msgContent) return;

  const responses = {
    lock: '**channel locked** — members can no longer connect',
    unlock: '**channel unlocked** — members can connect freely',
    hide: '**channel hidden** — channel is now invisible to @everyone',
    reveal: '**channel revealed** — channel visibility restored',
    claim: '**channel claimed** — you are now the channel owner',
    rename: '**renamed** — opening modal to enter new name...',
    limit: '**user limit** — opening modal to set user limit (0-99)...',
    bitrate: '**bitrate adjusted** — voice quality synced to 384kbps',
    info: '**channel info** — owner: @you · bitrate: 384kbps · limit: 10',
    delete: '**channel deleted** — temporary room closed',
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Button click micro-press
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => (btn.style.transform = 'scale(1)'), 150);

      const action = btn.textContent.trim().toLowerCase();
      const replyText = responses[action] || `executed action: ${action}`;

      // Remove existing ephemeral if any
      const existing = msgContent.querySelector('.ephemeral-feedback');
      if (existing) existing.remove();

      // Inject simulated Discord Ephemeral response
      const ephemeral = document.createElement('div');
      ephemeral.className = 'ephemeral-feedback';
      ephemeral.style.cssText = `
        margin-top: 10px;
        padding: 10px 14px;
        background: rgba(30, 31, 34, 0.95);
        border-left: 3px solid #22c55e;
        border-radius: 4px;
        color: #dbdee1;
        font-size: 0.84rem;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: fadeInSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      ephemeral.innerHTML = `
        <span>${replyText}</span>
        <small style="margin-left: auto; color: #949ba4; font-size: 0.72rem;">Only you can see this</small>
      `;

      msgContent.appendChild(ephemeral);

      setTimeout(() => {
        if (ephemeral.parentNode) {
          ephemeral.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          ephemeral.style.opacity = '0';
          ephemeral.style.transform = 'translateY(-5px)';
          setTimeout(() => ephemeral.remove(), 400);
        }
      }, 3500);
    });
  });
}

/* ==========================================================================
   Background Starfield / Particle Canvas
   ========================================================================== */
function initBackgroundParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(Math.floor((width * height) / 12000), 100);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.02 + 0.005,
    });
  }

  let mouseX = width / 2;
  let mouseY = height / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap boundaries
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Twinkle effect
      p.alpha += p.pulse;
      if (p.alpha > 0.85 || p.alpha < 0.15) {
        p.pulse = -p.pulse;
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3D Parallax Tilt for Celestial Avatar
   ========================================================================== */
function initAvatar3DTilt() {
  const container = document.querySelector('.avatar-card-container');
  const avatarBox = document.getElementById('avatar-box');
  if (!container || !avatarBox) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 14;
    const rotY = (x / (rect.width / 2)) * 14;

    avatarBox.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04, 1.04, 1.04)`;
  });

  container.addEventListener('mouseleave', () => {
    avatarBox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach((i) => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Commands Explorer (Filter, Search, Paginate, Copy)
   ========================================================================== */
let allCommands = [];
let filteredCommands = [];
let currentCategory = 'all';
let currentSearch = '';
let currentPage = 1;
let pageSize = 24;

async function initCommandsExplorer() {
  const grid = document.getElementById('commands-grid');
  const pillsContainer = document.getElementById('category-pills-container');

  try {
    const response = await fetch('assets/commands.json');
    if (!response.ok) throw new Error('Failed to load commands registry');
    const data = await response.json();

    allCommands = data.commands || [];
    filteredCommands = [...allCommands];

    // Update global stat
    const statEl = document.getElementById('stat-cmd-count');
    if (statEl) statEl.textContent = allCommands.length.toLocaleString();

    // Render Category Pills
    renderCategoryPills(data.categories, allCommands.length);

    // Initial Render
    filterCommands();
  } catch (err) {
    console.error(err);
    if (grid) {
      grid.innerHTML = `
        <div class="loading-state">
          <span>unable to fetch commands.json — check if local server is running.</span>
        </div>
      `;
    }
  }

  // Setup Search Input Listener
  const searchInput = document.getElementById('cmd-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      currentPage = 1;
      filterCommands();
    });
  }

  // Setup Page Size Buttons
  document.querySelectorAll('.size-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const size = btn.getAttribute('data-size');
      if (size === 'all') {
        pageSize = 999999;
      } else {
        pageSize = parseInt(size, 10) || 24;
      }
      currentPage = 1;
      updateCommandList();
    });
  });

  // Pagination Listeners
  const prevBtn = document.getElementById('btn-prev-page');
  const nextBtn = document.getElementById('btn-next-page');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateCommandList();
        scrollToCommands();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxPage = Math.ceil(filteredCommands.length / pageSize) || 1;
      if (currentPage < maxPage) {
        currentPage++;
        updateCommandList();
        scrollToCommands();
      }
    });
  }
}

function renderCategoryPills(categories, totalCount) {
  const container = document.getElementById('category-pills-container');
  if (!container || !categories) return;

  const sortedCats = Object.keys(categories).sort();

  let html = `
    <button class="cat-pill ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
      <span>all</span>
      <small class="pill-count">${totalCount}</small>
    </button>
  `;

  for (let cat of sortedCats) {
    const rawVal = categories[cat];
    const count = typeof rawVal === 'object' && rawVal !== null ? (rawVal.count || 0) : (rawVal || 0);
    const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
    html += `
      <button class="cat-pill ${isActive ? 'active' : ''}" data-category="${escapeHtml(cat)}">
        <span>${escapeHtml(cat.toLowerCase())}</span>
        <small class="pill-count">${count}</small>
      </button>
    `;
  }

  container.innerHTML = html;

  // Add click events to pills
  container.querySelectorAll('.cat-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.cat-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category') || 'all';
      currentPage = 1;
      filterCommands();
    });
  });
}

function filterCommands() {
  filteredCommands = allCommands.filter((cmd) => {
    // Category match
    const isAll = !currentCategory || currentCategory === 'all' || currentCategory.toLowerCase() === 'all';
    const matchesCategory = isAll || (cmd.category && cmd.category.toLowerCase() === currentCategory.toLowerCase());

    // Search query match
    let matchesSearch = true;
    if (currentSearch) {
      const nameMatch = cmd.name && cmd.name.toLowerCase().includes(currentSearch);
      const descMatch = cmd.brief && cmd.brief.toLowerCase().includes(currentSearch);
      const aliasMatch =
        cmd.aliases &&
        cmd.aliases.some((a) => a.toLowerCase().includes(currentSearch));
      const usageMatch =
        cmd.usage && cmd.usage.toLowerCase().includes(currentSearch);

      matchesSearch = nameMatch || descMatch || aliasMatch || usageMatch;
    }

    return matchesCategory && matchesSearch;
  });

  updateCommandList();
}

function updateCommandList() {
  const grid = document.getElementById('commands-grid');
  const resultsCount = document.getElementById('results-count');
  const pageIndicator = document.getElementById('page-indicator');
  const prevBtn = document.getElementById('btn-prev-page');
  const nextBtn = document.getElementById('btn-next-page');

  if (!grid) return;

  const total = filteredCommands.length;
  const maxPage = Math.ceil(total / pageSize) || 1;
  if (currentPage > maxPage) currentPage = maxPage;

  if (resultsCount) {
    resultsCount.textContent = `showing ${total.toLocaleString()} commands`;
  }

  if (pageIndicator) {
    pageIndicator.textContent = `page ${currentPage} of ${maxPage}`;
  }

  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= maxPage;

  if (total === 0) {
    grid.innerHTML = `
      <div class="loading-state">
        <span>no commands matched your search criteria.</span>
      </div>
    `;
    return;
  }

  const start = (currentPage - 1) * pageSize;
  const pageCommands = filteredCommands.slice(start, start + pageSize);

  let cardsHtml = '';
  for (let cmd of pageCommands) {
    const fullSyntax = `,${cmd.name}${cmd.usage ? ' ' + cmd.usage : ''}`;
    const permBadge =
      cmd.permissions && cmd.permissions.length > 0
        ? `<span class="badge-perm">${escapeHtml(cmd.permissions[0].toLowerCase())}</span>`
        : '';
    const aliasesHtml =
      cmd.aliases && cmd.aliases.length > 0
        ? `<div class="cmd-aliases"><strong>aliases:</strong> ${cmd.aliases.map((a) => escapeHtml(a)).join(', ')}</div>`
        : '';

    cardsHtml += `
      <div class="command-card">
        <div class="cmd-header">
          <div class="cmd-name-wrap">
            <span class="cmd-prefix">,</span>
            <span class="cmd-name">${escapeHtml(cmd.name)}</span>
          </div>
          <div class="cmd-badges">
            <span class="badge-cat">${escapeHtml(cmd.category.toLowerCase())}</span>
            ${permBadge}
          </div>
        </div>

        <p class="cmd-desc">${escapeHtml(cmd.brief)}</p>

        <div class="cmd-syntax-box">
          <span class="cmd-syntax">${escapeHtml(fullSyntax)}</span>
          <button class="btn-copy-cmd" data-copy="${escapeHtml(fullSyntax)}" title="copy command syntax">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>

        ${aliasesHtml}
      </div>
    `;
  }

  grid.innerHTML = cardsHtml;

  // Bind copy buttons
  grid.querySelectorAll('.btn-copy-cmd').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showCopyToast(`copied: ${textToCopy}`);
        });
      }
    });
  });
}

function showCopyToast(text) {
  const toast = document.getElementById('copy-toast');
  const toastText = document.getElementById('toast-text');
  if (!toast) return;

  if (toastText) toastText.textContent = text;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function scrollToCommands() {
  const section = document.getElementById('commands');
  if (section) {
    const yOffset = -70;
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      const searchInput = document.getElementById('cmd-search-input');
      if (searchInput) {
        searchInput.focus();
        scrollToCommands();
      }
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
