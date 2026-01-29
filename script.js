
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.particleCount = 50;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');


    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '2';

    this.container.style.position = 'relative';
    this.container.appendChild(this.canvas);

    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {

      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      particle.pulsePhase += particle.pulseSpeed;
      const pulse = Math.sin(particle.pulsePhase) * 0.3 + 0.7;

      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      gradient.addColorStop(0, `rgba(228, 200, 152, ${particle.opacity * pulse})`);
      gradient.addColorStop(0.5, `rgba(201, 169, 97, ${particle.opacity * pulse * 0.5})`);
      gradient.addColorStop(1, 'rgba(201, 169, 97, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      this.ctx.fill();


      this.ctx.fillStyle = `rgba(255, 235, 180, ${particle.opacity * pulse})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

function typewriterEffect(element, text, speed = 80) {
  element.textContent = '';
  element.style.opacity = '1';
  let i = 0;

  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };

  setTimeout(type, 500);
}


function add3DTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  });
}

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');


window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Active link highlighting and smooth scroll
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove active class from all links
    navLinks.forEach(l => l.classList.remove('active'));

    // Add active class to clicked link
    link.classList.add('active');

    // Close mobile menu if open
    navMenu.classList.remove('active');

    // Smooth scroll to section
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ===== Scroll Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => observer.observe(item));

// Observe project cards with 3D tilt effect
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
  observer.observe(card);
  // Add staggered 3D tilt
  setTimeout(() => {
    add3DTilt(card);
  }, index * 100);
});

// Observe gallery items with staggered animation
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 0.05}s`;
  observer.observe(item);
});

// ===== Lightbox Functionality =====
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

// Open lightbox when gallery item is clicked
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
});

// Also make project images clickable
const projectImages = document.querySelectorAll('.project-image');
projectImages.forEach(img => {
  img.parentElement.addEventListener('click', () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Close lightbox
const closeLightbox = () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
};

lightboxClose.addEventListener('click', closeLightbox);

// Close on background click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// ===== Active Section Detection =====
const sections = document.querySelectorAll('section[id]');

const updateActiveLink = () => {
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', updateActiveLink);

// ===== WOW FACTOR: Initialize on Page Load =====
window.addEventListener('load', () => {
  // Initialize particle system in hero
  const hero = document.querySelector('.hero');
  if (hero) {
    // Fade in hero
    hero.style.opacity = '0';
    setTimeout(() => {
      hero.style.transition = 'opacity 0.8s ease';
      hero.style.opacity = '1';
    }, 100);

    // Create particle effect
    new ParticleSystem(hero);
  }

  // Typewriter effect for hero subtitle
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    typewriterEffect(heroSubtitle, originalText, 60);
  }

  // Add glow pulse to timeline markers
  const timelineMarkers = document.querySelectorAll('.timeline-marker');
  timelineMarkers.forEach((marker, index) => {
    marker.style.animation = `glowPulse 2s ease-in-out ${index * 0.2}s infinite`;
  });
});

// ===== Optional: Add subtle parallax effect to hero =====
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.hero');

      if (hero && scrolled <= hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
      }

      ticking = false;
    });

    ticking = true;
  }
});

// ===== WOW FACTOR: Live Scouting Countdown =====
function updateScoutingCountdown() {
  const startDate = new Date('2017-01-01T00:00:00');
  const now = new Date();

  // Calculate differences
  const diffMs = now - startDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Calculate years, months, days, hours
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours();

  // Adjust for negative values
  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Update DOM
  document.getElementById('years').textContent = years;
  document.getElementById('months').textContent = months;
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
}

// Update countdown every second
updateScoutingCountdown();
setInterval(updateScoutingCountdown, 1000);

// ===== EASTER EGG: Confetti on Triple Click Logo =====
let logoClickCount = 0;
let logoClickTimer = null;

const navLogo = document.querySelector('.nav-logo');

navLogo.addEventListener('click', (e) => {
  logoClickCount++;

  if (logoClickCount === 1) {
    logoClickTimer = setTimeout(() => {
      logoClickCount = 0;
    }, 1000);
  }

  if (logoClickCount === 3) {
    clearTimeout(logoClickTimer);
    logoClickCount = 0;
    triggerEasterEgg();
  }
});

function triggerEasterEgg() {
  // Adjust confetti count based on screen size
  const isMobile = window.innerWidth <= 768;
  const colors = ['#d4af37', '#f4d03f', '#2d5016', '#4a7c2c'];
  const confettiCount = isMobile ? 50 : 100;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }, i * 20);
  }

  // Show special message - responsive sizing
  const message = document.createElement('div');
  message.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: clamp(1.5rem, 8vw, 3rem); margin-bottom: 0.5rem;">🎖️</div>
      <div style="font-size: clamp(1.2rem, 6vw, 2.5rem); line-height: 1.3;">ΑΙΕΝ ΑΡΙΣΤΕΥΕΙΝ!</div>
      <div style="font-size: clamp(1rem, 4vw, 1.5rem); margin-top: 0.5rem; opacity: 0.9;">82ον Σύστημα</div>
    </div>
  `;
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 900;
    color: #d4af37;
    text-shadow: 0 0 30px rgba(212, 175, 55, 0.8), 2px 2px 10px rgba(0, 0, 0, 0.8);
    z-index: 10000;
    pointer-events: none;
    animation: easterEggPulse 2.5s ease-out forwards;
    font-family: var(--font-heading);
    padding: 1rem;
    max-width: 90vw;
    background: rgba(45, 80, 22, 0.95);
    border-radius: 20px;
    border: 3px solid #d4af37;
    box-shadow: 0 0 40px rgba(212, 175, 55, 0.6);
  `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2500);
}

function createConfetti(color) {
  const confetti = document.createElement('div');
  confetti.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    background: ${color};
    top: -10px;
    left: ${Math.random() * 100}vw;
    opacity: 1;
    transform: rotate(${Math.random() * 360}deg);
    z-index: 9999;
    pointer-events: none;
  `;

  document.body.appendChild(confetti);

  const fallDuration = 2000 + Math.random() * 2000;
  const xMovement = (Math.random() - 0.5) * 200;

  confetti.animate([
    {
      top: '-10px',
      left: `${parseFloat(confetti.style.left)}px`,
      opacity: 1,
      transform: 'rotate(0deg)'
    },
    {
      top: '100vh',
      left: `${parseFloat(confetti.style.left) + xMovement}px`,
      opacity: 0,
      transform: `rotate(${Math.random() * 720}deg)`
    }
  ], {
    duration: fallDuration,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  });

  setTimeout(() => {
    confetti.remove();
  }, fallDuration);
}

// Add CSS for easter egg animation
const style = document.createElement('style');
style.textContent = `
  @keyframes easterEggPulse {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== POLISH: Scroll Progress Bar =====
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const totalScrollable = documentHeight - windowHeight;
  const scrollPercentage = (scrollTop / totalScrollable) * 100;

  scrollProgress.style.width = `${Math.min(scrollPercentage, 100)}%`;
}

window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

// ===== POLISH: Scroll to Top Button =====
const scrollToTopBtn = document.getElementById('scrollToTop');

function toggleScrollToTop() {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
}

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

window.addEventListener('scroll', toggleScrollToTop);
toggleScrollToTop();

// ===== POLISH: Preload Critical Resources =====
window.addEventListener('load', () => {
  // Mark page as fully loaded
  document.body.classList.add('loaded');

  // Preload hover states for better performance
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.style.willChange = 'transform';
    setTimeout(() => {
      card.style.willChange = 'auto';
    }, 1000);
  });
});

// ===== AVIATION: Airplane Seat Photo Gallery =====
const airplaneSeats = document.querySelectorAll('.airplane-seat');

airplaneSeats.forEach(seat => {
  seat.addEventListener('click', () => {
    const seatPhoto = seat.querySelector('.seat-photo');
    const bgImage = window.getComputedStyle(seatPhoto).backgroundImage;

    // Robust URL extraction using regex
    const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (!urlMatch) return;

    const imageUrl = urlMatch[1];

    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'seat-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <img src="${imageUrl}" alt="Αεροπροσκοπική Φωτογραφία">
        <div class="lightbox-caption">Θέση ${seat.dataset.seat}</div>
      </div>
    `;

    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      lightbox.classList.add('closing');
      setTimeout(() => lightbox.remove(), 300);
    };

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    setTimeout(() => lightbox.classList.add('active'), 10);
  });
});

// Lightbox styles
const airplaneStyle = document.createElement('style');
airplaneStyle.textContent = `
  .seat-lightbox {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0); z-index: 10000;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: all 0.3s ease;
  }
  .seat-lightbox.active {
    background: rgba(0, 0, 0, 0.9); opacity: 1;
  }
  .lightbox-content {
    position: relative; max-width: 90vw; max-height: 90vh;
    transform: scale(0.7); transition: transform 0.3s ease;
  }
  .seat-lightbox.active .lightbox-content { transform: scale(1); }
  .lightbox-content img {
    max-width: 100%; max-height: 85vh; border-radius: 12px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  }
  .lightbox-close {
    position: absolute; top: -40px; right: 0;
    background: var(--accent-gold-bright); border: none; color: white;
    font-size: 2rem; width: 40px; height: 40px; border-radius: 50%;
    cursor: pointer; transition: all 0.3s ease;
  }
  .lightbox-close:hover {
    background: var(--accent-gold); transform: rotate(90deg);
  }
  .lightbox-caption {
    text-align: center; color: var(--accent-gold-bright);
    font-size: 1.2rem; font-weight: 600; margin-top: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
`;
document.head.appendChild(airplaneStyle);

// ===== 3D ROTATING PHOTO CAROUSEL =====
const carousel3dWheel = document.getElementById('carousel3dWheel');
const carousel3dItems = document.querySelectorAll('.carousel-3d-item');
const carousel3dPrev = document.getElementById('carousel3dPrev');
const carousel3dNext = document.getElementById('carousel3dNext');
const carousel3dToggle = document.getElementById('carousel3dToggle');

let carousel3dAngle = 0;
let carousel3dIsRotating = false;
let carousel3dRotationInterval = null;
const carousel3dItemCount = carousel3dItems.length;
const carousel3dAngleIncrement = 360 / carousel3dItemCount;

function updateCarousel3D() {
  carousel3dWheel.style.transform = `rotateY(${carousel3dAngle}deg)`;

  // Position each item in a circle
  carousel3dItems.forEach((item, index) => {
    const itemAngle = carousel3dAngleIncrement * index;
    const radius = 700; // Distance from center for better depth

    item.style.transform = `
      rotateY(${itemAngle}deg) 
      translateZ(${radius}px)
    `;

    // Calculate if item is in front (facing viewer)
    const normalizedAngle = ((itemAngle - carousel3dAngle) % 360 + 360) % 360;

    // Adjust opacity and scale based on position for depth effect
    if (normalizedAngle > 90 && normalizedAngle < 270) {
      // Items on the back - Full visibility
      item.style.opacity = '1';
      item.style.transform += ' scale(0.85)';
    } else if (normalizedAngle > 45 && normalizedAngle <= 90 || normalizedAngle >= 270 && normalizedAngle < 315) {
      // Items on the sides - Full visibility
      item.style.opacity = '1';
      item.style.transform += ' scale(0.95)';
    } else {
      // Front item
      item.style.opacity = '1';
      item.style.transform += ' scale(1)';
    }
  });
}

function rotateCarousel3D(direction) {
  carousel3dAngle += carousel3dAngleIncrement * direction;
  updateCarousel3D();
}

function startCarousel3DRotation() {
  if (carousel3dRotationInterval) return;
  carousel3dIsRotating = true;
  carousel3dToggle.classList.add('rotating');
  carousel3dRotationInterval = setInterval(() => {
    rotateCarousel3D(1);
  }, 4000); // Rotate every 4 seconds
}

function stopCarousel3DRotation() {
  clearInterval(carousel3dRotationInterval);
  carousel3dRotationInterval = null;
  carousel3dIsRotating = false;
  carousel3dToggle.classList.remove('rotating');
}

// Navigation buttons
carousel3dPrev.addEventListener('click', () => {
  stopCarousel3DRotation();
  rotateCarousel3D(-1);
});

carousel3dNext.addEventListener('click', () => {
  stopCarousel3DRotation();
  rotateCarousel3D(1);
});

// Toggle auto-rotation
carousel3dToggle.addEventListener('click', () => {
  if (carousel3dIsRotating) {
    stopCarousel3DRotation();
  } else {
    startCarousel3DRotation();
  }
});

// Click to expand photo in lightbox
carousel3dItems.forEach(item => {
  const photo = item.querySelector('.carousel-3d-photo');
  photo.addEventListener('click', (e) => {
    e.stopPropagation();
    const img = photo.querySelector('img');

    const lightbox = document.createElement('div');
    lightbox.className = 'seat-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <img src="${img.src}" alt="Προσκοπική Ανάμνηση">
      </div>
    `;

    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      lightbox.classList.add('closing');
      setTimeout(() => lightbox.remove(), 300);
    };

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    setTimeout(() => lightbox.classList.add('active'), 10);
  });
});

// Initialize carousel
updateCarousel3D();
// Start auto-rotation by default
startCarousel3DRotation();


console.log('✨ Scout Journey website loaded with WOW features!');
console.log('🎁 Easter Egg: Click the logo 3 times quickly for a surprise!');
console.log('📊 Scroll Progress Bar: Active');
console.log('⬆️ Scroll to Top Button: Ready');
console.log('🛩️ Airplane Gallery: Click seats to view photos!');
