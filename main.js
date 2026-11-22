document.addEventListener('DOMContentLoaded', () => {
  // ===== NAV =====
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
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
  const wrapper = track.parentElement;
  let currentTranslate = 0;

  function getStep() {
    const item = track.querySelector('.h-item');
    return item ? item.offsetWidth + 14 : 300;
  }

  function getMax() {
    return -(track.scrollWidth - wrapper.offsetWidth + 20);
  }

  function updateTrack(animate = true) {
    track.style.transition = animate ? 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  nextBtn.addEventListener('click', () => {
    currentTranslate = Math.max(currentTranslate - getStep(), getMax());
    updateTrack();
  });

  prevBtn.addEventListener('click', () => {
    currentTranslate = Math.min(currentTranslate + getStep(), 0);
    updateTrack();
  });

  // Mouse drag
  let isDown = false;
  let startX = 0;
  let startTranslate = 0;

  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX;
    startTranslate = currentTranslate;
    wrapper.style.cursor = 'grabbing';
    updateTrack(false);
  });
  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    wrapper.style.cursor = 'grab';
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    currentTranslate = Math.min(0, Math.max(startTranslate + dx, getMax()));
    updateTrack(false);
  });

  // Touch
  let touchStartX = 0;
  let touchStartTranslate = 0;

  wrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartTranslate = currentTranslate;
    updateTrack(false);
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    const dx = e.touches[0].clientX - touchStartX;
    currentTranslate = Math.min(0, Math.max(touchStartTranslate + dx, getMax()));
    updateTrack(false);
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
    img.closest('.h-item, .grid-item').addEventListener('click', () => openLb(i));
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
