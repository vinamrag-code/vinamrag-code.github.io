// Ensure GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Force scroll to top on reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// ===== SPLIT LOADER =====
const loader = document.getElementById("split-loader");
const loaderLogs = document.getElementById("loader-logs");
const activeTyping = document.querySelector(".active-typing");
const loaderGrid = document.getElementById("loader-grid");

const termLines = [
    "vinamra@system:~$ ./init_sequence.sh",
    "[OK] Bootstrapping virtual environment...",
    "[OK] Neural networks aligned.",
    "vinamra@system:~$ fetch dependencies",
    "[INFO] Downloading UI modules...",
    "[INFO] Compiling local assets...",
    "[OK] Rendering engine active.",
    "vinamra@system:~$ launch portfolio",
    "System ready. Bypassing security protocols..."
];

let lineIdx = 0;
let charIdx = 0;

function processTerminal() {
    if (!loaderLogs || !activeTyping) return;
    if (lineIdx < termLines.length) {
        const currentLine = termLines[lineIdx];
        
        if (currentLine.startsWith("vinamra@system")) {
            if (charIdx < currentLine.length) {
                activeTyping.textContent += currentLine.charAt(charIdx);
                charIdx++;
                setTimeout(processTerminal, 40); 
            } else {
                setTimeout(() => {
                    const p = document.createElement("p");
                    p.textContent = currentLine;
                    p.style.color = "#b463ff";
                    loaderLogs.appendChild(p);
                    activeTyping.textContent = "";
                    charIdx = 0;
                    lineIdx++;
                    setTimeout(processTerminal, 200);
                }, 300);
            }
        } else {
            const p = document.createElement("p");
            p.textContent = currentLine;
            if (currentLine.startsWith("[OK]")) p.style.color = "#00eeff";
            else p.style.color = "#a0a0a0";
            
            loaderLogs.appendChild(p);
            lineIdx++;
            let delay = Math.random() * 200 + 100;
            setTimeout(processTerminal, delay);
        }
    } else {
        setTimeout(removeLoader, 1000);
    }
}

function removeLoader() {
    gsap.to(loader, {
        yPercent: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => {
            if(loader) loader.style.display = "none";
            initHeroAnimation();
        }
    });
}

window.addEventListener("load", () => {
    if(loader) {
        setTimeout(processTerminal, 500);
    }
});

// ===== SMOOTH SCROLLING (Lenis) =====
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)


// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.custom-cursor-follower');
const links = document.querySelectorAll('a, .hover-reveal, .magnetic-btn, .project-item');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
    });
});

gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(follower, {
        x: followerX,
        y: followerY
    });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    link.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// ===== 3D BACKGROUND (Three.js) =====
function initThreeJS() {
    const container = document.getElementById('webgl-container');
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (container) {
        container.appendChild(renderer.domElement);
    }

    // Particle System
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Color palette: Cyan / Violet
    const color1 = new THREE.Color('#00eeff');
    const color2 = new THREE.Color('#b463ff');

    for(let i=0; i < particleCount * 3; i+=3) {
        positions[i] = (Math.random() - 0.5) * 100; // x
        positions[i+1] = (Math.random() - 0.5) * 100; // y
        positions[i+2] = (Math.random() - 0.5) * 50; // z

        const mixRatio = Math.random();
        const mixedColor = color1.clone().lerp(color2, mixRatio);
        
        colors[i] = mixedColor.r;
        colors[i+1] = mixedColor.g;
        colors[i+2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse interaction variables
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        targetX = (event.clientX - windowHalfX) * 0.05;
        targetY = (event.clientY - windowHalfY) * 0.05;
    });

    // Scroll interaction
    let scrollY = 0;
    lenis.on('scroll', (e) => {
        scrollY = e.scroll;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate particles slowly
        particles.rotation.y = elapsedTime * 0.05;
        particles.rotation.x = elapsedTime * 0.02;

        // Mouse Parallax effect
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY - (-scrollY * 0.01) - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
initThreeJS();

// ===== GSAP ANIMATIONS =====

// Hero Intro Animation
function initHeroAnimation() {
    const tl = gsap.timeline();
    tl.to(".word", {
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2
    })
    .to(".hero-sub", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out"
    }, "-=0.6");
}

// Fallback if no loader
if(!document.getElementById("render-loader")) {
    initHeroAnimation();
}

// Section Headings Reveal
document.querySelectorAll('.section-heading').forEach(heading => {
    ScrollTrigger.create({
        trigger: heading,
        start: "top 80%",
        onEnter: () => heading.classList.add('in-view'),
    });
});

// About Text Reveal
gsap.utils.toArray('.reveal-text').forEach(text => {
    gsap.to(text, {
        backgroundPositionX: "0%",
        ease: "none",
        scrollTrigger: {
            trigger: text,
            start: "top 85%",
            end: "bottom 60%",
            scrub: 1
        }
    });
});

// Stats Reveal
gsap.utils.toArray('.stat-item').forEach(item => {
    gsap.from(item, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: item,
            start: "top 90%"
        }
    });
});

// Marquee Animation
const marqueeContent = document.querySelectorAll('.marquee-content');
if (marqueeContent.length > 0) {
    gsap.to(marqueeContent, {
        xPercent: -100,
        ease: "none",
        duration: 20,
        repeat: -1
    });
}

// Navigation scroll
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        lenis.scrollTo(targetId, {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    });
});

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('mobile-active');
        const icon = hamburger.querySelector('i');
        if (navbar.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('mobile-active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}
