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
// SERVICES HORIZONTAL DRAG
// ========================================

const servicesTrack = document.getElementById('servicesTrack');

if (servicesTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    
    servicesTrack.parentElement.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - servicesTrack.offsetLeft;
        scrollLeft = servicesTrack.parentElement.scrollLeft;
        servicesTrack.parentElement.style.cursor = 'grabbing';
        cursor.classList.add('drag');
        cursorLabel.textContent = 'Drag';
    });
    
    servicesTrack.parentElement.addEventListener('mouseleave', () => {
        isDown = false;
        servicesTrack.parentElement.style.cursor = 'grab';
        cursor.classList.remove('drag');
    });
    
    servicesTrack.parentElement.addEventListener('mouseup', () => {
        isDown = false;
        servicesTrack.parentElement.style.cursor = 'grab';
        cursor.classList.remove('drag');
    });
    
    servicesTrack.parentElement.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - servicesTrack.offsetLeft;
        const walk = (x - startX) * 2;
        servicesTrack.parentElement.scrollLeft = scrollLeft - walk;
    });
    
    // GSAP ScrollTrigger for horizontal scroll
    gsap.to(servicesTrack, {
        x: () => -(servicesTrack.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: '.services-section',
            pin: true,
            scrub: 1,
            end: () => '+=' + servicesTrack.scrollWidth,
            invalidateOnRefresh: true
        }
    });
}

// ========================================
// CAROUSEL
// ========================================

const carouselTrack = document.getElementById('carouselTrack');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselPagination = document.getElementById('carouselPagination');
const carouselProgressBar = document.getElementById('carouselProgressBar');

let currentSlide = 0;
const totalSlides = document.querySelectorAll('.carousel-slide').length;

function updateCarousel() {
    const slideWidth = carouselTrack.querySelector('.carousel-slide').offsetWidth + 30;
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    carouselPagination.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    carouselProgressBar.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
}

carouselNext.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
});

carouselPrev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
});

// Drag to scroll carousel
let carouselDragging = false;
let carouselStartX;
let carouselScrollLeft;

carouselTrack.addEventListener('mousedown', (e) => {
    carouselDragging = true;
    carouselStartX = e.pageX;
    carouselScrollLeft = carouselTrack.scrollLeft;
});

carouselTrack.addEventListener('mousemove', (e) => {
    if (!carouselDragging) return;
    const x = e.pageX;
    const walk = (carouselStartX - x) * 2;
    
    if (Math.abs(walk) > 50) {
        if (walk > 0 && currentSlide < totalSlides - 1) {
            currentSlide++;
        } else if (walk < 0 && currentSlide > 0) {
            currentSlide--;
        }
        updateCarousel();
        carouselDragging = false;
    }
});

carouselTrack.addEventListener('mouseup', () => {
    carouselDragging = false;
});

// ========================================
// 360° INTERACTIVE
// ========================================

const container360 = document.getElementById('container360');

if (container360) {
    const scene360 = new THREE.Scene();
    const camera360 = new THREE.PerspectiveCamera(
        75,
        container360.offsetWidth / container360.offsetHeight,
        0.1,
        1000
    );
    
    const renderer360 = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer360.setSize(container360.offsetWidth, container360.offsetHeight);
    renderer360.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container360.appendChild(renderer360.domElement);
    
    // Create sphere for 360° view
    const geometry360 = new THREE.SphereGeometry(5, 32, 32);
    const material360 = new THREE.MeshBasicMaterial({
        color: 0xf5576c,
        wireframe: true
    });
    const sphere360 = new THREE.Mesh(geometry360, material360);
    scene360.add(sphere360);
    
    camera360.position.z = 0.1;
    
    // Drag to rotate
    let is360Dragging = false;
    let prev360X = 0;
    let rotation360Y = 0;
    
    container360.addEventListener('mousedown', (e) => {
        is360Dragging = true;
        prev360X = e.clientX;
    });
    
    container360.addEventListener('mousemove', (e) => {
        if (!is360Dragging) return;
        const deltaX = e.clientX - prev360X;
        rotation360Y += deltaX * 0.01;
        prev360X = e.clientX;
    });
    
    container360.addEventListener('mouseup', () => {
        is360Dragging = false;
    });
    
    function animate360() {
        requestAnimationFrame(animate360);
        sphere360.rotation.y = rotation360Y;
        renderer360.render(scene360, camera360);
    }
    
    animate360();
}

// ========================================
// SCROLL GALLERY ANIMATIONS
// ========================================

const scrollGalleryItems = document.querySelectorAll('.scroll-gallery-item');

if (scrollGalleryItems.length > 0) {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    scrollGalleryItems.forEach(item => observer.observe(item));
    
    // Parallax scroll effect for gallery items
    scrollGalleryItems.forEach(item => {
        const speed = parseFloat(item.dataset.scrollSpeed) || 1;
        
        gsap.to(item, {
            y: () => -50 * (speed - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: '.scroll-gallery-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
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