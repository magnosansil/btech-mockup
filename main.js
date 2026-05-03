let currentMainSlide = 0;
const totalMainSlides = 9;
const slider = document.getElementById('mainSlider');
const dots = document.querySelectorAll('.dot-main');
const slides = document.querySelectorAll('.main-slide');

function goToMainSlide(index) {
    const i = Math.max(0, Math.min(totalMainSlides - 1, index));
    currentMainSlide = i;
    slider.style.transform = `translateX(${-i * 100}%)`;

    dots.forEach(d => d.classList.remove('active'));
    if (dots[i]) dots[i].classList.add('active');

    slides.forEach(s => s.classList.remove('active'));
    if (slides[i]) {
        slides[i].classList.add('active');
        slides[i].scrollTop = 0;
    }
}

function isVerticallyScrollable(el) {
    if (!el || !(el instanceof Element)) return false;
    return el.scrollHeight > el.clientHeight + 2;
}

/** Evita trocar slide enquanto o usuário rola legenda, área do slide etc. */
function wheelShouldChangeSlide(e) {
    let t = e.target;
    while (t && t !== document.documentElement) {
        if (t.classList && t.classList.contains('caption-scroll') && isVerticallyScrollable(t)) {
            const top = t.scrollTop <= 0;
            const bot = t.scrollTop + t.clientHeight >= t.scrollHeight - 2;
            if ((e.deltaY < 0 && !top) || (e.deltaY > 0 && !bot)) return false;
        }
        if (t.classList && t.classList.contains('main-slide') && isVerticallyScrollable(t)) {
            const top = t.scrollTop <= 0;
            const bot = t.scrollTop + t.clientHeight >= t.scrollHeight - 2;
            if ((e.deltaY < 0 && !top) || (e.deltaY > 0 && !bot)) return false;
        }
        t = t.parentElement;
    }
    return true;
}

// Navegação por Scroll e Teclas
window.addEventListener(
    'wheel',
    (e) => {
        if (!wheelShouldChangeSlide(e)) return;
        if (e.deltaY > 0 && currentMainSlide < totalMainSlides - 1) goToMainSlide(currentMainSlide + 1);
        if (e.deltaY < 0 && currentMainSlide > 0) goToMainSlide(currentMainSlide - 1);
    },
    { passive: true }
);

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentMainSlide < totalMainSlides - 1) goToMainSlide(currentMainSlide + 1);
    if (e.key === 'ArrowLeft' && currentMainSlide > 0) goToMainSlide(currentMainSlide - 1);
});

// Deslize horizontal no deck (não interfere com o carrossel do mock Instagram)
(function initMainDeckSwipe() {
    if (!slider) return;
    let startX = 0;
    let startY = 0;
    const minDx = 56;
    const maxAngle = 1.15;

    slider.addEventListener(
        'touchstart',
        (e) => {
            if (e.target.closest && e.target.closest('.insta-carousel')) return;
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
            if (e.target.closest && e.target.closest('.insta-carousel')) return;
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

// Carrossel Instagram: dots, arrastar, avanço/retrocesso sem loop no fim
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
