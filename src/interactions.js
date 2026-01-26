import confetti from 'canvas-confetti';
import Lenis from 'lenis';

let lenis;

export function initInteractions() {
    initSmoothScroll();
    initMagneticButtons();
    initParallax();
    initConfettiTriggers();
    initScrollProgress();
    // Replaced simple rotations with 3D Tilt
    init3DTilt();
    initScrollReveal();
    initSpotlight();
    initCardStacking();
}

function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

function initSpotlight() {
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-text, .scroll-reveal');
    elements.forEach(el => observer.observe(el));
}

function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic');

    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', function (e) {
            const position = magnet.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;

            magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
            magnet.style.transition = 'transform 0s';
        });

        magnet.addEventListener('mouseleave', function (e) {
            magnet.style.transform = 'translate(0px, 0px)';
            magnet.style.transition = 'transform 0.3s ease-out';
        });
    });
}

function initParallax() {
    window.addEventListener('scroll', () => {
        const rolled = window.scrollY;

        // Parallax for floating shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.2;
            shape.style.transform = `translateY(${rolled * speed}px)`;
        });

        // Parallax for Hero text
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.transform = `translateY(${rolled * 0.4}px)`;
        }
    });
}

function initConfettiTriggers() {
    const contactLinks = document.querySelectorAll('a[href^="mailto"], .email-link, .btn');

    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't prevent default, just fire confetti
            var duration = 3 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            var randomInRange = (min, max) => Math.random() * (max - min) + min;

            var interval = setInterval(function () {
                var timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                var particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        });
    });
}

function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    });
}

function init3DTilt() {
    const cards = document.querySelectorAll('.project-card, .cert-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position relative to center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Limit max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

function initCardStacking() {
    const cards = document.querySelectorAll('.project-card');
    const stickyTop = 120; // Matches the css top: 120px
    const cardHeight = 300; // Approximate card height or dynamic

    if (!cards.length) return;

    window.addEventListener('scroll', () => {
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            // Check if card is at the sticky position (or close to it)
            // We can determine "stuck" state if rect.top is roughly stickyTop

            // However, a better way for the "stacking" effect where they scale down
            // is to measure the distance to the NEXT card.

            const nextCard = cards[index + 1];
            if (nextCard) {
                const nextRect = nextCard.getBoundingClientRect();
                const distance = nextRect.top - rect.top;

                // Max distance is when next card is far below. 
                // Min distance is 0 (visually on top? no, they stack). 
                // Wait, if sticky, rect.top stays at 120. nextRect.top decreases.
                // So distance decreases.

                // When distance is small, current card should be smaller (pushed back).
                // But normally we want the stuck card to scale down AS the next one comes up.

                // Let's rely on position relative to viewport top for scaling.
                // Actually, the "Stacking" effect usually implies the ones BEHIND are smaller.

                // Simple logic: Map the card's position in the visual stack.
                // But since they are all sticky, we need to base it on scroll progress relative to the card's section.

                // Alternative approach: 
                // As long as the card is "stuck" (rect.top <= stickyTop + buffer), apply scale based on how far the *next* card is.

                if (rect.top <= stickyTop + 1) {
                    const progress = 1 - Math.max(0, distance / window.innerHeight);
                    // This is rough.

                    // Let's try a standard scaling formula for stacked cards:
                    // Scale = 1 - (index * 0.05) + (distance factor)

                    // Let's match the "Vercel" or "CodeSandbox" style stacking.
                    // The "active" sticking card stays full size until the next one overlaps it?
                    // No, usually the previous ones scale down.

                    // Let's use the distance between nextCard and the sticky top.
                    const distToTop = nextRect.top - stickyTop;

                    // If next card is close to top, this card scales down.
                    // Max scale down = 0.9.
                    // Start scaling when next card is approaching.

                    if (distToTop > 0 && distToTop < window.innerHeight) {
                        const mapValue = 1 - (distToTop / window.innerHeight); // 0 to 1 as it approaches
                        const scale = 1 - (mapValue * 0.05); // Scales down to 0.95
                        const opacity = 1 - (mapValue * 0.2); // Fades to 0.8

                        card.style.transform = `scale(${scale})`;
                        card.style.opacity = opacity;
                        card.style.filter = `blur(${mapValue * 2}px)`;
                    } else if (distToTop <= 0) {
                        // Covered
                        card.style.transform = `scale(0.95)`;
                        card.style.opacity = 0.8;
                        card.style.filter = `blur(2px)`;
                    } else {
                        // Next card far away
                        card.style.transform = `scale(1)`;
                        card.style.opacity = 1;
                        card.style.filter = `blur(0px)`;
                    }
                } else {
                    card.style.transform = `scale(1)`;
                    card.style.opacity = 1;
                    card.style.filter = `blur(0px)`;
                }
            }
        });
    });
}
