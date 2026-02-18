/* ============================================================
   ANIMATIONS.JS — Kings Court Hotel
   Parallax, counter animations, page transitions
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ── Parallax on Hero Background ── */
    const heroBg = document.querySelector('.hero__bg img');

    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroBg.style.transform = `scale(1.0) translateY(${scrollY * 0.3}px)`;
            }
        }, { passive: true });
    }

    /* ── Animated Number Counters ── */
    const counters = document.querySelectorAll('[data-counter]');

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    /* ── Stagger Children Animation ── */
    const staggerParents = document.querySelectorAll('[data-stagger]');

    if (staggerParents.length > 0) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, i) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, i * 120);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        staggerParents.forEach(el => {
            Array.from(el.children).forEach(child => child.classList.add('reveal'));
            staggerObserver.observe(el);
        });
    }

    /* ── Page Transition Fade-in ── */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

    /* ── Fade-out on internal link navigation ── */
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (
            href &&
            !href.startsWith('#') &&
            !href.startsWith('http') &&
            !href.startsWith('mailto') &&
            !href.startsWith('tel')
        ) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = href;
                }, 350);
            });
        }
    });

});
