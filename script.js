const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');

// Стартуем сразу
music.volume = 0.6;
music.muted = true; // обход блокировки автоплея

// Пытаемся включить воспроизведение
const tryPlay = () => {
  const p = music.play();
  if (p !== undefined) {
    p.then(() => {
      // Играет (замьючено). Ждём первый клик, чтобы включить звук.
      toggleBtn.innerText = "🔇";
      toggleBtn.classList.add('playing');
    }).catch(() => {
      // Совсем не удалось — попробуем ещё раз после действия пользователя
    });
  }
};

window.addEventListener('load', tryPlay);
document.addEventListener('DOMContentLoaded', tryPlay);

// Первое действие пользователя → включаем звук
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

// Кнопка — вкл/выкл
toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // чтобы не триггерить unmute-логику дважды
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
