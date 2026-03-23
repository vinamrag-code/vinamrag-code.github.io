// script.js
// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Terminal Loading Effect
function initTerminalLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingContent = document.querySelector('.loading-content');

    // Terminal messages
    const messages = [
        "Initializing portfolio system...",
        "Loading assets: [██████████] 100%",
        "Connecting to neural networks...",
        "Establishing secure connection...",
        "Verifying credentials...",
        "AI/ML modules loaded successfully",
        "Explainable AI framework initialized",
        "NLP engine ready for deployment",
        "Phishing detection models active",
        "System operational - Welcome Vinamra!",
        "",
        "Press any key to continue..."
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
        if (currentIndex < messages.length) {
            loadingContent.textContent += messages[currentIndex] + "\n";
            loadingContent.scrollTop = loadingContent.scrollHeight; // Auto-scroll
            currentIndex++;
        } else {
            clearInterval(interval);
            // Add cursor after all messages are displayed
            loadingContent.innerHTML += "<span class='cursor'></span>";

            // Simulate user pressing a key after a delay
            setTimeout(() => {
                hideLoadingScreen();
            }, 2000);
        }
    }, 150);

    // Allow user to skip by pressing any key
    document.addEventListener('keydown', function handler() {
        if (currentIndex < messages.length) {
            clearInterval(interval);
            // Show all messages instantly
            loadingContent.textContent = messages.join('\n');
            loadingContent.innerHTML += "<span class='cursor'></span>";
        }
        document.removeEventListener('keydown', handler);
    });
}

// Hide loading screen and show content
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            loadingScreen.style.display = 'none';
            // Now show the main content
            gsap.to('body', {
                opacity: 1,
                duration: 0.8,
                ease: "power2.in"
            });
        }
    });
}

// Matrix Rain Effect
function initMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01AB2CD3EF4GH5IJ6KL7MN8OP9QR.STUVW?XYZ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(13, 13, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00eeff';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(draw, 35);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== SMOOTH SCROLLING WITH OFFSET CORRECTION =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calculate offset (account for terminal header + marquee + navbar)
                const offset = 110; // 40px (terminal) + 30px (marquee) + 40px (navbar)

                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetElement,
                        offsetY: offset
                    },
                    ease: "power2.inOut"
                });
            }
        });
    });
}

// ===== SCROLL-TRIGGERED ANIMATIONS =====
function initScrollAnimations() {
    // Section titles - fade up
    gsap.utils.toArray('.section-title').forEach(title => {
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
}

// ===== MARQUEE INTERACTION ENHANCEMENT =====
function initMarqueeInteraction() {
    const marquee = document.querySelector('.tech-marquee');
    let isHovered = false;

    marquee.addEventListener('mouseenter', () => {
        isHovered = true;
        document.querySelector('.marquee-content').style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
        isHovered = false;
        document.querySelector('.marquee-content').style.animationPlayState = 'running';
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
            document.querySelector('.marquee-content').style.animationDuration = `${newSpeed}s`;
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

            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
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

// ===== INITIALIZE EVERYTHING =====
window.addEventListener('load', () => {
    // Show loading screen first
    document.body.classList.add('loading-active');

    // Initialize animations after brief delay for proper layout
    setTimeout(() => {
        initTerminalLoading();
        initMatrixRain();
        initScrollAnimations();
        initSmoothScrolling();
        initMarqueeInteraction();
        initNavHighlighting();
    }, 100); // Small delay to ensure DOM is fully loaded

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
        ScrollTrigger.refresh();
    }, 250);
});

// Reduce motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';

    // Disable complex animations
    gsap.utils.toArray('.project-card, .skill-category').forEach(el => {
        gsap.set(el, { clearProps: "all" });
    });
}