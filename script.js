const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');

toggleBtn.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    toggleBtn.innerText = "⏸";
    toggleBtn.classList.add('playing');
  } else {
    music.pause();
    toggleBtn.innerText = "🎵";
    toggleBtn.classList.remove('playing');
  }
});