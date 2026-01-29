
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
const scrollToTopBtn = document.getElementById('scrollToTop');


navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});


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


const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);


const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => observer.observe(item));


const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
  observer.observe(card);

  setTimeout(() => {
    add3DTilt(card);
  }, index * 100);
});


const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 0.05}s`;
  observer.observe(item);
});


const heroSection = document.querySelector('.hero');

if (heroSection) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // Hero is out of view
        navbar.classList.add('scrolled');
        scrollToTopBtn.classList.add('visible');
      } else {
        // Hero is in view
        navbar.classList.remove('scrolled');
        scrollToTopBtn.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% of hero is still visible

  heroObserver.observe(heroSection);
}


const scrollProgress = document.getElementById('scrollProgress');
let isScrolling = false;

function onScroll() {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      isScrolling = false;
    });
    isScrolling = true;
  }
}

function updateScrollProgress() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const totalScrollable = documentHeight - windowHeight;
  const scrollPercentage = (scrollTop / totalScrollable) * 100;
  scrollProgress.style.width = `${Math.min(scrollPercentage, 100)}%`;
}

window.addEventListener('scroll', onScroll, { passive: true });


document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopCarousel3DRotation();
    console.log('Tab hidden: Pausing animations to save energy 🔋');
  } else {
    // Only resume if it wasn't manually paused
    const carouselToggle = document.getElementById('carousel3dToggle');
    if (carouselToggle && !carouselToggle.classList.contains('paused')) {
      startCarousel3DRotation();
    }
    console.log('Tab active: Resuming animations ⚡');
  }
});


const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');


galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add('active');

  });
});


const projectImages = document.querySelectorAll('.project-image');
projectImages.forEach(img => {
  img.parentElement.addEventListener('click', () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});


const closeLightbox = () => {
  lightbox.classList.remove('active');

};

lightboxClose.addEventListener('click', closeLightbox);


lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});


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

window.addEventListener('scroll', () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      updateActiveLink();
    });
  }
}, { passive: true });


window.addEventListener('load', () => {

  document.body.classList.add('loaded');


  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.style.willChange = 'transform';
    setTimeout(() => {
      card.style.willChange = 'auto';
    }, 1000);
  });
});


const airplaneSeats = document.querySelectorAll('.airplane-seat');

airplaneSeats.forEach(seat => {
  seat.addEventListener('click', () => {
    const seatPhoto = seat.querySelector('.seat-photo');
    const computedStyle = window.getComputedStyle(seatPhoto);
    let bgImage = computedStyle.backgroundImage;

    // Fallback to inline style if computed style is none or invalid
    if (!bgImage || bgImage === 'none') {
      bgImage = seatPhoto.style.backgroundImage;
    }

    if (!bgImage || bgImage === 'none') {
      console.error('No background image found for seat:', seat.dataset.seat);
      return;
    }

    // Robust URL extraction
    let imageUrl = '';
    const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);

    if (urlMatch && urlMatch[1]) {
      imageUrl = urlMatch[1];
    } else {
      // Manual cleanup if regex fails
      imageUrl = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
    }

    console.log('Opening lightbox for seat:', seat.dataset.seat, 'Image:', imageUrl);

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


  // Calculate radius based on item width (500px) and count
  const radius = Math.round((500 / 2) / Math.tan(Math.PI / carousel3dItemCount));

  carousel3dItems.forEach((item, index) => {
    const itemAngle = carousel3dAngleIncrement * index;



    item.style.transform = `
      rotateY(${itemAngle}deg) 
      translateZ(${radius}px)
    `;


    const normalizedAngle = ((itemAngle - carousel3dAngle) % 360 + 360) % 360;


    if (normalizedAngle > 90 && normalizedAngle < 270) {

      item.style.opacity = '1';
      item.style.transform += ' scale(0.85)';
    } else if (normalizedAngle > 45 && normalizedAngle <= 90 || normalizedAngle >= 270 && normalizedAngle < 315) {

      item.style.opacity = '1';
      item.style.transform += ' scale(0.95)';
    } else {

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
  }, 4000);
}

function stopCarousel3DRotation() {
  clearInterval(carousel3dRotationInterval);
  carousel3dRotationInterval = null;
  carousel3dIsRotating = false;
  carousel3dToggle.classList.remove('rotating');
}


carousel3dPrev.addEventListener('click', () => {
  stopCarousel3DRotation();
  rotateCarousel3D(-1);
});

carousel3dNext.addEventListener('click', () => {
  stopCarousel3DRotation();
  rotateCarousel3D(1);
});


carousel3dToggle.addEventListener('click', () => {
  if (carousel3dIsRotating) {
    stopCarousel3DRotation();
  } else {
    startCarousel3DRotation();
  }
});


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


updateCarousel3D();

startCarousel3DRotation();


window.addEventListener('resize', () => {
  updateCarousel3D();
});


const carouselContainer = document.querySelector('.carousel-3d-container');
let touchStartX = 0;
let touchEndX = 0;

carouselContainer.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;

}, { passive: true });

carouselContainer.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50; // Minimum distance for a swipe
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {

      rotateCarousel3D(-1);
    } else {

      rotateCarousel3D(1);
    }
  }
}



const startDate = new Date('2017-10-01T00:00:00');

function updateScoutingCountdown() {
  const now = new Date();


  const diffMs = now - startDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));


  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours();


  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }


  const yearsEl = document.getElementById('years');
  const monthsEl = document.getElementById('months');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');

  if (yearsEl) yearsEl.textContent = years;
  if (monthsEl) monthsEl.textContent = months;
  if (daysEl) daysEl.textContent = days;
  if (hoursEl) hoursEl.textContent = hours;
}


updateScoutingCountdown();
setInterval(updateScoutingCountdown, 1000);


console.log('✨ Scout Journey website loaded with WOW features!');
console.log('🎁 Easter Egg: Click the logo 3 times quickly for a surprise!');
console.log('📊 Scroll Progress Bar: Active');
console.log('⬆️ Scroll to Top Button: Ready');
console.log('🛩️ Airplane Gallery: Click seats to view photos!');
