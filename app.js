// ===== GSAP SETUP =====
gsap.registerPlugin(ScrollTrigger);

// ===== PARTICULAS DE FONDO (Olas fluidas b/n) =====
(function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return; // Prevent crash if canvas is removed
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let time = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        width = canvas.width;
        height = canvas.height;
        initParticles();
    }
    
    function initParticles() {
        particles = [];
        const numWaves = 3;
        const particlesPerWave = Math.floor(width / 15);
        
        for (let w = 0; w < numWaves; w++) {
            for (let i = 0; i < particlesPerWave; i++) {
                particles.push({
                    x: (i / particlesPerWave) * width,
                    waveIndex: w,
                    baseY: height * 0.6 + (w * 100),
                    size: Math.random() * 2 + 1,
                    speed: 0.002 + (w * 0.001),
                    offset: Math.random() * Math.PI * 2
                });
            }
        }
    }

    resize();
    window.addEventListener('resize', resize);

    function animate() {
        ctx.clearRect(0, 0, width, height); // Pure clear for crisp waves
        
        time += 0.5; // Slower, more elegant
        
        particles.forEach(p => {
            // High-end digital wave movement
            const noise = Math.sin(p.x * 0.003 + time * p.speed) * 40;
            const waveY = p.baseY + noise + Math.cos(time * 0.02 + p.offset) * 15;
            
            // Gradient for waves
            const grad = ctx.createRadialGradient(p.x, waveY, 0, p.x, waveY, p.size * 2);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, waveY, p.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Connected digital threads
            if (Math.random() > 0.98) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, waveY);
                ctx.lineTo(p.x + 50, waveY + (Math.random() - 0.5) * 80);
                ctx.stroke();
            }
        });
        
        requestAnimationFrame(animate);
    }
    animate();
})();

// ===== GSAP ENTRY ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    gsap.from('.hero-content > *', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out'
    });

    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
    });
});

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // If it's the projects grid, we can trigger GSAP stagger here if scrollTrigger isn't used
            if (entry.target.id === 'projects-grid') {
                 gsap.to('.project-card', {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.05,
                    ease: 'power3.out'
                });
            }
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => fadeObserver.observe(el));


// ===== CONTADOR ANIMADO =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Easing cubico
            const ease = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * ease);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(update);
    });
}

// Disparar contadores cuando el hero sea visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);


// ===== FILTRO DE PROYECTOS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Actualizar estado activo
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const level = card.getAttribute('data-level');
            if (filter === 'all' || level === filter) {
                card.style.display = '';
                gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
            } else {
                card.style.display = 'none';
            }
        });
    });
});


// ===== SKILL BARS ANIMATION =====
const skillBars = document.querySelectorAll('.skill-bar .fill');
skillBars.forEach(bar => {
    bar.dataset.width = bar.style.width;
    bar.style.width = '0';
});

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width;
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));


// ===== SMOOTH SCROLL PARA LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 0;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ===== FORCE GSAP ON LOAD =====
window.addEventListener('load', () => {
    gsap.to('.hero-content > *', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });

    // Premium Scroll Reveal for Projects
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            scale: 0.9,
            rotationX: -10,
            duration: 1,
            delay: i % 3 * 0.1,
            ease: "power4.out"
        });
    });
});

// ===== PROJECT CLICK GLOW =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        // Remove active from others
        document.querySelectorAll('.project-card').forEach(c => c.classList.remove('active'));
        // Add to this one
        card.classList.add('active');
        
        // Impact effect
        gsap.fromTo(card, { scale: 0.98 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
});

