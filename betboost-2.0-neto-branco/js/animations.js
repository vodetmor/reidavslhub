/* ============================================================
   ANIMATIONS — BetBoost 2.0 Quiz
   Lightbox, Swiper, micro-animations, background particles
   ============================================================ */

// ─── Lightbox ───
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ─── Swiper Engine ───
function initSwiper(trackId, dotsId) {
  const track = document.getElementById(trackId);
  const dotsContainer = document.getElementById(dotsId);
  if (!track || !dotsContainer) return;

  const container = track.parentElement;
  const slides = track.querySelectorAll('.swiper-slide');
  if (slides.length === 0) return;

  let current = 0;
  let startX = 0;
  let isDragging = false;
  let diff = 0;

  // Build dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'swiper-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  // Build arrows
  const prevBtn = document.createElement('button');
  prevBtn.className = 'swiper-arrow prev';
  prevBtn.innerHTML = '‹';
  prevBtn.setAttribute('aria-label', 'Anterior');
  prevBtn.addEventListener('click', () => goTo(current - 1));

  const nextBtn = document.createElement('button');
  nextBtn.className = 'swiper-arrow next';
  nextBtn.innerHTML = '›';
  nextBtn.setAttribute('aria-label', 'Próximo');
  nextBtn.addEventListener('click', () => goTo(current + 1));

  container.style.position = 'relative';
  container.appendChild(prevBtn);
  container.appendChild(nextBtn);

  function updateArrows() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.swiper-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    updateArrows();
    // Pause all other videos
    slides.forEach((s, i) => {
      if (i !== current) {
        const v = s.querySelector('video');
        if (v) v.pause();
      }
    });
  }

  updateArrows();

  // Touch events
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    diff = e.touches[0].clientX - startX;
    const offset = -(current * 100) + (diff / track.offsetWidth * 100);
    track.style.transform = `translateX(${offset}%)`;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isDragging = false;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    if (Math.abs(diff) > 50) {
      if (diff < 0 && current < slides.length - 1) goTo(current + 1);
      else if (diff > 0 && current > 0) goTo(current - 1);
      else goTo(current);
    } else {
      goTo(current);
    }
    diff = 0;
  });

  // Mouse drag (desktop)
  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    track.style.transition = 'none';
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    diff = e.clientX - startX;
    const offset = -(current * 100) + (diff / track.offsetWidth * 100);
    track.style.transform = `translateX(${offset}%)`;
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    if (Math.abs(diff) > 50) {
      if (diff < 0 && current < slides.length - 1) goTo(current + 1);
      else if (diff > 0 && current > 0) goTo(current - 1);
      else goTo(current);
    } else {
      goTo(current);
    }
    diff = 0;
  });

  return { goTo };
}

// ─── Video Play Overlays ───
function initVideoOverlays() {
  const playSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>`;

  document.querySelectorAll('.video-player').forEach(player => {
    const video = player.querySelector('video');
    if (!video || player.querySelector('.play-overlay')) return;

    // Remove default controls initially
    video.removeAttribute('controls');

    const overlay = document.createElement('div');
    overlay.className = 'play-overlay';
    overlay.innerHTML = `<div class="play-btn">${playSVG}</div>`;
    player.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.classList.add('hidden');
      video.setAttribute('controls', '');
      video.play();
    });

    video.addEventListener('pause', () => {
      if (video.ended || video.currentTime === 0) {
        overlay.classList.remove('hidden');
        video.removeAttribute('controls');
      }
    });

    video.addEventListener('ended', () => {
      overlay.classList.remove('hidden');
      video.removeAttribute('controls');
      video.currentTime = 0;
    });
  });
}

// ─── Build CTA Proof Carousel ───
function buildCtaCarousel() {
  const track = document.getElementById('ctaSwiperTrack');
  if (!track) return;

  const items = [
    { type: 'img', src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.25.jpeg', alt: 'Melhor grupo VIP' },
    { type: 'img', src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.26.jpeg', alt: 'Faturou na Bet365' },
    { type: 'img', src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.26-2.jpeg', alt: 'QualPlacar indispensável' },
    { type: 'img', src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.26-3.jpeg', alt: '26 jogos 23 acertos' },
    { type: 'img', src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.28.jpeg', alt: '3 alavancagens' },
    { type: 'img', src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.28-2.jpeg', alt: 'R$2800 com Lay' },
    { type: 'img', src: 'assets/depoimentos/WhatsApp Image 2026-04-30 at 12.57.28-3.jpeg', alt: '16/16 greens' },
    { type: 'video', src: 'assets/depoimentos/WhatsApp Video 2026-04-30 at 12.57.28.mp4' },
    { type: 'video', src: 'assets/depoimentos/WhatsApp Video 2026-04-30 at 12.57.29.mp4' }
  ];

  track.innerHTML = items.map(item => {
    if (item.type === 'img') {
      return `<div class="swiper-slide">
        <div class="depoimento-thumb" onclick="openLightbox('${item.src}')">
          <img src="${item.src}" alt="${item.alt}" loading="lazy">
        </div>
      </div>`;
    } else {
      return `<div class="swiper-slide">
        <div class="video-player">
          <video controls preload="metadata" playsinline>
            <source src="${item.src}" type="video/mp4">
          </video>
        </div>
      </div>`;
    }
  }).join('');

  initSwiper('ctaSwiperTrack', 'ctaSwiperDots');
}

// ─── Counter Animation ───
function animateCounters() {
  document.querySelectorAll('.metric-value[data-target]').forEach(el => {
    const target = el.dataset.target;
    const isNum = !isNaN(parseFloat(target));
    if (!isNum) { el.textContent = target; return; }

    let current = 0;
    const end = parseFloat(target);
    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(ease * end);
      el.textContent = el.dataset.prefix + current.toLocaleString('pt-BR') + el.dataset.suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ─── Intersection Observer for fade-in animations ───
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.benefit-item, .bonus-card, .metric-card, .video-player, .diagnosis-bullet').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
})();

// ─── Background particles (subtle) ───
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'bgParticles';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:0.4';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((w * h) / 25000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.5 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 250, 157, ${p.a})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

// ─── Custom Audio Player ───
function initCustomAudio() {
  const customAudio = document.getElementById('customAudio');
  if (!customAudio) return;

  const audio = document.getElementById('nativeAudio');
  const playBtn = document.getElementById('audioPlayBtn');
  const iconPlay = playBtn.querySelector('.icon-play');
  const iconPause = playBtn.querySelector('.icon-pause');
  const progressFill = document.getElementById('audioProgressFill');
  const progressBar = document.getElementById('audioProgressBar');
  const currentTimeEl = document.getElementById('audioCurrentTime');
  const durationEl = document.getElementById('audioDuration');

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  if (audio.readyState >= 1) {
    durationEl.textContent = formatTime(audio.duration);
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      iconPlay.style.display = 'none';
      iconPause.style.display = '';
    } else {
      audio.pause();
      iconPlay.style.display = '';
      iconPause.style.display = 'none';
    }
  });

  audio.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
  });

  audio.addEventListener('ended', () => {
    iconPlay.style.display = '';
    iconPause.style.display = 'none';
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
  });

  progressBar.parentElement.addEventListener('click', (e) => {
    const rect = progressBar.parentElement.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (!isNaN(audio.duration)) {
      audio.currentTime = pos * audio.duration;
    }
  });
}

// ─── Init Swipers + Overlays ───
document.addEventListener('DOMContentLoaded', () => {
  initSwiper('swiperTrack', 'swiperDots');
  buildCtaCarousel();
  initCustomAudio();
  // Needs small delay for dynamically built carousel slides
  setTimeout(() => initVideoOverlays(), 100);
});
