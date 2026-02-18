/* ============================================================
   BOOKING.JS — Kings Court Hotel
   Booking bar validation and logic
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const bookingForm = document.getElementById('booking-bar-form');
    if (!bookingForm) return;

    const checkinInput = document.getElementById('booking-checkin');
    const checkoutInput = document.getElementById('booking-checkout');
    const guestsSelect = document.getElementById('booking-guests');

    /* ── Set minimum dates ── */
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (checkinInput) checkinInput.min = todayStr;
    if (checkoutInput) checkoutInput.min = tomorrowStr;

    /* ── Auto-update checkout min when checkin changes ── */
    checkinInput?.addEventListener('change', () => {
        if (!checkinInput.value) return;

        const checkinDate = new Date(checkinInput.value);
        const nextDay = new Date(checkinDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = nextDay.toISOString().split('T')[0];

        checkoutInput.min = nextDayStr;

        // If checkout is before or equal to checkin, reset it
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
            checkoutInput.value = nextDayStr;
        }

        clearError(checkinInput.closest('.booking-bar__field'));
    });

    checkoutInput?.addEventListener('change', () => {
        clearError(checkoutInput.closest('.booking-bar__field'));
    });

    guestsSelect?.addEventListener('change', () => {
        clearError(guestsSelect.closest('.booking-bar__field'));
    });

    /* ── Form Submission ── */
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate check-in
        if (!checkinInput?.value) {
            showError(checkinInput.closest('.booking-bar__field'), 'Please select a check-in date');
            isValid = false;
        } else {
            clearError(checkinInput.closest('.booking-bar__field'));
        }

        // Validate check-out
        if (!checkoutInput?.value) {
            showError(checkoutInput.closest('.booking-bar__field'), 'Please select a check-out date');
            isValid = false;
        } else if (checkoutInput.value <= checkinInput.value) {
            showError(checkoutInput.closest('.booking-bar__field'), 'Check-out must be after check-in');
            isValid = false;
        } else {
            clearError(checkoutInput.closest('.booking-bar__field'));
        }

        // Validate guests
        if (!guestsSelect?.value || guestsSelect.value === '') {
            showError(guestsSelect.closest('.booking-bar__field'), 'Please select number of guests');
            isValid = false;
        } else {
            clearError(guestsSelect.closest('.booking-bar__field'));
        }

        if (isValid) {
            // Build query string and redirect to booking page
            const params = new URLSearchParams({
                checkin: checkinInput.value,
                checkout: checkoutInput.value,
                guests: guestsSelect.value
            });

            // Calculate nights
            const nights = Math.round(
                (new Date(checkoutInput.value) - new Date(checkinInput.value)) / (1000 * 60 * 60 * 24)
            );

            window.location.href = `booking.html?${params.toString()}&nights=${nights}`;
        }
    });

    /* ── Helpers ── */
    function showError(field, message) {
        if (!field) return;
        field.classList.add('has-error');
        const errorEl = field.querySelector('.booking-bar__error');
        if (errorEl) errorEl.textContent = message;
    }

    function clearError(field) {
        if (!field) return;
        field.classList.remove('has-error');
    }

    /* ── Pre-fill from URL params (if coming back) ── */
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkin') && checkinInput) checkinInput.value = urlParams.get('checkin');
    if (urlParams.get('checkout') && checkoutInput) checkoutInput.value = urlParams.get('checkout');
    if (urlParams.get('guests') && guestsSelect) guestsSelect.value = urlParams.get('guests');

});
