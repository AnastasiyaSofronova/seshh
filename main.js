document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const header = document.getElementById('header');

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => {
    return item.querySelector('img').src;
  });

  // Open lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      openLightbox(images[currentIndex]);
    });
  });

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = images[currentIndex];
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = images[currentIndex];
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  // Events
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Header on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (currentScroll > 200) {
      if (currentScroll > lastScroll + 10) {
        header.style.transform = 'translateY(-100%)';
      } else if (currentScroll < lastScroll - 10) {
        header.style.transform = 'translateY(0)';
      }
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Smooth image load
  document.querySelectorAll('.gallery-item img').forEach(img => {
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });
});
