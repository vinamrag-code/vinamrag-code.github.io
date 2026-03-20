// Initialize GSAP with ScrollTrigger when the CDN scripts are available.
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Create matrix rain effect
function createMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
    
    function draw() {
        // Semi-transparent black to create fading effect
        ctx.fillStyle = 'rgba(13, 13, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00eeff';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 33); // ~30fps
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== SMOOTH SCROLLING WITH OFFSET CORRECTION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Account for the sticky terminal header, marquee, and navbar.
            const offset = 110;
            const top = targetElement.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL-TRIGGERED ANIMATIONS =====
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    // Section titles - fade up
    gsap.utils.toArray('.section h2').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out"
        });
    });

    // Project cards - staggered slide up with 3D effect
    gsap.utils.toArray('.project-card, .publication-card, .experience-card, .certification-card, .education-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.08,
            ease: "power3.out",
            onComplete: () => {
                // Add subtle floating animation after initial reveal
                gsap.to(card, {
                    y: -5,
                    repeat: -1,
                    yoyo: true,
                    duration: 2,
                    ease: "sine.inOut"
                });
            }
        });
    });

    // Skill categories - slide from sides with alternating direction
    gsap.utils.toArray('.skill-category').forEach((category, index) => {
        const direction = index % 2 === 0 ? -50 : 50;

        gsap.from(category, {
            scrollTrigger: {
                trigger: category,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            x: direction,
            opacity: 0,
            duration: 0.75,
            ease: "power2.out"
        });
    });

    // About section text - sequential fade
    gsap.utils.toArray('.about-section p').forEach((p, index) => {
        gsap.from(p, {
            scrollTrigger: {
                trigger: p,
                start: "top 95%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 20,
            duration: 0.6,
            delay: index * 0.15,
            ease: "power2.out"
        });
    });

    // Stats cards animation
    gsap.utils.toArray('.stat').forEach((stat, index) => {
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.65,
            delay: index * 0.05,
            ease: "back.out(1.4)"
        });
    });
}

// ===== MARQUEE INTERACTION ENHANCEMENT =====
function initMarqueeInteraction() {
    const marquee = document.querySelector('.tech-marquee');
    const marqueeContent = document.querySelector('.marquee-content');
    let isHovered = false;

    if (!marquee || !marqueeContent) {
        return;
    }

    marquee.addEventListener('mouseenter', () => {
        isHovered = true;
        marqueeContent.style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
        isHovered = false;
        marqueeContent.style.animationPlayState = 'running';
    });

    // Speed up marquee on scroll
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollVelocity = (currentScrollY - lastScrollY) * 0.1;
        lastScrollY = currentScrollY;

        // Cap velocity
        scrollVelocity = Math.min(Math.max(scrollVelocity, -15), 15);

        if (!isHovered) {
            const baseSpeed = 25; // Base animation duration in seconds
            const newSpeed = Math.max(10, baseSpeed - Math.abs(scrollVelocity));
            marqueeContent.style.animationDuration = `${newSpeed}s`;
        }
    });
}

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
function initNavHighlighting() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.navbar a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjusted for new spacing
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        
        progressBar.style.width = `${scrollPercentRounded}%`;
        
        if (scrollTop > 100) {
            progressContainer.classList.add('show');
        } else {
            progressContainer.classList.remove('show');
        }
    });
}

// ===== PROJECT CARD INTERACTIVITY =====
function initProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.03,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// ===== INITIALIZE EVERYTHING =====
window.addEventListener('load', () => {
    // Initialize matrix rain
    createMatrixRain();
    
    // Initialize animations after brief delay for proper layout
    setTimeout(() => {
        initScrollAnimations();
        initMarqueeInteraction();
        initNavHighlighting();
        initScrollProgress();
        initProjectInteractions();

        // Initial fade-in for page content
        if (typeof gsap !== 'undefined') {
            gsap.to('body', {
                opacity: 1,
                duration: 0.8,
                ease: "power2.in"
            });
        }
    }, 300);

    // Fix for iOS overflow scrolling
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.overflowY = 'scroll';
        document.body.style.webkitOverflowScrolling = 'touch';
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        
        // Update matrix rain canvas size
        const canvas = document.getElementById('matrix-rain');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, 250);
});

// Reduce motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof gsap !== 'undefined') {
    document.documentElement.style.scrollBehavior = 'auto';

    // Disable complex animations
    gsap.utils.toArray('.project-card, .skill-category, .certification-card, .education-card').forEach(el => {
        gsap.set(el, { clearProps: "all" });
    });
}