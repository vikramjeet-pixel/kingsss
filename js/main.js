/* ============================================================
   MAIN.JS — Kings Court Hotel
   Core site functionality: nav scroll, mobile menu, reveal
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky Nav on Scroll ── */
  const nav = document.getElementById('main-nav');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      nav?.classList.add('nav--scrolled');
      nav?.classList.remove('nav--transparent');
    } else {
      nav?.classList.remove('nav--scrolled');
      nav?.classList.add('nav--transparent');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run on load

  /* ── Mobile Menu Toggle ── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    mobileMenu?.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      mobileMenu?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ── Scroll Reveal Animation ── */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── Active Nav Link Highlight ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.style.color = 'var(--clr-gold)';
    }
  });

  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav?.offsetHeight || 90;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
