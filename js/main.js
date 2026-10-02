/* =========================================================
   เทียนหอมไล่ยุงจากสมุนไพร — main.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  document.addEventListener('keydown', function (e) {
    var l = document.querySelector('.nav-links.is-open'), t = document.querySelector('.nav-toggle');
    if (e.key === 'Escape' && l) { l.classList.remove('is-open'); t.classList.remove('is-open'); t.setAttribute('aria-expanded', 'false'); t.focus(); }
  });

  /* ---------- In-page sub navigation (scroll spy) ---------- */
  var sn = document.querySelectorAll('.subnav a'), tg = [];
  sn.forEach(function (a) { var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) tg.push([a, t]); });
  function spy() {
    var cur = null;
    tg.forEach(function (p) { if (p[1].getBoundingClientRect().top <= 180) cur = p[0]; });
    sn.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (cur) { cur.setAttribute('aria-current', 'true'); var bar = cur.parentNode; bar.scrollLeft = cur.offsetLeft - (bar.clientWidth - cur.offsetWidth) / 2; }
  }
  if (tg.length) { window.addEventListener('scroll', spy, { passive: true }); }

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

  /* ---------- Experiment calculator ---------- */
  var calc = document.querySelector('.calc');
  if (calc) {
    var out = calc.querySelector('.calc-out');
    calc.addEventListener('input', function () {
      var c = 0, t = 0, n = 0;
      calc.querySelectorAll('tbody tr').forEach(function (r) {
        var a = r.querySelector('[data-k=c]').value, b = r.querySelector('[data-k=t]').value;
        if (a !== '' && b !== '') { c += +a; t += +b; n++; }
      });
      if (!n || c <= 0) { out.textContent = 'กรอกจำนวนยุงของทั้งสองจุดอย่างน้อย 1 ครั้ง (จุดควบคุมต้องมากกว่า 0) เพื่อดูผล'; return; }
      var p = Math.round(Math.abs(c - t) / c * 100);
      out.textContent = 'จาก ' + n + ' ครั้ง จุดควบคุมรวม ' + c + ' ตัว จุดทดสอบรวม ' + t + ' ตัว: จำนวนยุง' + (t <= c ? 'ลดลง ' : 'เพิ่มขึ้น ') + p + '%' + (n < 3 ? ' (ควรทำอย่างน้อย 3 ครั้ง)' : '');
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
