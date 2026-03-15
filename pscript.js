/* ============================================
   pscript.js - Portfolio JavaScript
   ============================================ */

'use strict';

// ===== LOADER =====
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderPercent = document.getElementById('loaderPercent');
document.body.classList.add('loading');

let progress = 0;
const loaderInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loaderInterval);
        loaderFill.style.width = '100%';
        loaderPercent.textContent = '100%';
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            initReveal();
        }, 400);
    }
    loaderFill.style.width = Math.min(progress, 100) + '%';
    loaderPercent.textContent = Math.floor(Math.min(progress, 100)) + '%';
}, 80);

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let cursorX = 0, cursorY = 0;
let ringX = 0, ringY = 0;
let isHovering = false;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.left = cursorX + 'px';
    cursorDot.style.top = cursorY + 'px';
});

function animateRing() {
    ringX += (cursorX - ringX) * 0.12;
    ringY += (cursorY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

const hoverTargets = 'a, button, .skill-card, .project-card, .cert-card, .coding-card';
document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
        cursorRing.classList.add('hovering');
    }
});
document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
        cursorRing.classList.remove('hovering');
    }
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    handleBackToTop();
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// Active nav link on scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (link) {
            if (scrollPos >= top && scrollPos < bottom) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('pk-theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.add('light');
    themeIcon.className = 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('pk-theme', isLight ? 'light' : 'dark');
});

// ===== HERO TYPEWRITER =====
const roles = ['Data Analyst'];

const roleEl = document.getElementById('roleDynamic');
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeDelay = 120;

function typeRole() {
    const current = roles[roleIdx];
    if (!isDeleting) {
        roleEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
            isDeleting = true;
            typeDelay = 2000;
        } else {
            typeDelay = 80 + Math.random() * 60;
        }
    } else {
        roleEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeDelay = 300;
        } else {
            typeDelay = 40;
        }
    }
    setTimeout(typeRole, typeDelay);
}
setTimeout(typeRole, 1200);

// ===== SCROLL REVEAL =====
function initReveal() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const isNum = !isNaN(parseInt(target));
    if (!isNum) return;

    function update(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const nums = entry.target.querySelectorAll('[data-target]');
            nums.forEach(num => {
                const target = parseInt(num.dataset.target);
                animateCounter(num, target);
            });
            const csNums = entry.target.querySelectorAll('.cs-num[data-target]');
            csNums.forEach(num => {
                const target = parseInt(num.dataset.target);
                animateCounter(num, target);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) counterObserver.observe(statsStrip);
const codingSection = document.querySelector('.coding');
if (codingSection) counterObserver.observe(codingSection);

// ===== SKILL BARS =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.skill-bar');
            bars.forEach(bar => {
                const w = bar.dataset.width;
                setTimeout(() => { bar.style.width = w + '%'; }, 200);
            });
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-panel').forEach(p => skillObserver.observe(p));

// ===== SKILLS TABS =====
const skillTabs = document.querySelectorAll('.skill-tab');
const skillPanels = document.querySelectorAll('.skills-panel');

skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        skillTabs.forEach(t => t.classList.remove('active'));
        skillPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById('tab-' + target);
        if (panel) {
            panel.classList.add('active');
            // Animate bars in new panel
            const bars = panel.querySelectorAll('.skill-bar');
            bars.forEach(bar => {
                bar.style.width = '0%';
                setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 50);
            });
            // Trigger reveal in panel
            panel.querySelectorAll('.reveal-up').forEach((el, i) => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), i * 80);
            });
        }
    });
});

// Trigger initial tab bar animation
window.addEventListener('load', () => {
    setTimeout(() => {
        const activePanel = document.querySelector('.skills-panel.active');
        if (activePanel) {
            const bars = activePanel.querySelectorAll('.skill-bar');
            bars.forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        }
    }, 500);
});

// ===== PROJECT FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const cat = card.dataset.category;
            if (filter === 'all' || cat === filter) {
                card.classList.remove('hidden');
                // Re-trigger animation
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = '';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== TIMELINE TOGGLE =====
const timelineBtns = document.querySelectorAll('.timeline-btn');
const timelineContents = document.querySelectorAll('.timeline-content');

timelineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.timeline;
        timelineBtns.forEach(b => b.classList.remove('active'));
        timelineContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const content = document.getElementById('timeline-' + target);
        if (content) {
            content.classList.add('active');
            content.querySelectorAll('.reveal-up').forEach((el, i) => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), i * 120);
            });
        }
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn?.querySelector('.btn-text');
const btnLoading = submitBtn?.querySelector('.btn-loading');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';
        submitBtn.disabled = true;

        // Simulate sending (replace with actual EmailJS / FormSubmit / fetch)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success
        if (btnText) btnText.style.display = 'flex';
        if (btnLoading) btnLoading.style.display = 'none';
        submitBtn.disabled = false;

        if (formSuccess) {
            formSuccess.style.display = 'flex';
            setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
        }
        contactForm.reset();

        // TODO: Replace the simulation above with real form handler, e.g.:
        // EmailJS: emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', contactForm, 'PUBLIC_KEY')
        // FormSubmit: fetch('https://formsubmit.co/ajax/YOUR_EMAIL', { method: 'POST', body: new FormData(contactForm) })
    });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

function handleBackToTop() {
    if (window.scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== FOOTER YEAR =====
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

// ===== SKILL CARD TILT EFFECT =====
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== SECTION ACTIVE GLOW =====
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (navLink) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}, { threshold: 0.3, rootMargin: '-80px 0px -20% 0px' });

document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));

// ===== CERT CARD SHINE EFFECT =====
document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--card-hover), var(--card))`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});

// ===== LAZY LOAD IMAGES =====
const lazyImages = document.querySelectorAll('img');
const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            imgObserver.unobserve(img);
        }
    });
}, { threshold: 0.1 });
lazyImages.forEach(img => imgObserver.observe(img));

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    }
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        const sections = ['home', 'about', 'skills', 'projects', 'experience', 'certificates', 'coding', 'contact'];
        const current = sections.findIndex(id => {
            const el = document.getElementById(id);
            if (!el) return false;
            return el.getBoundingClientRect().top > -100;
        });
        const next = sections[Math.min(current + 1, sections.length - 1)];
        document.getElementById(next)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// ===== CONSOLE EASTER EGG =====
console.log(
    '%c👋 Hey there, fellow developer!',
    'font-size: 20px; font-weight: bold; color: #6366f1;'
);
console.log(
    '%cThis portfolio is built with pure HTML, CSS & JavaScript.\nFeel free to check out the source code on GitHub!',
    'font-size: 13px; color: #9898b0; line-height: 1.6;'
);

// ===== PERFORMANCE: PASSIVE SCROLL =====
window.addEventListener('scroll', () => { }, { passive: true });

console.log('%c✅ Portfolio initialized successfully!', 'color: #10b981; font-weight: bold;');