const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const hint = document.getElementById('neon-hint');

// --- Скрыть "нажми" при первом взаимодействии ---
const hideHint = () => {
  if (hint && !hint.classList.contains('hidden')) {
    hint.classList.add('hidden');
    setTimeout(() => hint.remove(), 500);
  }
};
if (hint) hint.addEventListener('click', hideHint);

// --- Автозапуск (замьючено) + анмьют по первому действию ---
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

// --- Кнопка музыки ---
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
