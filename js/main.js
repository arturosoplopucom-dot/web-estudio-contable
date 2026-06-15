/**
 * Integra Soluciones Empresariales — main.js
 * Módulos:
 * 1. Utilidades
 * 2. Slider principal (Hero)
 * 3. Navegación (sticky, mobile, scroll-spy)
 * 4. Acordeón FAQ
 * 5. Formulario de Contacto
 * 6. Botón volver arriba
 * 7. Año en footer
 */

'use strict';

/* ==========================================================================
   1. UTILIDADES
   ========================================================================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Debounce */
function debounce(fn, ms = 100) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

/* ==========================================================================
   2. SLIDER HERO
   ========================================================================== */
function initSlider() {
  const slider = $('.slider');
  if (!slider) return;

  const slides = $$('.slide', slider);
  const dots   = $$('.slider-dots .dot', slider);
  const prev   = $('.slider-prev', slider);
  const next   = $('.slider-next', slider);
  let current  = 0;
  let timer    = null;
  const INTERVAL = 5500;

  function goTo(index) {
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function resetAuto() { startAuto(); }

  if (prev) prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  // Swipe en touch
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) { goTo(current + (delta > 0 ? 1 : -1)); resetAuto(); }
  }, { passive: true });

  // Pausa en hover (prefer-reduced-motion: los intervalos ya respetan esto)
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', startAuto);

  startAuto();
}

/* ==========================================================================
   3. NAVEGACIÓN
   ========================================================================== */
function initNav() {
  const header  = $('.site-header');
  const toggle  = $('.nav-toggle');
  const nav     = $('#main-nav');
  const links   = $$('#main-nav a[href^="#"]');
  const sections = $$('section[id], main[id]');

  // Mobile toggle
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });

    // Cerrar al hacer clic en un enlace
    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      });
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', e => {
      if (!header.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      }
    });
  }

  // Scroll-spy
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: `-${110}px 0px -60% 0px` });

  sections.forEach(s => observer.observe(s));
}

/* ==========================================================================
   4. ACORDEÓN FAQ
   ========================================================================== */
function initFAQ() {
  const items = $$('.faq-item');

  items.forEach(item => {
    const btn    = $('.faq-question', item);
    const answer = $('.faq-answer', item);
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás
      items.forEach(other => {
        if (other !== item) {
          const otherBtn = $('.faq-question', other);
          const otherAns = $('.faq-answer', other);
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!open));
      answer.hidden = open;
    });
  });
}

/* ==========================================================================
   5. FORMULARIO DE CONTACTO
   ========================================================================== */
function initForm() {
  const form = $('#contact-form');
  if (!form) return;

  const feedback = $('#form-feedback');
  const submitBtn = form.querySelector('.form-submit');
  const btnText   = form.querySelector('.btn-text');
  const btnLoad   = form.querySelector('.btn-loading');

  function showError(input, msg) {
    const errEl = input.parentElement.querySelector('.field-error');
    if (errEl) errEl.textContent = msg;
    input.style.borderColor = '#d94040';
  }

  function clearError(input) {
    const errEl = input.parentElement.querySelector('.field-error');
    if (errEl) errEl.textContent = '';
    input.style.borderColor = '';
  }

  function validateField(input) {
    clearError(input);
    if (input.required && !input.value.trim()) {
      showError(input, 'Este campo es obligatorio.');
      return false;
    }
    if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      showError(input, 'Introduce un email válido.');
      return false;
    }
    return true;
  }

  // Validación en tiempo real
  $$('input, textarea, select', form).forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => clearError(el));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const requiredFields = $$('[required]', form);
    let valid = true;
    requiredFields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) return;

    // Estado de carga
    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoad.hidden = false;
    if (feedback) { feedback.textContent = ''; feedback.className = 'form-feedback'; }

    try {
      /* ── CONECTA AQUÍ TU BACKEND / Formspree / EmailJS ──────────────
         Ejemplo con Formspree:
         const res = await fetch('https://formspree.io/f/TU_ID', {
           method: 'POST',
           body: new FormData(form),
           headers: { Accept: 'application/json' }
         });
         if (!res.ok) throw new Error('Error de red');
         ─────────────────────────────────────────────────────────────── */

      // Simulación temporal (eliminar cuando conectes tu backend)
      await new Promise(r => setTimeout(r, 1200));

      form.reset();
      feedback.textContent = '✓ Mensaje enviado. Te contactaremos en menos de 24 horas.';
      feedback.style.color = '#2d6a4f';
      feedback.style.fontWeight = '600';

    } catch (err) {
      feedback.textContent = 'Hubo un error al enviar. Por favor intenta de nuevo o escríbenos por WhatsApp.';
      feedback.style.color = '#d94040';
    } finally {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnLoad.hidden = true;
    }
  });
}

/* ==========================================================================
   6. BOTÓN VOLVER ARRIBA
   ========================================================================== */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  const toggle = debounce(() => {
    const show = window.scrollY > 500;
    btn.hidden = !show;
  }, 100);

  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   7. AÑO EN FOOTER
   ========================================================================== */
function initFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initNav();
  initFAQ();
  initForm();
  initBackToTop();
  initFooterYear();
});
