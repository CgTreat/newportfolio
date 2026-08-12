// ========================================
// NOVA STUDIO - INTERACTIVE JAVASCRIPT
// ========================================

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ========================================
// PRELOADER
// ========================================

const preloader = document.getElementById('preloader');
const loaderCounter = document.getElementById('loaderCounter');

let progress = 0;
const preloaderInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
        progress = 100;
        clearInterval(preloaderInterval);
        
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 500);
    }
    loaderCounter.textContent = Math.floor(progress) + '%';
}, 100);

// ========================================
// CUSTOM CURSOR
// ========================================

const cursor = document.getElementById('cursor');
const cursorDot = cursor.querySelector('.cursor-dot');
const cursorLabel = cursor.querySelector('.cursor-label');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const ease = 0.15;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// ========================================
// MOUSE-FOLLOWING GRADIENT
// ========================================

const mouseGradient = document.getElementById('mouseGradient');
const heroSection = document.querySelector('.hero');

if (mouseGradient) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        mouseGradient.style.background = `radial-gradient(circle 600px at ${x}px ${y}px, rgba(107, 91, 255, 0.12), transparent 80%)`;
    });
}

// Hero mouse tracking for background gradient
if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        heroSection.style.setProperty('--mouse-x', `${x}%`);
        heroSection.style.setProperty('--mouse-y', `${y}%`);
    });
}

// Enhanced cursor hover effects with 3D
const hoverElements = document.querySelectorAll('a, button, .service-card, .carousel-slide, .gallery-image, .insight-card, .project-card');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        
        if (el.classList.contains('service-card') || el.classList.contains('carousel-slide')) {
            cursorLabel.textContent = 'View';
        } else if (el.classList.contains('gallery-image')) {
            cursorLabel.textContent = 'Explore';
        }
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorLabel.textContent = '';
    });
    
    // 3D tilt effect on hover
    if (el.classList.contains('service-card') || el.classList.contains('gallery-image') || el.classList.contains('insight-card') || el.classList.contains('project-card')) {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((x - centerX) / centerX) * -5;
            
            if (el.classList.contains('project-card')) {
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            } else {
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            }
        });
        
        el.addEventListener('mouseleave', () => {
            if (el.classList.contains('project-card')) {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            } else {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            }
        });
    }
});

// ========================================
// NAVIGATION
// ========================================

const mainNav = document.getElementById('mainNav');
const navPills = document.querySelectorAll('.nav-pill');
const navPillBg = document.querySelector('.nav-pill-bg');

// Nav background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
});

// Nav pill animation
function updateNavPillBg(pill) {
    const pillRect = pill.getBoundingClientRect();
    const containerRect = pill.parentElement.getBoundingClientRect();
    
    navPillBg.style.width = pillRect.width + 'px';
    navPillBg.style.transform = `translateX(${pillRect.left - containerRect.left}px)`;
}

navPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
        e.preventDefault();
        navPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        updateNavPillBg(pill);
        
        // Smooth scroll to section
        const target = document.querySelector(pill.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    pill.addEventListener('mouseenter', () => {
        updateNavPillBg(pill);
    });
});

// Initialize nav pill bg
const activePill = document.querySelector('.nav-pill.active');
if (activePill) {
    updateNavPillBg(activePill);
}

// Drag to scroll nav pills
const navPillsContainer = document.getElementById('navPills');
let isDragging = false;
let startX;
let scrollLeft;

navPillsContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - navPillsContainer.offsetLeft;
    scrollLeft = navPillsContainer.scrollLeft;
    navPillsContainer.style.cursor = 'grabbing';
});

navPillsContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    navPillsContainer.style.cursor = 'grab';
});

navPillsContainer.addEventListener('mouseup', () => {
    isDragging = false;
    navPillsContainer.style.cursor = 'grab';
});

navPillsContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - navPillsContainer.offsetLeft;
    const walk = (x - startX) * 2;
    navPillsContainer.scrollLeft = scrollLeft - walk;
});

// ========================================
// THREE.JS HERO 3D - Small Version
// ========================================

const hero3DContainer = document.getElementById('hero3D');

if (hero3DContainer) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        1,
        0.1,
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(200, 200);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    hero3DContainer.appendChild(renderer.domElement);
    
    // Create torus knot
    const geometry = new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16);
    const material = new THREE.MeshPhongMaterial({
        color: 0x6B5BFF,
        flatShading: true,
        shininess: 80,
        emissive: 0x6B5BFF,
        emissiveIntensity: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(2, 2, 2);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0xFF6B9D, 0.6);
    light2.position.set(-2, -2, -2);
    scene.add(light2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    camera.position.z = 3;
    
    // Animation loop
    function animateHero3D() {
        requestAnimationFrame(animateHero3D);
        
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.008;
        
        renderer.render(scene, camera);
    }
    
    animateHero3D();
}

// ========================================
// SERVICES 3D RIBBON CAROUSEL
// ========================================

const servicesRibbon = document.getElementById('servicesRibbon');
const services3DContainer = document.getElementById('services3DContainer');

if (servicesRibbon && services3DContainer) {
    const cards = servicesRibbon.querySelectorAll('.service-card');
    const cardWidth = 530; // 500 + 30 gap
    const totalWidth = cards.length * cardWidth;
    
    // Position cards initially off-screen with 3D transforms
    cards.forEach((card, i) => {
        gsap.set(card, {
            x: i * cardWidth,
            rotateY: -45,
            rotateX: 10,
            z: -200,
            opacity: 0.3
        });
    });
    
    // Create 3D ribbon scroll animation - FASTER
    gsap.to(servicesRibbon, {
        x: -totalWidth + window.innerWidth,
        scrollTrigger: {
            trigger: '.services-section',
            start: 'top top',
            end: '+=1500',
            scrub: 0.5,
            pin: true,
            onUpdate: (self) => {
                const progress = self.progress;
                
                cards.forEach((card, i) => {
                    // Calculate card's relative position in viewport
                    const cardProgress = (progress * totalWidth - i * cardWidth) / window.innerWidth;
                    
                    // 3D transforms - subtle angle for depth
                    let rotateY = 0;
                    let rotateX = 0;
                    let z = 0;
                    let opacity = 1;
                    
                    if (cardProgress < 0) {
                        // Coming from left - subtle angle
                        rotateY = -15;
                        rotateX = 5;
                        z = -100;
                        opacity = 0.6;
                    } else if (cardProgress > 1) {
                        // Going to right - subtle angle
                        const exitProgress = Math.min(cardProgress - 1, 0.5);
                        rotateY = exitProgress * 15;
                        rotateX = -exitProgress * 5;
                        z = -exitProgress * 100;
                        opacity = 1 - (exitProgress * 0.8);
                    } else {
                        // In viewport - subtle perspective
                        rotateY = (cardProgress - 0.5) * 8;
                        rotateX = 2;
                        z = 0;
                        opacity = 1;
                    }
                    
                    // Direct CSS update for performance
                    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${z}px)`;
                    card.style.opacity = opacity;
                });
            }
        }
    });
}



// ========================================
// PROJECT CARDS 3D WHEEL ANIMATION
// ========================================

const projectCards = document.querySelectorAll('.project-card');

if (projectCards.length > 0) {
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    projectCards.forEach(card => cardObserver.observe(card));
}

// ========================================
// SCROLL REVEAL FOR ALL SECTIONS
// ========================================

const revealSections = document.querySelectorAll(
    '.approach-section, .services-section, .projects-section, .interactive-wall-section, .insights-section, .studio-section'
);

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.2
});

revealSections.forEach(section => {
    sectionObserver.observe(section);
});

// ========================================
// APPROACH SECTION - 4 COLUMN REVEAL
// ========================================

const processSteps = document.querySelectorAll('.process-step');

if (processSteps.length > 0) {
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3
    });
    
    processSteps.forEach(step => {
        stepObserver.observe(step);
    });
}

// ========================================
// HERO CURSOR INTERACTION
// ========================================

const hero = document.querySelector('.hero');
const heroHeadline = document.getElementById('heroHeadline');

if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        hero.style.setProperty('--mouse-x', `${x}%`);
        hero.style.setProperty('--mouse-y', `${y}%`);
        
        if (heroHeadline) {
            const moveX = (x - 50) * 0.02;
            const moveY = (y - 50) * 0.02;
            heroHeadline.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
        }
    });
    
    hero.addEventListener('mouseleave', () => {
        if (heroHeadline) {
            heroHeadline.style.transform = '';
        }
    });
}

// ========================================
// INTERACTIVE WALL GALLERY
// ========================================

const wallContainer = document.getElementById('wallContainer');
const wallCards = document.querySelectorAll('.wall-card');

if (wallContainer && wallCards.length > 0) {
    // Position cards based on data attributes
    wallCards.forEach(card => {
        const x = card.dataset.x;
        const y = card.dataset.y;
        card.style.left = `${x}%`;
        card.style.top = `${y}%`;
    });
    
    // Scroll-triggered reveal
    const wallObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                wallCards.forEach(card => {
                    card.classList.add('visible');
                });
                wallObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });
    
    wallObserver.observe(wallContainer);
    
    // Global parallax effect - ALL cards shift with cursor
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        wallCards.forEach((card, index) => {
            if (!card.classList.contains('visible')) return;
            
            const x = parseFloat(card.dataset.x);
            const y = parseFloat(card.dataset.y);
            
            // Calculate distance from cursor (0-1 range)
            const deltaX = (mouseX * 100 - x) / 100;
            const deltaY = (mouseY * 100 - y) / 100;
            
            // Parallax shift - cards further from cursor move more
            const shiftX = deltaX * 15;
            const shiftY = deltaY * 15;
            
            card.classList.add('parallax');
            card.style.transform = `translate(calc(-50% + ${shiftX}px), calc(-50% + ${shiftY}px)) scale(1) rotateY(0deg)`;
        });
    });
    
    // Magnetic hover effect on individual cards
    wallCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.remove('parallax');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.add('parallax');
        });
    });
}

// ========================================
// SERVICE CARDS STAGGER ANIMATION
// ========================================

const serviceCards = document.querySelectorAll('.service-card');

if (serviceCards.length > 0) {
    gsap.from(serviceCards, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.services-section',
            start: 'top 70%',
            once: true
        }
    });
}

// ========================================
// INSIGHT CARDS ANIMATION
// ========================================

const insightCards = document.querySelectorAll('.insight-card');

if (insightCards.length > 0) {
    gsap.from(insightCards, {
        opacity: 0,
        y: 80,
        scale: 0.9,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.insights-section',
            start: 'top 70%',
            once: true
        }
    });
}

// ========================================
// GSAP ANIMATIONS
// ========================================

function initAnimations() {
    // Reveal sections on scroll
    gsap.utils.toArray('[data-scroll-section]').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
            }
        });
    });
    
    // Timeline line draw
    const timelinePath = document.getElementById('timelinePath');
    if (timelinePath) {
        gsap.to(timelinePath, {
            strokeDashoffset: 0,
            scrollTrigger: {
                trigger: '.approach-section',
                start: 'top center',
                end: 'bottom center',
                scrub: 1
            }
        });
    }
    
    // Process steps reveal
    gsap.utils.toArray('.process-step').forEach((step, i) => {
        ScrollTrigger.create({
            trigger: step,
            start: 'top 70%',
            onEnter: () => step.classList.add('visible')
        });
    });
    
    // Stats counter
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.count);
        
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(stat, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power1.out'
                });
            }
        });
    });
    
    // Parallax gallery items
    gsap.utils.toArray('.gallery-item').forEach(item => {
        const speed = item.dataset.speed || 0.5;
        
        gsap.to(item, {
            y: () => -100 * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: '.studio-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

// ========================================
// MAGNETIC BUTTONS
// ========================================

const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 40;
        
        if (distance < maxDistance) {
            const strength = (maxDistance - distance) / maxDistance;
            gsap.to(btn, {
                x: x * strength * 0.3,
                y: y * strength * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// ========================================
// FOOTER CTA BUTTON CURSOR TRACKING
// ========================================

const footerCtaBtn = document.querySelector('.footer-cta-btn');

if (footerCtaBtn) {
    footerCtaBtn.addEventListener('mousemove', (e) => {
        const rect = footerCtaBtn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        footerCtaBtn.style.setProperty('--btn-x', `${x}%`);
        footerCtaBtn.style.setProperty('--btn-y', `${y}%`);
    });
    
    footerCtaBtn.addEventListener('mouseleave', () => {
        footerCtaBtn.style.setProperty('--btn-x', '50%');
        footerCtaBtn.style.setProperty('--btn-y', '50%');
    });
}

// ========================================
// BACK TO TOP
// ========================================

const backToTop = document.getElementById('backToTop');

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 800) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================================
// FOOTER ANIMATIONS
// ========================================

const footerLinks = document.querySelectorAll('.footer-link');

footerLinks.forEach((link, index) => {
    gsap.from(link, {
        opacity: 0,
        x: -20,
        duration: 0.6,
        delay: index * 0.05,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.main-footer',
            start: 'top 80%',
            once: true
        }
    });
});

// Footer CTA animation
const footerCta = document.querySelector('.footer-cta');
if (footerCta) {
    gsap.from(footerCta, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: footerCta,
            start: 'top 85%',
            once: true
        }
    });
}

// ========================================
// CONTACT 3D
// ========================================

const contact3DContainer = document.getElementById('contact3D');

if (contact3DContainer) {
    const sceneContact = new THREE.Scene();
    const cameraContact = new THREE.PerspectiveCamera(
        75,
        contact3DContainer.offsetWidth / contact3DContainer.offsetHeight,
        0.1,
        1000
    );
    
    const rendererContact = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererContact.setSize(contact3DContainer.offsetWidth, contact3DContainer.offsetHeight);
    rendererContact.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    contact3DContainer.appendChild(rendererContact.domElement);
    
    const geometryContact = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const materialContact = new THREE.MeshPhongMaterial({
        color: 0xFFD074,
        flatShading: true
    });
    const torusKnot = new THREE.Mesh(geometryContact, materialContact);
    sceneContact.add(torusKnot);
    
    const lightContact = new THREE.DirectionalLight(0xffffff, 1);
    lightContact.position.set(2, 2, 2);
    sceneContact.add(lightContact);
    
    const ambientContact = new THREE.AmbientLight(0xffffff, 0.5);
    sceneContact.add(ambientContact);
    
    cameraContact.position.z = 3;
    
    function animateContact() {
        requestAnimationFrame(animateContact);
        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.01;
        rendererContact.render(sceneContact, cameraContact);
    }
    
    animateContact();
}

// ========================================
// RESPONSIVE
// ========================================

window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

console.log('%c NOVA STUDIO ', 'background: #B087FF; color: #F5F1EA; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%c Immersive Digital Experiences ', 'color: #B087FF; font-size: 14px;');