/* =========================================================
   เทียนหอมไล่ยุงจากสมุนไพร — main.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Highlight current page in nav ---------- */
  var here = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Animated stat counters (home hero) ---------- */
  var stats = document.querySelectorAll('[data-count-to]');
  if (stats.length && 'IntersectionObserver' in window) {
    var counted = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          stats.forEach(animateCount);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(function (el) { io.observe(el); });
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 900;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var lastFocused = null;

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        var caption = item.getAttribute('data-caption') || img.alt;
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCaption.textContent = caption;
        lastFocused = item;
        lightbox.classList.add('is-open');
        closeBtn.focus();
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* ---------- Contact form validation (front-end only) ---------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var isEmpty = input.value.trim() === '';
        var isBadEmail = input.type === 'email' && input.value.trim() !== '' &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (isEmpty || isBadEmail) {
          valid = false;
          field.classList.add('has-error');
        } else {
          field.classList.remove('has-error');
        }
      });

      if (valid) {
        status.textContent = 'ขอบคุณสำหรับข้อความของคุณ ทีมผู้จัดทำจะติดต่อกลับโดยเร็วที่สุด (นี่คือฟอร์มตัวอย่างสำหรับโครงงาน ยังไม่เชื่อมต่อระบบส่งอีเมลจริง)';
        status.classList.add('is-visible');
        form.reset();
      } else {
        status.textContent = 'กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วนและถูกต้อง';
        status.classList.add('is-visible');
      }
    });
  }

  /* ---------- Accordion (benefits / caution page) ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear() + 543; // พ.ศ.
  });
});
