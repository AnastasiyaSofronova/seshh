document.addEventListener('DOMContentLoaded', () => {
  // ===== NAV =====
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===== HORIZONTAL GALLERY =====
  const track = document.getElementById('hTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentTranslate = 0;
  const step = 340; // approximate item width + gap

  function updateTrack() {
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  nextBtn.addEventListener('click', () => {
    const max = -(track.scrollWidth - track.parentElement.offsetWidth + 40);
    currentTranslate = Math.max(currentTranslate - step, max);
    updateTrack();
  });

  prevBtn.addEventListener('click', () => {
    currentTranslate = Math.min(currentTranslate + step, 0);
    updateTrack();
  });

  // Drag to scroll
  let isDown = false;
  let startX;
  let scrollLeft;

  const wrapper = track.parentElement;
  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - currentTranslate;
    wrapper.style.cursor = 'grabbing';
  });
  wrapper.addEventListener('mouseleave', () => { isDown = false; });
  wrapper.addEventListener('mouseup', () => {
    isDown = false;
    wrapper.style.cursor = 'grab';
  });
  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX;
    currentTranslate = x - startX;
    const max = -(track.scrollWidth - wrapper.offsetWidth + 40);
    currentTranslate = Math.min(0, Math.max(currentTranslate, max));
    updateTrack();
  });

  // Touch support
  let touchStartX = 0;
  wrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX - currentTranslate;
  }, { passive: true });
  wrapper.addEventListener('touchmove', (e) => {
    const x = e.touches[0].clientX;
    currentTranslate = x - touchStartX;
    const max = -(track.scrollWidth - wrapper.offsetWidth + 40);
    currentTranslate = Math.min(0, Math.max(currentTranslate, max));
    updateTrack();
  }, { passive: true });

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const allImages = [...document.querySelectorAll('.h-item img, .grid-item img')];
  let lbIndex = 0;

  function openLb(index) {
    lbIndex = index;
    lbImg.src = allImages[lbIndex].src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function lbPrev() {
    lbIndex = (lbIndex - 1 + allImages.length) % allImages.length;
    lbImg.src = allImages[lbIndex].src;
  }
  function lbNext() {
    lbIndex = (lbIndex + 1) % allImages.length;
    lbImg.src = allImages[lbIndex].src;
  }

  allImages.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => openLb(i));
  });

  document.querySelector('.lb-close').addEventListener('click', (e) => { e.stopPropagation(); closeLb(); });
  document.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); lbPrev(); });
  document.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); lbNext(); });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  });
});
