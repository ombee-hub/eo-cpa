// ===================================================================
// EO CPA — Interactive behaviors
// ===================================================================

(() => {
  'use strict';

  // ---------- Sticky nav border on scroll ----------
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 16);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Mobile menu toggle ----------
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    // Create backdrop element dynamically (avoids HTML edits across pages)
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    // Inject a header inside the drawer with logo (right) + close button (left)
    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'nav-drawer-header';

    const drawerLogo = document.createElement('a');
    drawerLogo.href = 'index.html';
    drawerLogo.className = 'nav-drawer-logo';
    drawerLogo.setAttribute('aria-label', 'ארז עובד רואי חשבון');
    drawerLogo.innerHTML = '<img src="images/logo-ink.png" alt="Erez Oved & Co">';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'nav-close';
    closeBtn.setAttribute('aria-label', 'סגור תפריט');
    closeBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>';

    drawerHeader.appendChild(drawerLogo);  // first in RTL flex = right side
    drawerHeader.appendChild(closeBtn);    // last in RTL flex = left side
    navMenu.prepend(drawerHeader);

    const setMenu = (open) => {
      navMenu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute('aria-label', open ? 'סגור תפריט' : 'פתח תפריט');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    closeBtn.addEventListener('click', () => setMenu(false));

    mobileToggle.addEventListener('click', () => {
      setMenu(!navMenu.classList.contains('is-open'));
    });

    // Click on backdrop closes the menu
    backdrop.addEventListener('click', () => setMenu(false));

    // Close when clicking a link inside the drawer (but NOT the dropdown trigger on mobile)
    navMenu.addEventListener('click', (e) => {
      const dropdownTrigger = e.target.closest('.nav-dropdown-trigger');
      if (dropdownTrigger && window.innerWidth <= 900) {
        // On mobile, the trigger toggles the dropdown instead of navigating
        e.preventDefault();
        dropdownTrigger.closest('.nav-dropdown').classList.toggle('is-open');
        return;
      }
      if (e.target.closest('a')) setMenu(false);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        setMenu(false);
        mobileToggle.focus();
      }
    });

    // Close when resizing back to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 900 && navMenu.classList.contains('is-open')) {
          setMenu(false);
        }
      }, 150);
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ---------- Number count-up ----------
  const counters = document.querySelectorAll('[data-countup]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.countup);
        const duration = 1600;
        const start = performance.now();
        const ease = t => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.floor(target * ease(progress));
          el.textContent = value.toLocaleString('he-IL');
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString('he-IL');
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => countObserver.observe(el));
  }

  // ---------- Smooth anchor scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---------- Current year ----------
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Accessibility widget ----------
  const a11yOptions = [
    {
      key: 'highlight-links',
      label: 'הדגשת קישורים',
      icon: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>'
    },
    {
      key: 'high-contrast',
      label: 'ניגודיות',
      icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" fill="currentColor"/>'
    },
    {
      key: 'letter-spacing',
      label: 'ריווח טקסט',
      icon: '<path d="M5 12h14M5 12l3-3M5 12l3 3M19 12l-3-3M19 12l-3 3"/><path d="M3 6h2M3 18h2M19 6h2M19 18h2"/>'
    },
    {
      key: 'large-text',
      label: 'טקסט גדול',
      icon: '<path d="M4 6h16M10 6v14M14 6v14"/>'
    },
    {
      key: 'hide-images',
      label: 'הסתרת תמונות',
      icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="3" x2="21" y2="21"/><path d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>'
    },
    {
      key: 'no-animations',
      label: 'ביטול הנפשות',
      icon: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
    },
    {
      key: 'big-cursor',
      label: 'סמן',
      icon: '<path d="M5 2l14 8-7 2-2 7z"/>'
    },
    {
      key: 'dyslexia',
      label: 'תמיכה בדיסלקציה',
      icon: '<path d="M5 7h14M9 7v10M5 17h8M16 11h4m-2-2v4"/>'
    },
    {
      key: 'line-spacing',
      label: 'גובה שורה',
      icon: '<path d="M3 6h18M3 12h18M3 18h18"/>'
    },
    {
      key: 'tooltips',
      label: 'תיאורים',
      icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="12" cy="10" r="0.5" fill="currentColor"/><path d="M12 8v1"/>'
    },
    {
      key: 'no-saturation',
      label: 'רוויה',
      icon: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>'
    },
    {
      key: 'align-text',
      label: 'יישור טקסט',
      icon: '<path d="M3 6h18M3 12h12M3 18h18M3 9h18M3 15h12"/>'
    }
  ];

  // Build the floating button
  const a11yFab = document.createElement('button');
  a11yFab.type = 'button';
  a11yFab.className = 'a11y-fab';
  a11yFab.setAttribute('aria-label', 'פתח תפריט נגישות');
  a11yFab.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="4" r="2.5"/><path d="M21 8c0-.83-.67-1.5-1.5-1.5-1.79 0-3.5.5-7.5.5s-5.71-.5-7.5-.5C3.67 6.5 3 7.17 3 8s.67 1.5 1.5 1.5h.5l3 1.5v2.5l-2 8c-.14.55.2 1.1.74 1.24.55.14 1.1-.2 1.24-.74L9.5 15h1L12 21l1.5-5h1l1.52 6c.14.54.69.88 1.24.74.54-.14.88-.69.74-1.24l-2-8V11l3-1.5h.5c.83 0 1.5-.67 1.5-1.5z"/></svg>';
  document.body.appendChild(a11yFab);

  // Build the panel
  const a11yPanel = document.createElement('div');
  a11yPanel.className = 'a11y-panel';
  a11yPanel.setAttribute('role', 'dialog');
  a11yPanel.setAttribute('aria-label', 'הגדרות נגישות');

  const optionsHTML = a11yOptions.map(opt => `
    <button type="button" class="a11y-option" data-action="${opt.key}" aria-pressed="false">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${opt.icon}</svg>
      <span>${opt.label}</span>
    </button>
  `).join('');

  a11yPanel.innerHTML = `
    <div class="a11y-panel-header">
      <h2>הגדרות נגישות</h2>
      <button type="button" class="a11y-close" aria-label="סגור">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
      </button>
    </div>
    <div class="a11y-options">${optionsHTML}</div>
    <button type="button" class="a11y-reset">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      איפוס כל ההגדרות
    </button>
    <div class="a11y-footer">
      <a href="accessibility.html">הצהרת נגישות</a>
      <span aria-hidden="true">·</span>
      <a href="privacy.html">מדיניות פרטיות</a>
    </div>
  `;
  document.body.appendChild(a11yPanel);

  // Restore saved preferences
  const a11yPrefs = JSON.parse(localStorage.getItem('a11y-prefs') || '{}');
  Object.keys(a11yPrefs).forEach(key => {
    if (a11yPrefs[key]) {
      document.body.classList.add(`a11y-${key}`);
      const btn = a11yPanel.querySelector(`[data-action="${key}"]`);
      if (btn) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
      }
    }
  });

  // Toggle the panel
  a11yFab.addEventListener('click', () => {
    a11yPanel.classList.toggle('is-open');
  });
  a11yPanel.querySelector('.a11y-close').addEventListener('click', () => {
    a11yPanel.classList.remove('is-open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!a11yPanel.classList.contains('is-open')) return;
    if (e.target === a11yFab || a11yFab.contains(e.target)) return;
    if (a11yPanel.contains(e.target)) return;
    a11yPanel.classList.remove('is-open');
  });

  // Toggle each option
  a11yPanel.querySelectorAll('.a11y-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.action;
      const isActive = document.body.classList.toggle(`a11y-${key}`);
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));

      const prefs = JSON.parse(localStorage.getItem('a11y-prefs') || '{}');
      prefs[key] = isActive;
      localStorage.setItem('a11y-prefs', JSON.stringify(prefs));
    });
  });

  // Reset all
  a11yPanel.querySelector('.a11y-reset').addEventListener('click', () => {
    a11yOptions.forEach(opt => {
      document.body.classList.remove(`a11y-${opt.key}`);
      const btn = a11yPanel.querySelector(`[data-action="${opt.key}"]`);
      if (btn) {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
    localStorage.removeItem('a11y-prefs');
  });
})();
