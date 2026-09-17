// ============================================================
// ФОТО: автопоиск в папке photos/ (pop1.jpg, pop2.png, ...)
// ВИДЕО: список внешних ссылок (YouTube, VK)
// ============================================================

const PHOTO_PREFIX = 'photos/pop';
const PHOTO_EXTS   = ['jpg', 'png', 'jpeg', 'webp'];
const MAX_PHOTO_INDEX    = 200;
const STOP_AFTER_FAILS   = 3;

// ===== ВИДЕО (внешние ссылки) =====
const VIDEOS = [
  { type: 'youtube', id: 'Lqf7GXSJZmU' },
  { type: 'youtube', id: 'MJx8nFw5kGU' },
  { type: 'youtube', id: 'KNmIrhR_Kys' },
  { type: 'youtube', id: '-O4fWJp3Kc4' },
  { type: 'youtube', id: 'UHt1cxzsawU' },
  { type: 'vk', url: 'https://vkvideo.ru/video1038426307_456239017?list=ln-c84hNvLutGv2P9LpWo' },
];

// ===== ВОПРОС-ПРОВЕРКА =====
const SECRET_ANSWER = 'спокойствие';
const PROMO_KEY = 'promo_unlocked';

// ===== Вкладки =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

const activateTab = (target) => {
  tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === target));
  tabPanes.forEach(pane => pane.classList.toggle('active', pane.id === target));
};

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// ===== ГАЛЕРЕЯ =====
const galleryPhotos = document.getElementById('gallery-photos');
const galleryVideos = document.getElementById('gallery-videos');
const photosEmpty = document.getElementById('photos-empty');
const videosEmpty = document.getElementById('videos-empty');
const galleryTabBtn = document.getElementById('gallery-tab-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxIframe = document.getElementById('lightbox-iframe');

// --- Проверка одного фото-URL ---
const probeImage = (src) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => resolve(src);
  img.onerror = () => resolve(null);
  img.src = src;
});

// --- Поиск одного файла по номеру ---
const findFile = async (prefix, index, exts, probe) => {
  for (const ext of exts) {
    const src = `${prefix}${index}.${ext}`;
    const found = await probe(src);
    if (found) return found;
  }
  return null;
};

// --- Полный проход по номерам для фото ---
const scanPhotos = async () => {
  const results = [];
  let fails = 0;

  for (let i = 1; i <= MAX_PHOTO_INDEX; i++) {
    const src = await findFile(PHOTO_PREFIX, i, PHOTO_EXTS, probeImage);
    if (src) {
      results.push(src);
      fails = 0;
    } else {
      fails++;
      if (fails >= STOP_AFTER_FAILS) break;
    }
  }
  return results;
};

// --- Рендер фото ---
const renderPhotos = (list) => {
  galleryPhotos.innerHTML = '';
  if (!list.length) {
    if (photosEmpty) photosEmpty.style.display = 'block';
    return;
  }
  if (photosEmpty) photosEmpty.style.display = 'none';
  list.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('click', () => openLightbox(src, 'image'));
    galleryPhotos.appendChild(img);
  });
};

// --- Рендер видео ---
const renderVideos = (list) => {
  galleryVideos.innerHTML = '';
  if (!list.length) {
    if (videosEmpty) videosEmpty.style.display = 'block';
    return;
  }
  if (videosEmpty) videosEmpty.style.display = 'none';

  list.forEach(item => {
    const wrap = document.createElement('div');
    wrap.className = 'gallery-item video-item';

    let thumbUrl = '';
    if (item.type === 'youtube') {
      thumbUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    } else {
      // VK: используем заглушку (можно заменить на своё превью)
      thumbUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="100%" height="100%" fill="%23141414"/><text x="50%" y="50%" font-size="24" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">VK Video</text></svg>';
    }

    const img = document.createElement('img');
    img.src = thumbUrl;
    img.alt = '';
    img.loading = 'lazy';
    img.style.objectFit = 'cover';

    const playIcon = document.createElement('span');
    playIcon.className = 'play-badge';
    playIcon.innerText = '▶';

    wrap.appendChild(img);
    wrap.appendChild(playIcon);

    wrap.addEventListener('click', () => {
      if (item.type === 'youtube') {
        openLightbox(item.id, 'youtube');
      } else {
        // VK открываем в новой вкладке
        window.open(item.url, '_blank');
      }
    });

    galleryVideos.appendChild(wrap);
  });
};

// --- Автопоиск фото + рендер видео ---
const buildGallery = async () => {
  if (!galleryPhotos || !galleryVideos) return;
  galleryPhotos.innerHTML = '<p class="page-text dim">// ищу фото...</p>';
  galleryVideos.innerHTML = '<p class="page-text dim">// загружаю видео...</p>';

  const photos = await scanPhotos();
  renderPhotos(photos);
  renderVideos(VIDEOS);
};

// --- Лайтбокс ---
const openLightbox = (src, type) => {
  // Скрываем всё
  lightboxImg.style.display = 'none';
  lightboxVideo.style.display = 'none';
  if (lightboxIframe) lightboxIframe.style.display = 'none';

  lightboxImg.src = '';
  lightboxVideo.pause();
  lightboxVideo.src = '';
  if (lightboxIframe) lightboxIframe.src = '';

  if (type === 'image') {
    lightboxImg.style.display = 'block';
    lightboxImg.src = src;
  } else if (type === 'youtube') {
    lightboxIframe.style.display = 'block';
    lightboxIframe.src = `https://www.youtube.com/embed/${src}?autoplay=1`;
  }

  lightbox.classList.add('open');
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
  lightboxVideo.pause();
  lightboxVideo.src = '';
  if (lightboxIframe) lightboxIframe.src = '';
};

const unlockGallery = () => {
  if (galleryTabBtn) galleryTabBtn.style.display = '';
  buildGallery();
};

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// ===== Под-вкладки Фото / Видео =====
const subTabBtns = document.querySelectorAll('.sub-tab-btn');
const subPanes = document.querySelectorAll('.sub-pane');

subTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.sub;
    subTabBtns.forEach(b => b.classList.toggle('active', b === btn));
    subPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === 'sub-' + target);
    });
  });
});

// ===== ВОПРОС-ПРОВЕРКА =====
const promoInput = document.getElementById('promo-input');
const promoBtn = document.getElementById('promo-btn');
const promoMsg = document.getElementById('promo-msg');

const checkPromo = () => {
  const value = (promoInput.value || '').trim().toLowerCase();
  if (value === SECRET_ANSWER) {
    promoMsg.innerText = '✓ Верно. Галерея разблокирована.';
    promoMsg.className = 'promo-msg ok';
    localStorage.setItem(PROMO_KEY, '1');
    unlockGallery();
    setTimeout(() => activateTab('gallery'), 500);
  } else {
    promoMsg.innerText = '✗ Неверно';
    promoMsg.className = 'promo-msg err';
    setTimeout(() => {
      promoMsg.innerText = '';
      promoMsg.className = 'promo-msg';
    }, 2500);
  }
};

if (promoBtn) promoBtn.addEventListener('click', checkPromo);
if (promoInput) {
  promoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPromo();
  });
}

if (localStorage.getItem(PROMO_KEY) === '1') {
  unlockGallery();
}

// ===== Музыка =====
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const toggleIcon = toggleBtn.querySelector('.settings-icon');
const toggleState = document.getElementById('music-state');
const hint = document.getElementById('neon-hint');

const hideHint = () => {
  if (hint && !hint.classList.contains('hidden')) {
    hint.classList.add('hidden');
    setTimeout(() => hint.remove(), 500);
  }
};
if (hint) hint.addEventListener('click', hideHint);

music.volume = 0.6;
music.muted = true;

const updateMusicUI = () => {
  if (music.paused) {
    toggleIcon.innerText = '🎵';
    if (toggleState) toggleState.innerText = 'Выключена';
    toggleBtn.classList.remove('playing');
  } else if (music.muted) {
    toggleIcon.innerText = '🔇';
    if (toggleState) toggleState.innerText = 'Без звука';
    toggleBtn.classList.add('playing');
  } else {
    toggleIcon.innerText = '⏸';
    if (toggleState) toggleState.innerText = 'Играет';
    toggleBtn.classList.add('playing');
  }
};

const tryPlay = () => {
  const p = music.play();
  if (p !== undefined) p.then(() => updateMusicUI()).catch(() => {});
};
window.addEventListener('load', tryPlay);
document.addEventListener('DOMContentLoaded', tryPlay);

const unmute = () => {
  if (music.muted) {
    music.muted = false;
    music.play().catch(() => {});
    updateMusicUI();
  }
  document.removeEventListener('click', unmute);
  document.removeEventListener('touchstart', unmute);
  document.removeEventListener('keydown', unmute);
  document.removeEventListener('scroll', unmute);
};
document.addEventListener('click', unmute);
document.addEventListener('touchstart', unmute);
document.addEventListener('keydown', unmute);
document.addEventListener('scroll', unmute);

toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  hideHint();
  if (music.paused) {
    music.muted = false;
    music.play().catch(() => {});
  } else {
    music.pause();
  }
  updateMusicUI();
});

// ===== Полный экран =====
const fsBtn = document.getElementById('fullscreen-toggle');
const fsIcon = fsBtn.querySelector('.settings-icon');
const fsState = document.getElementById('fs-state');

const isFullscreen = () =>
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement;

const requestFs = (el) => {
  if (el.requestFullscreen) return el.requestFullscreen({ navigationUI: 'hide' });
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
  if (el.msRequestFullscreen) return el.msRequestFullscreen();
};

const exitFs = () => {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
  if (document.msExitFullscreen) return document.msExitFullscreen();
};

fsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  hideHint();
  if (!isFullscreen()) {
    const p = requestFs(document.documentElement);
    if (p && p.catch) p.catch(() => {});
  } else {
    exitFs();
  }
});

const syncFsBtn = () => {
  if (isFullscreen()) {
    fsIcon.innerText = '⛗';
    if (fsState) fsState.innerText = 'Включён';
    fsBtn.classList.add('active');
  } else {
    fsIcon.innerText = '⛶';
    if (fsState) fsState.innerText = 'Выключен';
    fsBtn.classList.remove('active');
  }
};
document.addEventListener('fullscreenchange', syncFsBtn);
document.addEventListener('webkitfullscreenchange', syncFsBtn);
document.addEventListener('mozfullscreenchange', syncFsBtn);
document.addEventListener('MSFullscreenChange', syncFsBtn);
syncFsBtn();

// ===== Автофуллскрин на телефонах =====
const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

if (isMobile) {
  const autoFs = () => {
    if (!isFullscreen()) {
      const p = requestFs(document.documentElement);
      if (p && p.catch) p.catch(() => {});
    }
    document.removeEventListener('touchstart', autoFs);
    document.removeEventListener('click', autoFs);
  };
  document.addEventListener('touchstart', autoFs, { once: true, passive: true });
  document.addEventListener('click', autoFs, { once: true });
}

// ===== Оптимизация: пауза видео, когда страница не видна =====
const bgVideo = document.querySelector('.body-vid video');
if (bgVideo) {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) bgVideo.pause();
    else bgVideo.play().catch(() => {});
  });
  window.addEventListener('blur', () => bgVideo.pause());
  window.addEventListener('focus', () => bgVideo.play().catch(() => {}));
}
