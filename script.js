// ===== Вкладки =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === target);
    });
  });
});

// ===== Музыка =====
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
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

const tryPlay = () => {
  const p = music.play();
  if (p !== undefined) {
    p.then(() => {
      toggleBtn.innerText = "🔇";
      toggleBtn.classList.add('playing');
    }).catch(() => {});
  }
};
window.addEventListener('load', tryPlay);
document.addEventListener('DOMContentLoaded', tryPlay);

const unmute = () => {
  if (music.muted) {
    music.muted = false;
    music.play().catch(() => {});
    toggleBtn.innerText = "⏸";
    toggleBtn.classList.add('playing');
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
    toggleBtn.innerText = "⏸";
    toggleBtn.classList.add('playing');
  } else {
    music.pause();
    toggleBtn.innerText = "🎵";
    toggleBtn.classList.remove('playing');
  }
});

// ===== Полноэкранный режим =====
const fsBtn = document.getElementById('fullscreen-toggle');

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

if (fsBtn) {
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
}

const syncFsBtn = () => {
  if (!fsBtn) return;
  if (isFullscreen()) {
    fsBtn.classList.add('active');
    fsBtn.innerText = '⛗';
  } else {
    fsBtn.classList.remove('active');
    fsBtn.innerText = '⛶';
  }
};
document.addEventListener('fullscreenchange', syncFsBtn);
document.addEventListener('webkitfullscreenchange', syncFsBtn);
document.addEventListener('mozfullscreenchange', syncFsBtn);
document.addEventListener('MSFullscreenChange', syncFsBtn);

// ===== Автофуллскрин на телефонах при первом тапе =====
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

// ===== ОПТИМИЗАЦИЯ: пауза видео, когда страница не видна =====
const bgVideo = document.querySelector('.body-vid video');
if (bgVideo) {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      bgVideo.pause();
    } else {
      bgVideo.play().catch(() => {});
    }
  });

  // Пауза при потере фокуса окна (переключение на другое приложение)
  window.addEventListener('blur', () => bgVideo.pause());
  window.addEventListener('focus', () => bgVideo.play().catch(() => {}));
}

// ===== ОПТИМИЗАЦИЯ: пауза музыки, когда страница не видна =====
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // music.pause(); // раскомментируй, если хочешь чтобы музыка вставала
  }
});

// ===== ОПТИМИЗАЦИЯ: ограничение FPS для анимаций на слабых устройствах =====
// (просто подсказка браузеру через CSS will-change уже включена)
