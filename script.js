/* ============================================
   SASANK PORTFOLIO — JS
   Particles + Scroll + Init
   ============================================ */

// ─── LUCIDE ICONS ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});

// ─── PARTICLE CANVAS ────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    const isLight = document.body.classList.contains('light');
    this.opacity = isLight
      ? Math.random() * 0.45 + 0.5
      : Math.random() * 0.55 + 0.2;
    this.maxOpacity = this.opacity;
    this.color = isLight
      ? (Math.random() > 0.6 ? '#0077aa' : Math.random() > 0.5 ? '#6d28d9' : '#1d4ed8')
      : (Math.random() > 0.6 ? '#00d4ff' : Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6');
    this.life = Math.random() * 200 + 100;
    this.maxLife = this.life;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;

    // Mouse repulsion
    if (mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
      }
    }

    // Fade in/out
    const lifeRatio = this.life / this.maxLife;
    if (lifeRatio > 0.9) {
      this.opacity = this.maxOpacity * ((1 - lifeRatio) / 0.1);
    } else if (lifeRatio < 0.2) {
      this.opacity = this.maxOpacity * (lifeRatio / 0.2);
    } else {
      this.opacity = this.maxOpacity;
    }

    if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawConnections() {
  const isLight = document.body.classList.contains('light');
  const lineColor = isLight ? '#0077aa' : '#00d4ff';
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const opacity = (1 - dist / 100) * (isLight ? 0.18 : 0.12);
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife; // stagger lifetimes
    particles.push(p);
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  animationId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Stop animation when hero is not visible (perf)
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!animationId) animateParticles();
    } else {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  });
}, { threshold: 0.1 });

const heroSection = document.querySelector('.hero');
if (heroSection) heroObserver.observe(heroSection);

// ─── NAV SCROLL STATE ────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  const isLight = document.body.classList.contains('light');
  if (window.scrollY > 50) {
    nav.style.background = isLight
      ? 'rgba(240, 244, 255, 0.98)'
      : 'rgba(6, 8, 16, 0.95)';
    nav.style.boxShadow = isLight
      ? '0 2px 20px rgba(0,0,0,0.08)'
      : '0 0 30px rgba(0,0,0,0.5)';
  } else {
    nav.style.background = isLight
      ? 'rgba(240, 244, 255, 0.92)'
      : 'rgba(6, 8, 16, 0.85)';
    nav.style.boxShadow = 'none';
  }
});

// ─── SCROLL REVEAL ───────────────────────────
const revealElements = document.querySelectorAll(
  '.section-label, .section-title, .about-text p, .about-tags, .profile-card, .skill-group, .cert-badge, .exp-card, .project-card, .dashboard-card, .contact-card, .hero-stats .stat-card'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.7s ease ${(i % 6) * 0.08}s, transform 0.7s ease ${(i % 6) * 0.08}s`;
  revealObserver.observe(el);
});

// ─── SKILL BAR ANIMATION ─────────────────────
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(el => {
  el.style.animationPlayState = 'paused';
  skillObserver.observe(el);
});

// ─── ACTIVE NAV LINK ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--cyan)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── SMOOTH HOVER GLOW ON CARDS ─────────────
document.querySelectorAll('.project-card, .exp-card, .skill-group').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ─── TYPING EFFECT on hero tagline ──────────
const tagline = document.querySelector('.hero-tagline');
if (tagline) {
  const originalText = tagline.textContent;
  tagline.textContent = '';

  let charIndex = 0;
  const typeDelay = 1200; // start delay

  setTimeout(() => {
    const typeInterval = setInterval(() => {
      if (charIndex < originalText.length) {
        tagline.textContent += originalText[charIndex];
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // Add blinking cursor then remove
        tagline.innerHTML += '<span class="cursor">|</span>';
        setTimeout(() => {
          const cursor = tagline.querySelector('.cursor');
          if (cursor) cursor.remove();
        }, 2000);
      }
    }, 45);
  }, typeDelay);
}

// Cursor blink CSS injected
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  .cursor {
    color: var(--cyan);
    animation: blink 0.8s ease-in-out infinite;
    font-weight: 100;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;
document.head.appendChild(cursorStyle);

// ─── CONSOLE EASTER EGG ──────────────────────
console.log('%c👾 Sasank Nandula — Data Analyst', 'color: #00d4ff; font-size: 18px; font-family: monospace; font-weight: bold;');
console.log('%cOpen to Data Analyst roles. Reach out: nandulashanmu123@gmail.com', 'color: #8b5cf6; font-size: 12px; font-family: monospace;');

// ─── THEME TOGGLE ────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Restore saved preference
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  const isLight = body.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');

  // Update nav inline style immediately
  if (window.scrollY > 50) {
    nav.style.background = isLight ? 'rgba(240, 244, 255, 0.98)' : 'rgba(6, 8, 16, 0.95)';
    nav.style.boxShadow = isLight ? '0 2px 20px rgba(0,0,0,0.08)' : '0 0 30px rgba(0,0,0,0.5)';
  } else {
    nav.style.background = isLight ? 'rgba(240, 244, 255, 0.92)' : 'rgba(6, 8, 16, 0.85)';
    nav.style.boxShadow = 'none';
  }

  // Re-tint particles for the new theme
  updateParticleColors(isLight);
});

function updateParticleColors(isLight) {
  particles.forEach(p => {
    p.color = isLight
      ? (Math.random() > 0.6 ? '#0077aa' : Math.random() > 0.5 ? '#6d28d9' : '#1d4ed8')
      : (Math.random() > 0.6 ? '#00d4ff' : Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6');
    p.opacity = isLight
      ? Math.random() * 0.45 + 0.5
      : Math.random() * 0.55 + 0.2;
    p.maxOpacity = p.opacity;
  });
}