/* ============================================================
   SLIDER.JS — Kings Court Hotel
   Testimonial slider with auto-play, dots, and arrows
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const sliders = document.querySelectorAll('[data-slider]');

    sliders.forEach(sliderEl => {
        const track = sliderEl.querySelector('.testimonial-track');
        const slides = sliderEl.querySelectorAll('.testimonial-slide');
        const prevBtn = sliderEl.querySelector('[data-slider-prev]');
        const nextBtn = sliderEl.querySelector('[data-slider-next]');
        const dotsWrap = sliderEl.querySelector('.slider-dots');

        if (!track || slides.length === 0) return;

        let current = 0;
        let autoTimer = null;
        const total = slides.length;
        const AUTO_DELAY = 5000;

        /* ── Build dots ── */
        if (dotsWrap) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('slider-dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            });
        }

        /* ── Go to slide ── */
        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            updateDots();
            resetAuto();
        }

        /* ── Update dots ── */
        function updateDots() {
            dotsWrap?.querySelectorAll('.slider-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
        }

        /* ── Arrow buttons ── */
        prevBtn?.addEventListener('click', () => goTo(current - 1));
        nextBtn?.addEventListener('click', () => goTo(current + 1));

        /* ── Keyboard navigation ── */
        sliderEl.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goTo(current - 1);
            if (e.key === 'ArrowRight') goTo(current + 1);
        });

        /* ── Auto-play ── */
        function startAuto() {
            autoTimer = setInterval(() => goTo(current + 1), AUTO_DELAY);
        }

        function resetAuto() {
            clearInterval(autoTimer);
            startAuto();
        }

        /* ── Touch / Swipe support ── */
        let touchStartX = 0;
        let touchEndX = 0;

        sliderEl.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderEl.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                goTo(diff > 0 ? current + 1 : current - 1);
            }
        }, { passive: true });

        /* ── Pause on hover ── */
        sliderEl.addEventListener('mouseenter', () => clearInterval(autoTimer));
        sliderEl.addEventListener('mouseleave', startAuto);

        /* ── Init ── */
        startAuto();
    });

});
