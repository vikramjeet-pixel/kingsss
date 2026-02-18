/* ============================================================
   FILTER.JS — Kings Court Hotel
   Room category filter with smooth animations
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const filterBtns = document.querySelectorAll('.rooms-filter__btn');
    const roomCards  = document.querySelectorAll('.rooms-grid .room-card');
    const noResults  = document.getElementById('rooms-no-results');

    // Guard: only run on pages with the filter
    if (!filterBtns.length || !roomCards.length) return;

    /* ── Count cards per category ── */
    const counts = { all: roomCards.length };
    roomCards.forEach(card => {
        const cat = card.dataset.category;
        if (cat) counts[cat] = (counts[cat] || 0) + 1;
    });

    // Update count badges
    Object.entries(counts).forEach(([cat, n]) => {
        const badge = document.getElementById(`count-${cat}`);
        if (badge) badge.textContent = n;
    });

    /* ── Filter Logic ── */
    const filterRooms = (activeFilter) => {
        let visibleCount = 0;

        roomCards.forEach((card, i) => {
            const cat = card.dataset.category;
            const matches = activeFilter === 'all' || cat === activeFilter;

            if (matches) {
                card.classList.remove('is-hidden');
                // Stagger the fade-in animation
                card.style.animationDelay = `${i * 0.06}s`;
                card.classList.add('is-filtering');
                // Remove animation class after it plays so it can re-trigger
                card.addEventListener('animationend', () => {
                    card.classList.remove('is-filtering');
                    card.style.animationDelay = '';
                }, { once: true });
                visibleCount++;
            } else {
                card.classList.add('is-hidden');
                card.classList.remove('is-filtering');
            }
        });

        // Show/hide no-results message
        if (noResults) {
            noResults.hidden = visibleCount > 0;
        }
    };

    /* ── Button Click Handlers ── */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active state & aria-pressed
            filterBtns.forEach(b => {
                b.classList.remove('rooms-filter__btn--active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('rooms-filter__btn--active');
            btn.setAttribute('aria-pressed', 'true');

            // Apply filter
            filterRooms(filter);

            // Smooth scroll to grid if below fold
            const grid = document.getElementById('rooms-grid');
            if (grid) {
                const nav = document.getElementById('main-nav');
                const navH = nav ? nav.offsetHeight : 90;
                const top = grid.getBoundingClientRect().top + window.scrollY - navH - 24;
                if (window.scrollY > top + 200) {
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    /* ── Keyboard navigation for filter buttons ── */
    filterBtns.forEach((btn, index) => {
        btn.addEventListener('keydown', (e) => {
            let targetIndex = null;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                targetIndex = (index + 1) % filterBtns.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                targetIndex = (index - 1 + filterBtns.length) % filterBtns.length;
            }
            if (targetIndex !== null) {
                e.preventDefault();
                filterBtns[targetIndex].focus();
                filterBtns[targetIndex].click();
            }
        });
    });

    /* ── URL hash filter support ── */
    // e.g. rooms.html#standard will pre-select that filter
    const hash = window.location.hash.replace('#', '');
    if (hash && ['standard', 'superior', 'family'].includes(hash)) {
        const targetBtn = document.querySelector(`[data-filter="${hash}"]`);
        if (targetBtn) targetBtn.click();
    }

});
