let currentMainSlide = 0;
const slider = document.getElementById('mainSlider');
const slides = document.querySelectorAll('.main-slide');
const totalMainSlides = slides.length;
const dots = document.querySelectorAll('.dot-main');

(function initNavDots() {
    const nav = document.getElementById('mainNav');
    if (!nav || nav.dataset.autodots !== 'true' || nav.children.length > 0) return;
    for (let i = 0; i < totalMainSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot-main' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goToMainSlide(i));
        nav.appendChild(dot);
    }
})();

function goToMainSlide(index) {
    const i = Math.max(0, Math.min(totalMainSlides - 1, index));
    currentMainSlide = i;
    if (slider) slider.style.transform = `translateX(${-i * 100}%)`;

    document.querySelectorAll('.dot-main').forEach((d, idx) => d.classList.toggle('active', idx === i));

    slides.forEach(s => s.classList.remove('active'));
    const active = slides[i];
    if (active) {
        active.classList.add('active');
        active.scrollTop = 0;
    }

    document.querySelectorAll('.mvp-video').forEach((video) => {
        const onActive = active && active.contains(video);
        if (onActive) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentMainSlide < totalMainSlides - 1) goToMainSlide(currentMainSlide + 1);
    if (e.key === 'ArrowLeft' && currentMainSlide > 0) goToMainSlide(currentMainSlide - 1);
});

(function initMainDeckSwipe() {
    if (!slider) return;
    let startX = 0;
    let startY = 0;
    const minDx = 56;
    const maxAngle = 1.15;

    slider.addEventListener(
        'touchstart',
        (e) => {
            if (e.target.closest && (e.target.closest('.insta-carousel') || e.target.closest('.iphone-16'))) return;
            const t = e.touches[0] || e.changedTouches[0];
            if (!t) return;
            startX = t.clientX;
            startY = t.clientY;
        },
        { passive: true }
    );

    slider.addEventListener(
        'touchend',
        (e) => {
            if (e.target.closest && (e.target.closest('.insta-carousel') || e.target.closest('.iphone-16'))) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;
            if (Math.abs(dy) * maxAngle > Math.abs(dx)) return;
            if (Math.abs(dx) < minDx) return;
            if (dx < 0 && currentMainSlide < totalMainSlides - 1) goToMainSlide(currentMainSlide + 1);
            if (dx > 0 && currentMainSlide > 0) goToMainSlide(currentMainSlide - 1);
        },
        { passive: true }
    );
})();

(function initInstaCarousel() {
    const instaSlidesEl = document.getElementById('instaSlides');
    const instaCarousel = document.getElementById('instaCarousel');
    const instaDots = document.querySelectorAll('#instaDots .insta-dot');
    const totalInstaSlides = instaDots.length;

    if (!instaSlidesEl || !instaCarousel || totalInstaSlides === 0) return;

    let currentInstaSlide = 0;

    function applyInstaTransform(percentOffset) {
        instaSlidesEl.style.transform = `translateX(${percentOffset}%)`;
    }

    function goToInstaSlide(index) {
        currentInstaSlide = Math.max(0, Math.min(totalInstaSlides - 1, index));
        instaSlidesEl.classList.remove('is-dragging');
        applyInstaTransform(-currentInstaSlide * 100);
        instaDots.forEach((d, i) => d.classList.toggle('active', i === currentInstaSlide));
    }

    function nextInstaSlide() {
        if (currentInstaSlide < totalInstaSlides - 1) goToInstaSlide(currentInstaSlide + 1);
    }

    function prevInstaSlide() {
        if (currentInstaSlide > 0) goToInstaSlide(currentInstaSlide - 1);
    }

    instaDots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToInstaSlide(i));
    });

    let dragStartX = 0;
    let dragPointerId = null;
    let dragMoved = false;
    const TAP_MAX_PX = 12;
    const SWIPE_RATIO = 0.12;

    function rubberOffset(dx) {
        if (currentInstaSlide === 0 && dx > 0) return dx * 0.35;
        if (currentInstaSlide === totalInstaSlides - 1 && dx < 0) return dx * 0.35;
        return dx;
    }

    instaCarousel.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        dragPointerId = e.pointerId;
        dragStartX = e.clientX;
        dragMoved = false;
        try {
            instaCarousel.setPointerCapture(e.pointerId);
        } catch (_) {}
        instaSlidesEl.classList.add('is-dragging');
    });

    instaCarousel.addEventListener('pointermove', (e) => {
        if (e.pointerId !== dragPointerId) return;
        const dx = e.clientX - dragStartX;
        if (Math.abs(dx) > TAP_MAX_PX) dragMoved = true;
        const w = instaCarousel.offsetWidth || 1;
        const adj = rubberOffset(dx);
        const basePercent = -currentInstaSlide * 100;
        applyInstaTransform(basePercent + (adj / w) * 100);
    });

    function endDrag(e) {
        if (e.pointerId !== dragPointerId) return;
        dragPointerId = null;
        instaSlidesEl.classList.remove('is-dragging');
        try {
            instaCarousel.releasePointerCapture(e.pointerId);
        } catch (_) {}

        const w = instaCarousel.offsetWidth || 1;
        const dx = e.clientX - dragStartX;
        const threshold = w * SWIPE_RATIO;

        if (dragMoved) {
            if (dx < -threshold && currentInstaSlide < totalInstaSlides - 1) {
                goToInstaSlide(currentInstaSlide + 1);
                return;
            }
            if (dx > threshold && currentInstaSlide > 0) {
                goToInstaSlide(currentInstaSlide - 1);
                return;
            }
        } else if (Math.abs(dx) <= TAP_MAX_PX) {
            const rect = instaCarousel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width * 0.35) prevInstaSlide();
            else if (x > rect.width * 0.65) nextInstaSlide();
            else goToInstaSlide(currentInstaSlide);
            return;
        }

        goToInstaSlide(currentInstaSlide);
    }

    instaCarousel.addEventListener('pointerup', endDrag);
    instaCarousel.addEventListener('pointercancel', endDrag);

    goToInstaSlide(0);
})();

if (totalMainSlides > 0) goToMainSlide(0);
