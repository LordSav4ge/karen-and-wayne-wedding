// ========================================
// Karen & Wayne — Wedding Website Scripts
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation scroll behavior ---
  const nav = document.getElementById('nav');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // --- Countdown Timer ---
  const weddingDate = new Date('2026-08-22T15:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      document.getElementById('days').textContent = '0';
      document.getElementById('hours').textContent = '0';
      document.getElementById('minutes').textContent = '0';
      document.getElementById('seconds').textContent = '0';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- Scroll animations ---
  const animatedElements = document.querySelectorAll(
    '.story-block, .detail-card, .venue-block, .gallery-item, .registry-content, .rsvp-form, .countdown-section .container, .photo-break-content'
  );

  animatedElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));

  // --- RSVP Form ---
  const rsvpForm = document.getElementById('rsvpForm');
  const attendingDetails = document.getElementById('attendingDetails');
  const rsvpConfirmation = document.getElementById('rsvpConfirmation');
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  const guestsSelect = document.getElementById('guests');
  const guestNamesSection = document.getElementById('guestNamesSection');
  const guestNameInputs = document.getElementById('guestNameInputs');

  // Show/hide guest details based on attendance
  attendingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'yes') {
        attendingDetails.style.display = 'block';
      } else {
        attendingDetails.style.display = 'none';
        guestNamesSection.style.display = 'none';
        guestNameInputs.innerHTML = '';
        guestsSelect.value = '';
      }
    });
  });

  // Dynamic guest name inputs
  guestsSelect.addEventListener('change', () => {
    const count = parseInt(guestsSelect.value);
    if (count > 0) {
      guestNamesSection.style.display = 'block';
      guestNameInputs.innerHTML = '';

      for (let i = 1; i <= count; i++) {
        const row = document.createElement('div');
        row.className = 'guest-name-row';
        row.innerHTML = `
          <span>${i}</span>
          <input type="text" name="guest_${i}" placeholder="Full name of guest ${i}" required>
        `;
        guestNameInputs.appendChild(row);
      }
    }
  });

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather form data
    const formData = new FormData(rsvpForm);
    const data = {};
    data.familyName = formData.get('familyName');
    data.email = formData.get('email');
    data.attending = formData.get('attending');

    if (data.attending === 'yes') {
      data.numberOfGuests = formData.get('guests');
      data.dietary = formData.get('dietary');
      data.guestNames = [];
      const count = parseInt(data.numberOfGuests) || 0;
      for (let i = 1; i <= count; i++) {
        const name = formData.get(`guest_${i}`);
        if (name) data.guestNames.push(name);
      }
    }

    data.message = formData.get('message');
    data.timestamp = new Date().toISOString();

    // Store in localStorage as a simple demo backend
    const rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
    rsvps.push(data);
    localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));

    // Show confirmation
    rsvpForm.style.display = 'none';
    rsvpConfirmation.style.display = 'block';

    // Scroll to confirmation
    rsvpConfirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // --- Photo Gallery Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  let currentImageIndex = 0;

  const galleryImages = Array.from(galleryItems).map(img => img.src);

  function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = galleryImages[currentImageIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex];
  }

  function showNext() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex];
  }

  galleryItems.forEach((img, index) => {
    img.parentElement.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 60;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
