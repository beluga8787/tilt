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

// Обновление вида кнопки музыки в настройках
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
  if (p !== undefined) {
    p.then(() => updateMusicUI()).catch(() => {});
  }
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

// ===== Полноэкранный режим =====
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
  window.addEventListener('blur', () => bgVideo.pause());
  window.addEventListener('focus', () => bgVideo.play().catch(() => {}));
}
