// ========================================
// THE DIGITAL THREAD - World-Class Hero Animation
// Award-winning entrance sequence for Nova Studio
// ========================================

class DigitalThread {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.heroHeadline = document.getElementById('heroHeadline');
        this.hero3D = document.getElementById('hero3D');
        this.heroOrb = document.getElementById('heroOrb');
        
        this.mouse = { x: 0.5, y: 0.5 };
        this.mouseSmooth = { x: 0.5, y: 0.5 };
        
        this.timeline = null;
        this.particles = [];
        this.threadPath = [];
        this.isReady = false;
    }
    
    init() {
        if (!this.hero) return;
        
        // Create particle canvas
        this.createParticleCanvas();
        
        // Setup mouse tracking
        this.setupMouseTracking();
        
        // Build entrance timeline
        this.buildEntranceSequence();
        
        // Setup parallax layers
        this.setupParallax();
        
        // Setup scroll interaction
        this.setupScrollInteraction();
        
        this.isReady = true;
    }
    
    createParticleCanvas() {
        this.particleCanvas = document.createElement('canvas');
        this.particleCanvas.style.position = 'absolute';
        this.particleCanvas.style.top = '0';
        this.particleCanvas.style.left = '0';
        this.particleCanvas.style.width = '100%';
        this.particleCanvas.style.height = '100%';
        this.particleCanvas.style.pointerEvents = 'none';
        this.particleCanvas.style.zIndex = '1';
        this.hero.insertBefore(this.particleCanvas, this.hero.firstChild);
        
        this.ctx = this.particleCanvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.hero.getBoundingClientRect();
        this.particleCanvas.width = rect.width;
        this.particleCanvas.height = rect.height;
    }
    
    setupMouseTracking() {
        this.hero.addEventListener('mousemove', (e) => {
            const rect = this.hero.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) / rect.width;
            this.mouse.y = (e.clientY - rect.top) / rect.height;
        });
        
        // Smooth mouse interpolation
        const smoothMouse = () => {
            const ease = 0.05;
            this.mouseSmooth.x += (this.mouse.x - this.mouseSmooth.x) * ease;
            this.mouseSmooth.y += (this.mouse.y - this.mouseSmooth.y) * ease;
            requestAnimationFrame(smoothMouse);
        };
        smoothMouse();
    }
    
    buildEntranceSequence() {
        this.timeline = gsap.timeline({
            onComplete: () => {
                this.startIdleState();
            }
        });
        
        // 0.0-0.3s: Atmospheric glow
        this.timeline.to(this.hero, {
            '--hero-glow': 1,
            duration: 0.3,
            ease: 'power1.out'
        }, 0);
        
        // 0.3-0.8s: Spawn particles
        this.timeline.add(() => {
            this.spawnParticles();
        }, 0.3);
        
        // 0.7-1.5s: Draw luminous thread
        this.timeline.add(() => {
            this.drawThread();
        }, 0.7);
        
        // 1.2-2.0s: Construct 3D knot from thread
        if (this.hero3D) {
            this.timeline.fromTo(this.hero3D,
                { 
                    opacity: 0,
                    scale: 0.3,
                    rotationY: -90
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                },
                1.2
            );
        }
        
        // Typography reveals
        this.animateTypography();
    }
    
    spawnParticles() {
        const centerX = this.particleCanvas.width * 0.65; // Center-right
        const centerY = this.particleCanvas.height * 0.35;
        const count = 12; // Sparse and elegant
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const angle = (i / count) * Math.PI * 2;
                const radius = 30 + Math.random() * 40;
                
                this.particles.push({
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: 1.5 + Math.random() * 2,
                    opacity: 0,
                    targetOpacity: 0.6 + Math.random() * 0.4,
                    life: 1
                });
            }, i * 40);
        }
        
        this.animateParticles();
    }
    
    animateParticles() {
        const animate = () => {
            if (this.particles.length === 0) return;
            
            this.ctx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
            
            this.particles = this.particles.filter(p => {
                // Fade in
                if (p.opacity < p.targetOpacity) {
                    p.opacity += 0.02;
                }
                
                // Gentle drift
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.003;
                
                // Draw particle
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                gradient.addColorStop(0, `rgba(107, 91, 255, ${p.opacity})`);
                gradient.addColorStop(0.5, `rgba(255, 107, 157, ${p.opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(107, 91, 255, 0)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                this.ctx.fill();
                
                return p.life > 0;
            });
            
            if (this.particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    drawThread() {
        const startX = this.particleCanvas.width * 0.5;
        const startY = this.particleCanvas.height * 0.5;
        const endX = this.particleCanvas.width * 0.75;
        const endY = this.particleCanvas.height * 0.25;
        
        // Create curved path
        const points = 50;
        for (let i = 0; i <= points; i++) {
            const t = i / points;
            const curve = Math.sin(t * Math.PI) * 50; // Organic curvature
            
            this.threadPath.push({
                x: startX + (endX - startX) * t + curve,
                y: startY + (endY - startY) * t - curve,
                progress: 0,
                targetProgress: 1
            });
        }
        
        this.animateThread();
    }
    
    animateThread() {
        let progress = 0;
        const duration = 800; // 0.8 seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            this.ctx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
            
            // Draw thread
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(107, 91, 255, ${0.8 * progress})`;
            this.ctx.lineWidth = 2;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(107, 91, 255, 0.6)';
            
            const visiblePoints = Math.floor(this.threadPath.length * progress);
            
            for (let i = 0; i < visiblePoints; i++) {
                const point = this.threadPath[i];
                if (i === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            }
            
            this.ctx.stroke();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    animateTypography() {
        const words = this.heroHeadline.querySelectorAll('.headline-word');
        
        console.log('Found words:', words.length); // Debug log
        
        // Set initial state for all words to be hidden
        gsap.set(words, { opacity: 0 });
        
        // "We" - First word
        if (words[0]) {
            this.timeline.fromTo(
                words[0],
                {
                    opacity: 0,
                    y: 20,
                    scaleX: 0.92,
                    filter: 'blur(8px)'
                },
                {
                    opacity: 1,
                    y: 0,
                    scaleX: 1,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'expo.out'
                },
                1.8
            );
        }
        
        // "craft" - Second word
        if (words[1]) {
            this.timeline.fromTo(
                words[1],
                {
                    opacity: 0,
                    y: 20,
                    scaleX: 0.92,
                    filter: 'blur(8px)'
                },
                {
                    opacity: 1,
                    y: 0,
                    scaleX: 1,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'expo.out'
                },
                1.9 // Slight stagger
            );
        }
        
        // "digital" - Letter-by-letter kinetic reveal
        const digitalWord = words[2];
        if (digitalWord) {
            const letters = digitalWord.textContent.split('');
            digitalWord.textContent = '';
            
            letters.forEach((letter, i) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                digitalWord.appendChild(span);
                
                this.timeline.fromTo(
                    span,
                    {
                        opacity: 0,
                        x: -15,
                        scaleX: 0.7,
                        scaleY: 1.2
                    },
                    {
                        opacity: 1,
                        x: 0,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 0.5,
                        ease: 'expo.out'
                    },
                    2.3 + (i * 0.08)
                );
            });
            
            // Subtle gradient movement
            this.timeline.to(
                digitalWord,
                {
                    backgroundPosition: '200% center',
                    duration: 1.5,
                    ease: 'power1.inOut'
                },
                2.5
            );
        }
        
        // "experiences" - Heavy, confident landing
        this.timeline.fromTo(
            words[3],
            {
                opacity: 0,
                y: 40,
                scale: 0.98
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                ease: 'power3.out'
            },
            2.8
        );
        
        // Eyebrow and footer text
        const eyebrow = document.querySelector('.hero-eyebrow');
        const footer = document.querySelector('.hero-footer-text');
        
        if (eyebrow) {
            this.timeline.fromTo(
                eyebrow,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                2.0
            );
        }
        
        if (footer) {
            this.timeline.fromTo(
                footer,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                3.2
            );
        }
    }
    
    setupParallax() {
        const updateParallax = () => {
            if (!this.isReady) return;
            
            const x = (this.mouseSmooth.x - 0.5) * 2;
            const y = (this.mouseSmooth.y - 0.5) * 2;
            
            // Typography - subtle parallax (3-6px)
            if (this.heroHeadline) {
                const moveX = x * 3;
                const moveY = y * 3;
                this.heroHeadline.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
            
            // 3D object - noticeable parallax with inertia (15-25px)
            if (this.hero3D) {
                const moveX = x * 20;
                const moveY = y * 20;
                const rotateY = x * 8;
                const rotateX = -y * 8;
                
                gsap.to(this.hero3D, {
                    x: moveX,
                    y: moveY,
                    rotationY: rotateY,
                    rotationX: rotateX,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
            
            // Background atmosphere (2-5px)
            if (this.heroOrb) {
                const moveX = x * 4;
                const moveY = y * 4;
                gsap.to(this.heroOrb, {
                    x: moveX,
                    y: moveY,
                    duration: 1.2,
                    ease: 'power1.out'
                });
            }
            
            requestAnimationFrame(updateParallax);
        };
        
        updateParallax();
    }
    
    startIdleState() {
        // Gentle breathing scale on 3D object
        if (this.hero3D) {
            gsap.to(this.hero3D, {
                scale: 1.02,
                duration: 3,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            });
        }
        
        // Micro-interaction for 3D object on hover
        if (this.hero3D) {
            const hero3DEl = this.hero3D.querySelector('canvas');
            if (hero3DEl) {
                hero3DEl.addEventListener('mouseenter', () => {
                    gsap.to(this.hero3D, {
                        scale: 1.08,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                });
                
                hero3DEl.addEventListener('mouseleave', () => {
                    gsap.to(this.hero3D, {
                        scale: 1,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.5)'
                    });
                });
            }
        }
    }
    
    setupScrollInteraction() {
        gsap.to('.headline-word:nth-child(1), .headline-word:nth-child(2)', {
            y: -50,
            opacity: 0.3,
            scrollTrigger: {
                trigger: this.hero,
                start: 'top top',
                end: '+=300',
                scrub: 1
            }
        });
        
        gsap.to('.headline-word.accent', {
            y: -70,
            scaleX: 1.05,
            scrollTrigger: {
                trigger: this.hero,
                start: 'top top',
                end: '+=300',
                scrub: 1
            }
        });
        
        gsap.to('.headline-word:nth-child(4)', {
            y: 40,
            opacity: 0.3,
            scrollTrigger: {
                trigger: this.hero,
                start: 'top top',
                end: '+=300',
                scrub: 1
            }
        });
        
        if (this.hero3D) {
            gsap.to(this.hero3D, {
                x: () => window.innerWidth * 0.1,
                rotationY: 50,
                scale: 1.15,
                opacity: 0,
                scrollTrigger: {
                    trigger: this.hero,
                    start: 'top top',
                    end: '+=300',
                    scrub: 1
                }
            });
        }
    }
}

// Initialize when ready
if (typeof gsap !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const digitalThread = new DigitalThread();
            digitalThread.init();
        }, 2000); // Wait for preloader
    });
}
