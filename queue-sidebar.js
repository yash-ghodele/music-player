// Queue Sidebar Functionality for Expanded Player

function updateNextUpQueue() {
    const container = document.getElementById('next-up-list');
    if (!container) return;

    const currentIndex = appState.currentSongIndex;
    const nextSongs = appState.playlist.slice(currentIndex + 1, currentIndex + 6);

    if (nextSongs.length === 0) {
        container.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem 0;">No more songs in queue</p>';
        return;
    }

    container.innerHTML = nextSongs.map(song => `
    <div class="queue-item" onclick="playSongById('${song.id}')" data-song-id="${song.id}">
      <img src="${song.cover}" alt="${song.title}">
      <div class="queue-item-info">
        <div class="queue-item-title">${song.title}</div>
        <div class="queue-item-artist">${song.artist}</div>
      </div>
    </div>
  `).join('');
}

function playSongById(songId) {
    const songIndex = appState.playlist.findIndex(s => s.id === songId);
    if (songIndex !== -1) {
        appState.currentSongIndex = songIndex;
        loadSong(songIndex);
        playAudio();
        updateNextUpQueue();
    }
}

// Hook into existing loadSong function
if (typeof window.loadSong !== 'undefined') {
    const originalLoadSong = window.loadSong;
    window.loadSong = function (index) {
        originalLoadSong(index);
        setTimeout(() => updateNextUpQueue(), 100);
    };
}

// Initialize queue on page load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => updateNextUpQueue(), 1000);
});
