/**
 * ====================================================================
 * NEON BEATS - MAIN APPLICATION SCRIPT
 * ====================================================================
 * This script handles the core functionality of the music player,
 * including state management, audio playback, UI rendering,
 * and event handling.
 */

// ==========================================
// 1. APPLICATION STATE
// ==========================================
// Central store for the app's dynamic data.
// - playlist: The array of songs currently available to play
// - currentSongIndex: Index of the currently playing song
// - isPlaying: Boolean status of playback
// - volume: Current volume level (0.0 to 1.0)
// - favorites: Array of song IDs marked as favorite
const appState = {
  currentSongIndex: 0,
  isPlaying: false,
  isShuffled: false,
  repeatMode: 'none', // Options: 'none', 'one', 'all'
  volume: 0.7,
  playlist: [],       // Current playlist (can be shuffled)
  originalPlaylist: [], // Backup of original order for un-shuffle
  queue: [],
  favorites: [],
  view: 'grid',       // 'grid' or 'list' display mode
  filter: 'all',      // Current category filter
  searchQuery: '',    // Current search term
  audioContext: null, // Web Audio API context
  analyser: null,     // Audio analyser node for visualizer
  visualizerActive: false
};

// ==========================================
// 2. SONG DATA
// ==========================================
// Hardcoded catalog of songs. In a details app, this would come from an API.
const songs = [
  {
    id: 's1',
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    cover: "assets/images/MidnightCity.jpg",
    sources: ['assets/audio/sample.mp3'], // Placeholder audio
    duration: "4:03",
    category: ["popular", "electronic", "favorites"],
    price: 1.29
  },
  {
    id: 's2',
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "assets/images/BlindingLights.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:20",
    category: ["popular", "pop"],
    price: 1.29
  },
  {
    id: 's3',
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover: "assets/images/MidnightCity.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:45",
    category: ["popular", "pop"],
    price: 1.29
  },
  {
    id: 's4',
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "assets/images/SaveYourTears.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:35",
    category: ["popular", "pop"],
    price: 1.29
  },
  {
    id: 's5',
    title: "Stay",
    artist: "The Kid LAROI",
    album: "F*CK LOVE 3: OVER YOU",
    cover: "assets/images/HeatWaves.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "2:21",
    category: ["new", "pop"],
    price: 1.29
  },
  {
    id: 's6',
    title: "Bad Habit",
    artist: "Steve Lacy",
    album: "Gemini Rights",
    cover: "assets/images/BlindingLights.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:52",
    category: ["popular", "rock"],
    price: 1.29
  },
  {
    id: 's7',
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    cover: "assets/images/HeatWaves.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:58",
    category: ["popular", "electronic"],
    price: 1.29
  },
  {
    id: 's8',
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    cover: "assets/images/SaveYourTears.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "2:47",
    category: ["new", "pop"],
    price: 1.29
  },
  {
    id: 's9',
    title: "Running Up That Hill",
    artist: "Kate Bush",
    album: "Hounds of Love",
    cover: "assets/images/MidnightCity.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "4:58",
    category: ["popular", "rock"],
    price: 0.99
  },
  {
    id: 's10',
    title: "Glimpse of Us",
    artist: "Joji",
    album: "SMITHEREENS",
    cover: "assets/images/BlindingLights.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:53",
    category: ["new", "pop"],
    price: 1.29
  },
  {
    id: 's11',
    title: "Break My Soul",
    artist: "Beyoncé",
    album: "RENAISSANCE",
    cover: "assets/images/HeatWaves.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "4:38",
    category: ["new", "pop"],
    price: 1.29
  },
  {
    id: 's12',
    title: "About Damn Time",
    artist: "Lizzo",
    album: "Special",
    cover: "assets/images/SaveYourTears.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:11",
    category: ["new", "pop"],
    price: 1.29
  }
];

// ==========================================
// 3. INITIALIZATION
// ==========================================
// Main entry point when the DOM is ready.
// Sets up state, renders initial UI, and attaches listeners.
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Attempt to load saved favorites from localStorage for persistence
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        appState.favorites = JSON.parse(savedFavorites);
      }
    } catch (e) {
      console.warn('Failed to load saved state:', e);
    }

    // Initialize playlist state with song data
    appState.playlist = [...songs];
    appState.originalPlaylist = [...songs];

    // Initial Render of UI components
    renderSongs();
    updateVolumeUI();

    // Prepare audio player with first song (does not auto-play)
    loadSong(appState.currentSongIndex);

    // Attach all event handlers
    setupPlayerListeners();
    setupAdvancedListeners(); // Initializing advanced features

  } catch (err) {
    console.error('Critical initialization error:', err);
    // Gracefull fallback for errors
    setTimeout(() => {
      if (typeof showNotification === 'function') {
        showNotification('Error starting app: ' + err.message, 'error');
      } else {
        alert('Error starting app: ' + err.message);
      }
    }, 1000);
  } finally {
    // Hide loading screen once execution is done
    setTimeout(() => {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
      }
    }, 100);
  }
});

// ==========================================
// 4. RENDERING LOGIC
// ==========================================

/**
 * Renders the song list into the DOM based on current filters.
 * Supports filtering by category and search query.
 */
function renderSongs() {
  const container = document.getElementById('songs-container');
  container.className = `songs-container ${appState.view}-view`;
  container.innerHTML = '';

  // Filter the playlist based on appState criteria
  const filteredSongs = appState.playlist.filter(song => {
    const categoryMatch = appState.filter === 'all' ||
      (appState.filter === 'favorites' && appState.favorites.includes(song.id)) ||
      song.category.includes(appState.filter);

    const searchMatch = !appState.searchQuery ||
      song.title.toLowerCase().includes(appState.searchQuery) ||
      song.artist.toLowerCase().includes(appState.searchQuery) ||
      song.album.toLowerCase().includes(appState.searchQuery);

    return categoryMatch && searchMatch;
  });

  // Empty state handling
  if (filteredSongs.length === 0) {
    container.innerHTML = `<div class="empty-state">No songs found matching your criteria.</div>`;
    return;
  }

  // Generate HTML for each song card
  filteredSongs.forEach((song, index) => {
    const isActive = appState.playlist[appState.currentSongIndex].id === song.id;
    const isFavorite = appState.favorites.includes(song.id);
    const absoluteIndex = appState.playlist.findIndex(s => s.id === song.id);

    const card = document.createElement('div');
    card.className = `song-card ${isActive ? 'active' : ''}`;

    // Staggered fade-in animation
    card.style.opacity = '0';
    card.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.05}s`;

    card.innerHTML = `
      <div class="song-image-container">
        <img loading="lazy" src="${song.cover}" alt="${song.title}" class="song-image">
        <div class="play-overlay">
          <i class="ri-play-fill" style="font-size: 2rem; color: white;"></i>
        </div>
      </div>
      <div class="song-info">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
      </div>
      <div class="song-actions">
        <span class="song-duration">${song.duration}</span>
        <button class="btn-icon-sm ${isFavorite ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${song.id}')">
          <i class="${isFavorite ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
        </button>
      </div>
    `;

    // Play song on card click
    card.onclick = () => playSongAtIndex(absoluteIndex);
    container.appendChild(card);
  });
}

// ==========================================
// 5. AUDIO PLAYER LOGIC
// ==========================================
const audio = document.getElementById('audio-player');

/**
 * Loads a song into the audio player without playing.
 * @param {number} index - Index of the song in the playlist
 */
function loadSong(index) {
  if (index < 0 || index >= appState.playlist.length) return;

  const song = appState.playlist[index];
  audio.src = song.sources[0];
  audio.load();

  // Update Main Player UI
  document.getElementById('player-title').textContent = song.title;
  document.getElementById('player-artist').textContent = song.artist;
  document.getElementById('player-cover').src = song.cover;

  // Update Expanded Player UI
  updateExpandedPlayerUI();

  // Update Queue UI
  renderQueue();
  updateNextUpQueue();

  // Highlight active song in list
  renderSongs();

  // Update Background Album Art
  updateAlbumBackground(song.cover);
}

/**
 * Starts audio playback and handles potential promise errors
 */
function playAudio() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      appState.isPlaying = true;
      updatePlayButton();
      updatePlayingAnimation();
    }).catch(error => {
      console.error("Playback failed:", error);
      showNotification('Playback Error: ' + error.message, 'error');
    });
  }
}

/**
 * Pauses audio playback
 */
function pauseAudio() {
  audio.pause();
  appState.isPlaying = false;
  updatePlayButton();
  updatePlayingAnimation();
}

/**
 * Toggles between play and pause states
 */
function togglePlay() {
  if (appState.isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

/**
 * Plays a specific song by its index
 */
function playSongAtIndex(index) {
  appState.currentSongIndex = index;
  loadSong(index);
  playAudio();
}

/**
 * Plays a song by its ID. Used in queue clicks.
 */
function playSongById(id) {
  const index = appState.playlist.findIndex(s => s.id === id);
  if (index !== -1) playSongAtIndex(index);
}

/**
 * Advances to the next song. Handles repeat modes and end of playlist.
 */
function nextSong() {
  if (appState.repeatMode === 'one') {
    // If repeat one, just seek to start
    audio.currentTime = 0;
    playAudio();
    return;
  }

  // Calculate next index looping back to 0
  appState.currentSongIndex = (appState.currentSongIndex + 1) % appState.playlist.length;
  loadSong(appState.currentSongIndex);
  if (appState.isPlaying) playAudio();
}

/**
 * Goes back to the previous song or restarts current song
 */
function prevSong() {
  // If > 3 seconds in, restart song
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  // Calculate previous index looping to end
  appState.currentSongIndex = (appState.currentSongIndex - 1 + appState.playlist.length) % appState.playlist.length;
  loadSong(appState.currentSongIndex);
  if (appState.isPlaying) playAudio();
}

/**
 * Toggles shuffle mode. Randomizes playlist or restores order.
 */
function toggleShuffle() {
  appState.isShuffled = !appState.isShuffled;
  const btn = document.getElementById('shuffle-btn');

  if (appState.isShuffled) {
    btn.classList.add('active');
    // Shuffle: Create random order but keep current song first
    const currentSong = appState.playlist[appState.currentSongIndex];
    const remaining = appState.playlist.filter(s => s.id !== currentSong.id);
    // Fisher-Yates shuffle
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    appState.playlist = [currentSong, ...remaining];
    appState.currentSongIndex = 0;
    showNotification('Shuffle On', 'info');
  } else {
    btn.classList.remove('active');
    // Restore original order
    const currentSong = appState.playlist[appState.currentSongIndex];
    appState.playlist = [...appState.originalPlaylist];
    appState.currentSongIndex = appState.playlist.findIndex(s => s.id === currentSong.id);
    showNotification('Shuffle Off', 'info');
  }

  renderQueue(); // Update queue display
}

/**
 * Toggles repeat mode: none -> all -> one -> none
 */
function toggleRepeat() {
  const btn = document.getElementById('repeat-btn');
  const icon = btn.querySelector('i');

  if (appState.repeatMode === 'none') {
    appState.repeatMode = 'all';
    btn.classList.add('active');
    showNotification('Repeat All', 'info');
  } else if (appState.repeatMode === 'all') {
    appState.repeatMode = 'one';
    icon.className = 'ri-repeat-one-line';
    showNotification('Repeat One', 'info');
  } else {
    appState.repeatMode = 'none';
    btn.classList.remove('active');
    icon.className = 'ri-repeat-line';
    showNotification('Repeat Off', 'info');
  }
}

// ==========================================
// 6. UI HELPERS & UTILITIES
// ==========================================

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updatePlayButton() {
  const btns = [document.getElementById('play-btn'), document.getElementById('expanded-play-btn')]; // Also update expanded button
  btns.forEach(btn => {
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (appState.isPlaying) {
      icon.className = 'ri-pause-fill';
    } else {
      icon.className = 'ri-play-fill';
    }
  });
}

function updateVolumeUI() {
  const slider = document.getElementById('volume-slider');
  const volumeBtn = document.getElementById('volume-btn');
  if (slider) slider.value = appState.volume * 100;

  // Change volume icon based on level
  if (volumeBtn) {
    const icon = volumeBtn.querySelector('i');
    if (appState.volume === 0) icon.className = 'ri-volume-mute-line';
    else if (appState.volume < 0.5) icon.className = 'ri-volume-down-line';
    else icon.className = 'ri-volume-up-line';
  }
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function toggleFavorite(songId) {
  const index = appState.favorites.indexOf(songId);
  if (index === -1) {
    appState.favorites.push(songId);
    showNotification('Added to Favorites', 'success');
  } else {
    appState.favorites.splice(index, 1);
    showNotification('Removed from Favorites', 'info');
  }

  localStorage.setItem('favorites', JSON.stringify(appState.favorites));
  renderSongs();

  // Update heart button color if current song
  const currentSong = appState.playlist[appState.currentSongIndex];
  if (currentSong.id === songId) {
    const btn = document.getElementById('favorite-btn');
    const isFav = appState.favorites.includes(songId);
    if (btn) btn.querySelector('i').className = isFav ? 'ri-heart-fill' : 'ri-heart-line';
    if (btn) btn.classList.toggle('active', isFav);
  }
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================

function setupPlayerListeners() {
  // Playback Control Buttons
  document.getElementById('play-btn').addEventListener('click', togglePlay);
  document.getElementById('prev-btn').addEventListener('click', prevSong);
  document.getElementById('next-btn').addEventListener('click', nextSong);
  document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
  document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);

  // Expanded Player Interaction
  const cover = document.getElementById('player-cover');
  if (cover) {
    cover.style.cursor = 'pointer';
    cover.addEventListener('click', toggleExpandedPlayer);
  }

  // Volume Control
  const volumeSlider = document.getElementById('volume-slider');
  volumeSlider.addEventListener('input', (e) => {
    appState.volume = e.target.value / 100;
    audio.volume = appState.volume;
    updateVolumeUI();
  });

  // HTML5 Audio Events
  audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;

    // Update Progress Bars (Main & Expanded)
    document.getElementById('progress-fill').style.width = `${progressPercent}%`;
    document.getElementById('time-current').textContent = formatTime(currentTime);
    document.getElementById('time-total').textContent = formatTime(duration || 0);
  });

  audio.addEventListener('ended', nextSong);

  // Progress Bar Seek
  document.getElementById('progress-bar').addEventListener('click', function (e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
  });

  // Search Input Debounce
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value.toLowerCase();
    renderSongs();
  });

  // Filter Tabs
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      appState.filter = tab.dataset.category;
      renderSongs();
    });
  });

  // Queue & Visualizer Toggles
  document.getElementById('queue-btn').addEventListener('click', () => {
    document.getElementById('queue-panel').classList.add('active');
    renderQueue();
  });
  document.getElementById('close-queue').addEventListener('click', () => {
    document.getElementById('queue-panel').classList.remove('active');
  });
}

function renderQueue() {
  const list = document.getElementById('queue-list');
  const nextSongs = appState.playlist.slice(appState.currentSongIndex + 1, appState.currentSongIndex + 6);

  if (nextSongs.length === 0) {
    list.innerHTML = '<p style="padding:1rem; text-align:center; color:#666;">End of playlist</p>';
    return;
  }

  list.innerHTML = nextSongs.map(song => `
    <div class="queue-item" onclick="playSongById('${song.id}')">
      <img src="${song.cover}" alt="${song.title}">
      <div>
        <div class="queue-item-title">${song.title}</div>
        <div class="queue-item-artist">${song.artist}</div>
      </div>
    </div>
  `).join('');

  // Update Current Song in Queue
  const current = appState.playlist[appState.currentSongIndex];
  const currentContainer = document.getElementById('queue-current');
  if (currentContainer) {
    currentContainer.innerHTML = `
      <div class="queue-item active">
        <img src="${current.cover}" alt="${current.title}">
        <div>
          <div class="queue-item-title">${current.title}</div>
          <div class="queue-item-artist">${current.artist}</div>
        </div>
      </div>
    `;
  }
}

// ==========================================
// 8. AUDIO VISUALIZER ENGINE
// ==========================================

/**
 * Updates the 'Up Next' queue list in the Expanded Player sidebar
 */
function updateNextUpQueue() {
  const container = document.getElementById('ep-queue-list');
  if (!container) return; // Element might not exist in some layouts

  // Get next 5 songs
  const nextSongs = appState.playlist.slice(appState.currentSongIndex + 1, appState.currentSongIndex + 6);

  if (nextSongs.length === 0) {
    container.innerHTML = '<p style="color:#666; font-size:0.9rem;">End of playlist</p>';
    return;
  }

  container.innerHTML = nextSongs.map((song, i) => `
    <div class="queue-item" onclick="playSongAtIndex(${appState.currentSongIndex + 1 + i})">
      <img src="${song.cover}" alt="${song.title}">
      <div class="queue-info">
        <h5>${song.title}</h5>
        <p>${song.artist}</p>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 8. AUDIO VISUALIZER ENGINE
// ==========================================

/**
 * Initializes the Web Audio API context and analyser.
 * Must be triggered by a user interaction (click) to bypass autoplay policies.
 */
function initVisualizer() {
  if (appState.audioContext) return; // Already initialized

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    appState.audioContext = new AudioContext();
    appState.analyser = appState.audioContext.createAnalyser();

    // Connect audio element to analyser
    const source = appState.audioContext.createMediaElementSource(audio);
    source.connect(appState.analyser);
    appState.analyser.connect(appState.audioContext.destination);

    // Config analyser
    appState.analyser.fftSize = 256;
  } catch (e) {
    console.error('Web Audio API not supported:', e);
    showNotification('Visualizer not supported on this device', 'error');
  }
}

/**
 * Main animation loop for the visualizer.
 * Draws frequency data to the canvas in the visualizer panel.
 */
function drawVisualizer() {
  if (!appState.visualizerActive || !appState.analyser) return;

  requestAnimationFrame(drawVisualizer);

  const canvas = document.getElementById('visualizer-canvas');
  const ctx = canvas.getContext('2d');

  // Resize canvas to match display size
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const bufferLength = appState.analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  appState.analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    // Dynamic gradient color based on height
    const r = barHeight + (25 * (i / bufferLength));
    const g = 250 * (i / bufferLength);
    const b = 50;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

/**
 * Toggles the Visualizer Panel and starts/stops drawing.
 */
function toggleVisualizer() {
  const panel = document.getElementById('visualizer-panel');
  if (!panel) return;

  appState.visualizerActive = !appState.visualizerActive;

  if (appState.visualizerActive) {
    panel.classList.add('active');
    initVisualizer(); // Ensure context is ready
    drawVisualizer(); // Start loop
  } else {
    panel.classList.remove('active');
  }
}


// ==========================================
// 9. LOCAL MUSIC IMPORT
// ==========================================

/**
 * Handles the selection of a local folder.
 * Scans for audio files and adds them to the playlist.
 */
function handleFolderSelect(event) {
  const files = event.target.files;
  if (!files.length) return;

  let addedCount = 0;

  Array.from(files).forEach(file => {
    // Basic check for audio MIME types
    if (file.type.startsWith('audio/')) {
      const song = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Strip extension
        artist: 'Local Artist',
        album: 'Local Import',
        cover: 'assets/images/logo.png', // Default cover
        sources: [URL.createObjectURL(file)],
        duration: 'Unknown',
        category: ['local', 'new'],
        price: 0
      };

      appState.playlist.push(song);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    showNotification(`Imported ${addedCount} songs from folder`, 'success');
    appState.filter = 'local'; // Switch to show local songs
    renderSongs();
  } else {
    showNotification('No audio files found in selected folder', 'warning');
  }
}


// ==========================================
// 10. SETTINGS & EXTENDED LISTENERS
// ==========================================

/**
 * Secondary listener setup for advanced features 
 * (Visualizer, Settings, Local Import) that were separate.
 */
function setupAdvancedListeners() {
  // Visualizer Toggle
  const vizBtn = document.getElementById('visualizer-btn');
  if (vizBtn) vizBtn.addEventListener('click', toggleVisualizer);

  const closeViz = document.getElementById('close-visualizer');
  if (closeViz) closeViz.addEventListener('click', toggleVisualizer);

  // Local Import
  const importBtn = document.getElementById('import-music-btn');
  const fileInput = document.getElementById('local-folder-input');

  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFolderSelect);
  }

  // Settings Menu Toggle
  const settingsBtn = document.getElementById('settings-btn');
  const settingsDropdown = document.getElementById('settings-dropdown');

  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsDropdown.style.display = settingsDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close on click outside
    window.addEventListener('click', () => {
      settingsDropdown.style.display = 'none';
    });
  }
}

// ==========================================
// 11. EXPANDED PLAYER LOGIC (Continued)
// ==========================================


/**
 * Toggles the full-screen expanded player overlay.
 * Uses a simple class toggle on a high z-index overlay.
 */
window.toggleExpandedPlayer = function () {
  console.log('Toggling Expanded Player');
  const overlay = document.getElementById('expanded-player-overlay');
  if (!overlay) return;

  overlay.classList.toggle('active');

  // Lock body scroll when overlay is active
  if (overlay.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
    updateExpandedPlayerUI();
  } else {
    document.body.style.overflow = '';
  }
};

/**
 * Updates the expanded player UI with current song details.
 * Called whenever the song changes or overlay opens.
 */
function updateExpandedPlayerUI() {
  const song = appState.playlist[appState.currentSongIndex];
  if (!song) return;

  const titleEl = document.getElementById('ep-title');
  const artistEl = document.getElementById('ep-artist');
  const artEl = document.getElementById('ep-art');

  if (titleEl) titleEl.textContent = song.title;
  if (artistEl) artistEl.textContent = song.artist;
  if (artEl) artEl.src = song.cover;

  updatePlayButton();
}

/**
 * Helper to update dynamic background blur effect
 */
function updateAlbumBackground(imageUrl) {
  const bgElement = document.getElementById('album-art-bg');
  if (bgElement) {
    bgElement.style.backgroundImage = `url(${imageUrl})`;
  }
}

function updatePlayingAnimation() {
  const art = document.querySelector('.ep-art');
  if (art) {
    // Optional: Add breathing animation class here if desired
    // art.classList.toggle('playing', !audio.paused);
  }
}