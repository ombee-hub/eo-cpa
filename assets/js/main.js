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
})();
