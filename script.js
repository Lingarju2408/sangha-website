// =========================================================
// CHIKKURU BAGILU JAI SHRI RAM YUVAKARA SANGHA — shared script
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- sticky header on scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const scrim = document.querySelector('.nav-scrim');
  function closeNav() {
    mainNav && mainNav.classList.remove('open');
    scrim && scrim.classList.remove('open');
  }
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      scrim && scrim.classList.toggle('open');
    });
    scrim && scrim.addEventListener('click', closeNav);
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('.stat-item .num[data-target]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animateCounter(e.target);
            io2.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(c => io2.observe(c));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Gowri Ganesha festival countdown ---------- */
  const countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    const target = new Date(countdown.getAttribute('data-countdown')).getTime();
    const dEl = countdown.querySelector('[data-c-days]');
    const hEl = countdown.querySelector('[data-c-hours]');
    const mEl = countdown.querySelector('[data-c-mins]');
    const sEl = countdown.querySelector('[data-c-secs]');
    function update() {
      const now = Date.now();
      let diff = target - now;
      if (diff < 0) diff = 0;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (dEl) dEl.textContent = String(days);
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
  }

  /* ---------- generic filter buttons (events / gallery) ---------- */
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const targetSelector = group.getAttribute('data-filter-group');
    const items = document.querySelectorAll(targetSelector);
    group.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-cat');
        items.forEach(item => {
          const show = cat === 'all' || item.getAttribute('data-cat') === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  });

  /* ---------- gallery lightbox ---------- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const media = lightbox.querySelector('.lightbox-media');
    const caption = lightbox.querySelector('.lightbox-caption');
    let idx = 0;
    function openAt(i) {
      idx = i;
      const item = galleryItems[idx];
      media.innerHTML = item.querySelector('.ph').innerHTML;
      media.style.background = getComputedStyle(item.querySelector('.ph')).background;
      caption.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('open');
    }
    galleryItems.forEach((item, i) => item.addEventListener('click', () => openAt(i)));
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.querySelector('[data-lb-prev]').addEventListener('click', () => openAt((idx - 1 + galleryItems.length) % galleryItems.length));
    lightbox.querySelector('[data-lb-next]').addEventListener('click', () => openAt((idx + 1) % galleryItems.length));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowRight') openAt((idx + 1) % galleryItems.length);
      if (e.key === 'ArrowLeft') openAt((idx - 1 + galleryItems.length) % galleryItems.length);
    });
  }

  /* ---------- membership form: member type + interest chips ---------- */
  document.querySelectorAll('.member-type').forEach(card => {
    card.addEventListener('click', () => {
      card.parentElement.querySelectorAll('.member-type').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const input = card.parentElement.parentElement.querySelector('input[name="memberType"]');
      if (input) input.value = card.getAttribute('data-value');
    });
  });
  document.querySelectorAll('.chip-select .chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

  /* ---------- membership / contact form submit ---------- */
  document.querySelectorAll('form[data-success-target]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetSel = form.getAttribute('data-success-target');
      const successBox = document.querySelector(targetSel);
      form.style.display = 'none';
      if (successBox) successBox.classList.add('show');
      window.scrollTo({ top: form.closest('.form-card').offsetTop - 100, behavior: 'smooth' });
    });
  });

});
