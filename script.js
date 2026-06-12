/* ============================================================
   NexaStudio — script.js
   Handles: dark mode, navbar, hamburger, scroll animations,
            form validation, back-to-top, smooth scroll
============================================================ */

// ── HELPERS ──────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ── 1. DARK MODE TOGGLE ─────────────────────────────────
   Saves preference to localStorage so it persists.        */
const html       = document.documentElement;
const themeToggle = $('#themeToggle');
const themeIcon  = $('#themeIcon');

function setTheme(dark) {
  if (dark) {
    html.setAttribute('data-theme', 'dark');
    themeIcon.className = 'ph ph-moon';
    localStorage.setItem('nexaTheme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    themeIcon.className = 'ph ph-sun';
    localStorage.setItem('nexaTheme', 'light');
  }
}

// Load saved preference on page load
const savedTheme = localStorage.getItem('nexaTheme');
if (savedTheme === 'dark') setTheme(true);

// Toggle on button click
themeToggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
});

/* ── 2. STICKY NAVBAR SHADOW ─────────────────────────────
   Adds 'scrolled' class when user scrolls past 20px.      */
const navbar = $('#navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── 3. HAMBURGER MENU ───────────────────────────────────
   Toggles mobile nav open/close.                          */
const hamburger = $('#hamburger');
const navLinks  = $('#navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  // Accessibility
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* ── 4. ACTIVE NAV LINK ON SCROLL ────────────────────────
   Highlights the nav link matching the current section.   */
const sections = $$('section[id]');

function updateActiveLink() {
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = $(`.nav-link[href="#${id}"]`);

    if (link) {
      link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink(); // run on load

/* ── 5. SCROLL REVEAL ANIMATIONS ────────────────────────
   Uses IntersectionObserver for performant scroll reveals. */
const revealEls = $$('.reveal, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      // Unobserve after reveal so it doesn't re-trigger
      revealObserver.unobserve(el);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ── 6. FORM VALIDATION ──────────────────────────────────
   Validates name, email, and message before "sending".    */
const form         = $('#contactForm');
const nameInput    = $('#name');
const emailInput   = $('#email');
const messageInput = $('#message');
const submitBtn    = $('#submitBtn');
const formSuccess  = $('#formSuccess');

// Validation helpers
function showError(inputEl, errorId, message) {
  inputEl.classList.add('error');
  const errEl = $(`#${errorId}`);
  if (errEl) errEl.textContent = message;
}

function clearError(inputEl, errorId) {
  inputEl.classList.remove('error');
  const errEl = $(`#${errorId}`);
  if (errEl) errEl.textContent = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Live validation: clear errors when user types
nameInput.addEventListener('input', () => clearError(nameInput, 'nameError'));
emailInput.addEventListener('input', () => clearError(emailInput, 'emailError'));
messageInput.addEventListener('input', () => clearError(messageInput, 'messageError'));

// Form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;

  // Validate name
  const name = nameInput.value.trim();
  if (!name) {
    showError(nameInput, 'nameError', 'Please enter your full name.');
    valid = false;
  } else if (name.length < 2) {
    showError(nameInput, 'nameError', 'Name must be at least 2 characters.');
    valid = false;
  }

  // Validate email
  const email = emailInput.value.trim();
  if (!email) {
    showError(emailInput, 'emailError', 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(email)) {
    showError(emailInput, 'emailError', 'Please enter a valid email address.');
    valid = false;
  }

  // Validate message
  const message = messageInput.value.trim();
  if (!message) {
    showError(messageInput, 'messageError', 'Please enter your message.');
    valid = false;
  } else if (message.length < 20) {
    showError(messageInput, 'messageError', 'Message should be at least 20 characters.');
    valid = false;
  }

  if (!valid) return;

  // Simulate sending (no real backend)
  submitBtn.disabled = true;
  const btnText = submitBtn.querySelector('.btn-text');
  btnText.textContent = 'Sending...';

  setTimeout(() => {
    // Reset form
    form.reset();
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';

    // Show success message
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1500);
});

/* ── 7. BACK TO TOP BUTTON ───────────────────────────────
   Shows after scrolling down 400px; smooth scrolls up.    */
const backToTop = $('#backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 8. SMOOTH SCROLL FOR ALL ANCHOR LINKS ───────────────
   Handles offset for fixed navbar height.                  */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = $(targetId);
    if (!target) return;

    e.preventDefault();

    const navbarHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ── 9. HERO REVEAL ON LOAD ──────────────────────────────
   Staggers the hero elements with a short delay.          */
window.addEventListener('DOMContentLoaded', () => {
  // Trigger hero reveals slightly after load
  const heroEls = $$('.hero .reveal, .hero .reveal-right');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });
});