// ========================================
// SMOOTH SCROLL IMPLEMENTATION
// Using custom smooth scroll for buttery animations
// ========================================

class SmoothScroll {
    constructor() {
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.ease = 0.1;
        this.isScrolling = false;
        this.init();
    }

    init() {
        this.update();
        window.addEventListener('scroll', () => {
            this.targetScrollY = window.scrollY;
        });
    }

    update() {
        this.scrollY += (this.targetScrollY - this.scrollY) * this.ease;
        
        // Update parallax elements
        this.updateParallax();
        
        requestAnimationFrame(() => this.update());
    }

    updateParallax() {
        const parallaxElements = document.querySelectorAll('[data-scroll-speed]');
        parallaxElements.forEach(el => {
            const speed = el.dataset.scrollSpeed || 1;
            const yPos = -(this.scrollY * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

// Initialize smooth scroll
const smoothScroll = new SmoothScroll();

// ========================================
// CUSTOM CURSOR
// ========================================

class CustomCursor {
    constructor() {
        this.cursor = { x: 0, y: 0 };
        this.dot = { x: 0, y: 0 };
        this.outline = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Create cursor elements
        this.dotElement = document.createElement('div');
        this.dotElement.className = 'cursor-dot';
        this.outlineElement = document.createElement('div');
        this.outlineElement.className = 'cursor-outline';
        
        document.body.appendChild(this.dotElement);
        document.body.appendChild(this.outlineElement);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursor.x = e.clientX;
            this.cursor.y = e.clientY;
        });

        // Hover effects
        this.addHoverEffects();

        // Start animation
        this.animate();
    }

    animate() {
        // Smooth following for dot
        this.dot.x += (this.cursor.x - this.dot.x) * 0.3;
        this.dot.y += (this.cursor.y - this.dot.y) * 0.3;

        // Smooth following for outline (slower)
        this.outline.x += (this.cursor.x - this.outline.x) * 0.15;
        this.outline.y += (this.cursor.y - this.outline.y) * 0.15;

        // Update positions
        this.dotElement.style.left = `${this.dot.x}px`;
        this.dotElement.style.top = `${this.dot.y}px`;
        this.outlineElement.style.left = `${this.outline.x}px`;
        this.outlineElement.style.top = `${this.outline.y}px`;

        requestAnimationFrame(() => this.animate());
    }

    addHoverEffects() {
        const hoverElements = document.querySelectorAll('a, button, .work-link, .cta-button, .cta-link');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.outlineElement.classList.add('hover');
                this.dotElement.style.transform = 'scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.outlineElement.classList.remove('hover');
                this.dotElement.style.transform = 'scale(1)';
            });
        });
    }
}

// Initialize custom cursor on desktop
if (window.innerWidth > 768) {
    const customCursor = new CustomCursor();
}

// ========================================
// MAGNETIC BUTTONS
// ========================================

class MagneticButton {
    constructor(element) {
        this.element = element;
        this.boundingRect = element.getBoundingClientRect();
        this.init();
    }

    init() {
        this.element.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
    }

    handleMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;
        
        if (distance < maxDistance) {
            const strength = (maxDistance - distance) / maxDistance;
            this.element.style.transform = `translate(${x * strength * 0.3}px, ${y * strength * 0.3}px)`;
        }
    }

    handleMouseLeave() {
        this.element.style.transform = 'translate(0, 0)';
    }
}

// Apply to all buttons and links
document.querySelectorAll('.cta-button, .cta-link, .cookie-btn, .nav-link').forEach(el => {
    new MagneticButton(el);
});

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimation {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll]');
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '-50px'
            }
        );

        this.elements.forEach(el => this.observer.observe(el));
    }

    handleIntersection(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.scrollDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
                this.observer.unobserve(entry.target);
            }
        });
    }
}

const scrollAnimation = new ScrollAnimation();

// ========================================
// TEXT SPLIT ANIMATION
// ========================================

class TextSplit {
    static splitChars(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 0.03}s`;
            element.appendChild(span);
        });
    }
}

// Apply to hero title words
document.querySelectorAll('.hero-title .word').forEach(word => {
    word.classList.add('split-chars');
    TextSplit.splitChars(word);
});

// ========================================
// WORK GRID HORIZONTAL SCROLL
// ========================================

const workGrid = document.querySelector('.work-grid');
if (workGrid) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let lastX = 0;
    let lastTime = Date.now();

    workGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - workGrid.offsetLeft;
        scrollLeft = workGrid.scrollLeft;
        workGrid.style.cursor = 'grabbing';
        workGrid.style.userSelect = 'none';
        lastX = e.pageX;
        lastTime = Date.now();
        velocity = 0;
    });

    workGrid.addEventListener('mouseleave', () => {
        isDown = false;
        workGrid.style.cursor = 'grab';
    });

    workGrid.addEventListener('mouseup', () => {
        isDown = false;
        workGrid.style.cursor = 'grab';
        
        // Apply momentum
        const momentumInterval = setInterval(() => {
            velocity *= 0.95; // Friction
            workGrid.scrollLeft += velocity;
            
            if (Math.abs(velocity) < 0.5) {
                clearInterval(momentumInterval);
            }
        }, 16);
    });

    workGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.pageX - workGrid.offsetLeft;
        const walk = (x - startX) * 2;
        workGrid.scrollLeft = scrollLeft - walk;
        
        // Calculate velocity
        const now = Date.now();
        const dt = now - lastTime;
        const dx = e.pageX - lastX;
        velocity = (dx / dt) * 16; // Pixels per frame
        
        lastX = e.pageX;
        lastTime = now;
    });

    workGrid.style.cursor = 'grab';
}

// ========================================
// NAVIGATION HIDE/SHOW ON SCROLL
// ========================================

let lastScrollY = window.scrollY;
let ticking = false;
const nav = document.querySelector('.main-nav');

function updateNav() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        nav.style.transform = 'translateY(-100%)';
    } else {
        nav.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
    }
});

// ========================================
// MENU TOGGLE
// ========================================

const menuToggle = document.getElementById('menuToggle');
const navOverlay = document.getElementById('navOverlay');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
    });
}

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navOverlay.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ========================================
// SMOOTH ANCHOR SCROLLING
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const targetPosition = target.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// COOKIE NOTICE
// ========================================

const cookieNotice = document.getElementById('cookieNotice');
const cookieAccept = document.getElementById('cookieAccept');

if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
        cookieNotice.classList.add('hidden');
        localStorage.setItem('cookiesAccepted', 'true');
        setTimeout(() => cookieNotice.style.display = 'none', 400);
    });
}

if (localStorage.getItem('cookiesAccepted') === 'true') {
    cookieNotice.style.display = 'none';
}

// ========================================
// IMAGE REVEAL ON SCROLL
// ========================================

const images = document.querySelectorAll('.work-image');
images.forEach(img => {
    img.classList.add('image-reveal');
});

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Add will-change on hover
const workItems = document.querySelectorAll('.work-item');
workItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.willChange = 'transform';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.willChange = 'auto';
    });
});

// Debounce resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('resize', debounce(() => {
    // Reinitialize on resize if needed
    console.log('Resized');
}, 250));

// ========================================
// CONSOLE STYLING
// ========================================

console.log(
    '%c✨ Creative Studio ',
    'background: #1d1d1f; color: #f5f5f7; font-size: 24px; padding: 20px; font-weight: bold;'
);
console.log(
    '%cBuilt with smooth animations and modern interactions',
    'color: #06c; font-size: 14px;'
);

// ========================================
// ACCESSIBILITY
// ========================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ========================================
// PAGE LOAD ANIMATION
// ========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.hero-title .line').forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('animated');
            }, index * 100);
        });
    }, 100);
});

// ========================================
// SCROLL PROGRESS INDICATOR (Optional)
// ========================================

function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = (window.scrollY / documentHeight) * 100;
    
    // You can use this to show a progress bar if needed
    // progressBar.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ========================================
// EXPORT FOR DEBUGGING
// ========================================

window.portfolioDebug = {
    smoothScroll,
    scrollAnimation,
    version: '2.0'
};