// ========================================
// GLOBAL VARIABLES
// ========================================

let lastScrollY = window.scrollY;
let ticking = false;

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close menu if open
                const navOverlay = document.getElementById('navOverlay');
                const menuToggle = document.getElementById('menuToggle');
                if (navOverlay.classList.contains('active')) {
                    navOverlay.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        }
    });
});

// ========================================
// NAVIGATION MENU TOGGLE
// ========================================

const menuToggle = document.getElementById('menuToggle');
const navOverlay = document.getElementById('navOverlay');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// COOKIE NOTICE
// ========================================

const cookieNotice = document.getElementById('cookieNotice');
const cookieAccept = document.getElementById('cookieAccept');

if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
        cookieNotice.classList.add('hidden');
        localStorage.setItem('cookiesAccepted', 'true');
        setTimeout(() => {
            cookieNotice.style.display = 'none';
        }, 400);
    });
}

// Check if cookies were already accepted
if (localStorage.getItem('cookiesAccepted') === 'true') {
    cookieNotice.style.display = 'none';
}

// ========================================
// HIDE/SHOW NAVIGATION ON SCROLL
// ========================================

const nav = document.querySelector('.main-nav');

function updateNav() {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down
        nav.classList.add('hidden');
    } else {
        // Scrolling up
        nav.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
    }
});

// ========================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ========================================

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add delay based on index for staggered animation
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with data-scroll attribute
const scrollElements = document.querySelectorAll('[data-scroll]');
scrollElements.forEach(el => observer.observe(el));

// ========================================
// CUSTOM CURSOR
// ========================================

const cursor = document.getElementById('customCursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth cursor following
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor interactions
const interactiveElements = document.querySelectorAll('a, button, .work-link');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

// Show cursor only on desktop
if (window.innerWidth > 768) {
    cursor.style.opacity = '1';
}

// ========================================
// PARALLAX EFFECT FOR HERO
// ========================================

const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    if (hero) {
        const scrolled = window.scrollY;
        const parallaxSpeed = 0.5;
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            heroContent.style.opacity = 1 - (scrolled / 500);
        }
    }
});

// ========================================
// WORK GRID HORIZONTAL SCROLL (OPTIONAL)
// ========================================

const workGrid = document.querySelector('.work-grid');
let isDown = false;
let startX;
let scrollLeft;

if (workGrid && window.innerWidth > 768) {
    workGrid.style.cursor = 'grab';
    
    workGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        workGrid.style.cursor = 'grabbing';
        startX = e.pageX - workGrid.offsetLeft;
        scrollLeft = workGrid.scrollLeft;
    });
    
    workGrid.addEventListener('mouseleave', () => {
        isDown = false;
        workGrid.style.cursor = 'grab';
    });
    
    workGrid.addEventListener('mouseup', () => {
        isDown = false;
        workGrid.style.cursor = 'grab';
    });
    
    workGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - workGrid.offsetLeft;
        const walk = (x - startX) * 2;
        workGrid.scrollLeft = scrollLeft - walk;
    });
}

// ========================================
// ANIMATED COUNTER (FOR STATS IF NEEDED)
// ========================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ========================================
// MAGNETIC BUTTONS EFFECT
// ========================================

const magneticButtons = document.querySelectorAll('.cta-button, .cta-link, .cookie-btn');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

// ========================================
// TEXT SCRAMBLE EFFECT (OPTIONAL)
// ========================================

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ========================================
// HIGHLIGHT ANIMATION ON SCROLL
// ========================================

const highlights = document.querySelectorAll('.highlight');

const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const highlight = entry.target;
            const after = window.getComputedStyle(highlight, '::after');
            
            // Trigger the animation by adding a class
            setTimeout(() => {
                highlight.style.setProperty('--underline-width', '100%');
            }, 200);
            
            highlightObserver.unobserve(highlight);
        }
    });
}, { threshold: 0.5 });

highlights.forEach(highlight => {
    highlight.style.setProperty('--underline-width', '0%');
    highlightObserver.observe(highlight);
});

// ========================================
// LAZY LOADING IMAGES (IF IMAGES ARE ADDED)
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for resize events
function debounce(func, wait = 20) {
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Update cursor visibility
    if (window.innerWidth > 768) {
        cursor.style.opacity = '1';
    } else {
        cursor.style.opacity = '0';
    }
}));

// ========================================
// PRELOADER (OPTIONAL)
// ========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ========================================
// EASTER EGG: KONAMI CODE
// ========================================

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s infinite';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Add rainbow animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c Welcome to Creative Studio! ', 'background: #1d1d1f; color: #f5f5f7; font-size: 20px; padding: 10px;');
console.log('%c Looking for something? Check out our code! ', 'background: #06c; color: white; font-size: 14px; padding: 5px;');

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add styles for keyboard navigation
const a11yStyle = document.createElement('style');
a11yStyle.textContent = `
    body:not(.keyboard-nav) *:focus {
        outline: none;
    }
    
    .keyboard-nav *:focus {
        outline: 2px solid #06c;
        outline-offset: 4px;
    }
`;
document.head.appendChild(a11yStyle);