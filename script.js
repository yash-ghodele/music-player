/**
 * Neon Beats - Premium Music Store & Player
 * Advanced JavaScript for Music Player, Visualizer, and Store Functionality
 */

// ==========================================
// Application State & Configuration
// ==========================================
const appState = {
  currentSongIndex: 0,
  isPlaying: false,
  isShuffled: false,
  repeatMode: 'none', // 'none', 'one', 'all'
  volume: 0.7,
  playlist: [],
  originalPlaylist: [], // For un-shuffle
  queue: [],
  favorites: [],
  favorites: [],
  view: 'grid', // 'grid' or 'list'
  filter: 'all',
  searchQuery: '',
  audioContext: null,
  analyser: null,
  visualizerActive: false
};

// ==========================================
// Data: Songs & Products
// ==========================================
const songs = [
  {
    id: 's1',
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    cover: "assets/images/MidnightCity.jpg",
    sources: ['assets/audio/sample.mp3'],
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
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Load saved state from localStorage
    try {
      // Theme removed


      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        appState.favorites = JSON.parse(savedFavorites);
      }
    } catch (e) {
      console.warn('Failed to load saved state:', e);
    }

    // Initialize state
    appState.playlist = [...songs];
    appState.originalPlaylist = [...songs];

    // Initialize UI
    renderSongs();
    updateVolumeUI();

    // Load initial song
    loadSong(appState.currentSongIndex);

    // Setup Listeners
    setupPlayerListeners();
    setupEventListeners();
  } catch (err) {
    console.error('Critical initialization error:', err);
    // Show notification to user
    setTimeout(() => {
      if (typeof showNotification === 'function') {
        showNotification('Error starting app: ' + err.message, 'error');
      } else {
        alert('Error starting app: ' + err.message);
      }
    }, 1000);
  } finally {
    // Remove loading overlay (fast!) - ALWAYS run this
    setTimeout(() => {
      try {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
          overlay.style.opacity = '0';
          overlay.style.transition = 'opacity 0.3s';
          setTimeout(() => {
            overlay.style.display = 'none';
            overlay.style.visibility = 'hidden';
          }, 300);
        } else {
          console.warn('Loading overlay element not found');
        }
      } catch (e) {
        console.error('Error hiding loading overlay:', e);
      }
    }, 100); // Reduced from 1000ms to 100ms for instant loading
  }
});

// ==========================================
// Rendering Components
// ==========================================

/**
 * Renders the song library with filtering and search applied
 * Supports grid and list view modes, category filtering, and search
 * Adds fade-in animations with staggered timing for visual polish
 */
function renderSongs() {
  const container = document.getElementById('songs-container');
  container.className = `songs-container ${appState.view}-view`;
  container.innerHTML = '';

  // Apply filters: category and search query
  const filteredSongs = appState.playlist.filter(song => {
    // Filter by category (all, favorites, popular, new, etc.)
    const categoryMatch = appState.filter === 'all' ||
      (appState.filter === 'favorites' && appState.favorites.includes(song.id)) ||
      song.category.includes(appState.filter);

    // Filter by search query (searches title, artist, album)
    const searchMatch = !appState.searchQuery ||
      song.title.toLowerCase().includes(appState.searchQuery) ||
      song.artist.toLowerCase().includes(appState.searchQuery) ||
      song.album.toLowerCase().includes(appState.searchQuery);

    return categoryMatch && searchMatch;
  });

  // Show empty state if no songs match filters
  if (filteredSongs.length === 0) {
    container.innerHTML = `<div class="empty-state">No songs found matching your criteria.</div>`;
    return;
  }

  // Render each song card
  filteredSongs.forEach((song, index) => {
    // Determine if this song is currently active (playing)
    const isActive = appState.playlist[appState.currentSongIndex].id === song.id;
    const isFavorite = appState.favorites.includes(song.id);

    // Find absolute index in the main playlist for playback
    const absoluteIndex = appState.playlist.findIndex(s => s.id === song.id);

    const card = document.createElement('div');
    card.className = `song-card ${isActive ? 'active' : ''}`;
    card.dataset.id = song.id;
    card.dataset.index = absoluteIndex;

    // Staggered fade-in animation for smooth entrance
    card.style.opacity = '0';
    card.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.05}s`;

    card.innerHTML = `
      <div class="song-image-container">
        <img loading="lazy" src="${song.cover}" alt="${song.title}" class="song-image" loading="lazy">
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
      </div>
    `;

    // Handle song card click to play
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      playSongAtIndex(absoluteIndex);
    });
    container.appendChild(card);
  });
}



// ==========================================
// Music Player Logic
// ==========================================
const audio = document.getElementById('audio-player');

/**
 * Loads a song into the player and updates all UI elements
 * Sets the audio source, updates metadata, favorite status, and media session
 * 
 * @param {number} index - Index of the song in the current playlist
 */
function loadSong(index) {
  appState.currentSongIndex = index; // Ensure currentSongIndex is updated
  const song = appState.playlist[index];
  if (!song) return;

  // Update player UI with song metadata
  document.getElementById('player-title').textContent = song.title;
  document.getElementById('player-artist').textContent = song.artist;
  document.getElementById('player-cover').src = song.cover;

  // Update Next Up Queue
  setTimeout(() => updateNextUpQueue(), 100);

  // Set first source by default for metadata
  // If it's 404, it might error, but we'll catch it on play
  audio.src = song.sources[0];

  renderSongs(); // Re-render to highlight active song

  // Update favorite button state
  const favBtn = document.getElementById('favorite-btn');
  const isFavorite = appState.favorites.includes(song.id);

  if (favBtn) {
    if (isFavorite) {
      favBtn.classList.add('active');
      favBtn.querySelector('i').className = 'ri-heart-fill';
    } else {
      favBtn.classList.remove('active');
      favBtn.querySelector('i').className = 'ri-heart-line';
    }
  }

  // Sync expanded player heart icon
  const expandedHeart = document.getElementById('expanded-heart');
  if (expandedHeart) {
    expandedHeart.className = isFavorite ? 'ri-heart-fill' : 'ri-heart-line';
  }

  // Setup media session API for OS-level media controls (lock screen, notifications)
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album,
      artwork: [
        { src: song.cover, sizes: '96x96', type: 'image/jpeg' },
        { src: song.cover, sizes: '128x128', type: 'image/jpeg' },
        { src: song.cover, sizes: '256x256', type: 'image/jpeg' },
        { src: song.cover, sizes: '512x512', type: 'image/jpeg' }
      ]
    });
  }

  renderQueue();
  updateExpandedPlayerUI(); // Update expanded player if open

  // Update enhanced player elements
  updateAlbumBackground(song.cover);
  updateExpandedAlbumName();
  updatePlayingAnimation();
}

/**
 * Plays a song with automatic fallback handling
 * Tries each source in the song's sources array sequentially
 * If all sources fail, falls back to a universal sample audio file
 * 
 * @param {Object} song - Song object containing sources array and metadata
 * @returns {Promise<void>}
 */
async function playWithFallback(song) {
  let played = false;
  const UNIVERSAL_FALLBACK = 'assets/audio/sample.mp3'; // Universal fallback audio

  // Try each source defined in the song object
  for (let i = 0; i < song.sources.length; i++) {
    try {
      console.log(`Trying source ${i + 1}: ${song.sources[i]}`);
      audio.src = song.sources[i];
      await audio.play();
      played = true;
      appState.isPlaying = true;
      updatePlayButton();

      // Initialize visualizer if needed for audio analysis
      if (!appState.audioContext) {
        initVisualizer();
      }
      break; // Success, exit loop
    } catch (e) {
      console.warn(`Source ${i + 1} failed:`, e);
      // Continue to next source in the array
    }
  }

  // If all song sources failed, try the universal fallback
  if (!played) {
    try {
      console.log(`All sources failed, trying universal fallback: ${UNIVERSAL_FALLBACK}`);
      audio.src = UNIVERSAL_FALLBACK;
      await audio.play();
      played = true;
      appState.isPlaying = true;
      updatePlayButton();

      // Notify user that original file is missing
      showNotification(`Original audio file missing. Playing sample audio for "${song.title}".`, 'warning');

      // Initialize visualizer if needed
      if (!appState.audioContext) {
        initVisualizer();
      }
    } catch (fallbackError) {
      console.error('Even universal fallback failed:', fallbackError);
      appState.isPlaying = false;
      updatePlayButton();
      showNotification('Unable to play audio. Please check your audio files.', 'error');
    }
  }
}

/**
 * Plays a song at the specified playlist index
 * Loads the song and initiates playback with fallback handling
 * 
 * @param {number} index - Index of the song in the playlist
 */
function playSongAtIndex(index) {
  appState.currentSongIndex = index;
  const song = appState.playlist[index];

  // Update UI immediately (optimistic update)
  // loadSong already updates player info and re-renders songs/queue
  loadSong(index);

  playWithFallback(song);
}

/**
 * Resumes or starts playing the current audio
 * Handles errors by attempting fallback sources
 */
function playAudio() {
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      appState.isPlaying = true;
      updatePlayButton();
      if (!appState.audioContext) initVisualizer();
    }).catch(error => {
      console.error('Resume/Play failed, trying fallback logic:', error);
      // If simple play fails (e.g. src was bad), try the robust loader
      const song = appState.playlist[appState.currentSongIndex];
      playWithFallback(song);
    });
  }
}

/**
 * Pauses the current audio playback
 */
function pauseAudio() {
  audio.pause();
  appState.isPlaying = false;
  updatePlayButton();
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
 * Plays the previous song in the playlist
 * Wraps around to the last song if at the beginning
 */
function prevSong() {
  appState.currentSongIndex--;
  if (appState.currentSongIndex < 0) {
    appState.currentSongIndex = appState.playlist.length - 1;
  }
  loadSong(appState.currentSongIndex);
  if (appState.isPlaying) playAudio();
}

/**
 * Plays the next song in the playlist
 * Wraps around to the first song if at the end
 */
function nextSong() {
  appState.currentSongIndex++;
  if (appState.currentSongIndex > appState.playlist.length - 1) {
    appState.currentSongIndex = 0;
  }
  loadSong(appState.currentSongIndex);
  if (appState.isPlaying) playAudio();
}

/**
 * Toggles shuffle mode on/off
 * Uses Fisher-Yates algorithm to randomize playlist while keeping current song first
 * When turned off, restores original playlist order
 */
function toggleShuffle() {
  appState.isShuffled = !appState.isShuffled;
  const btn = document.getElementById('shuffle-btn');
  const expandedBtn = document.getElementById('expanded-shuffle-btn');

  if (appState.isShuffled) {
    // Fisher-Yates shuffle algorithm
    const currentSong = appState.playlist[appState.currentSongIndex];
    let shuffled = [...appState.playlist];

    // Remove current song from shuffle pool
    shuffled = shuffled.filter(s => s.id !== currentSong.id);

    // Randomize remaining songs
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Add current song back at start so it keeps playing
    shuffled.unshift(currentSong);
    appState.playlist = shuffled;
    appState.currentSongIndex = 0;

    btn.classList.add('active');
    if (expandedBtn) expandedBtn.classList.add('active');
    showNotification('Shuffle On', 'info');
  } else {
    // Restore original order but keep current song playing
    const currentSong = appState.playlist[appState.currentSongIndex];
    appState.playlist = [...appState.originalPlaylist];
    appState.currentSongIndex = appState.playlist.findIndex(s => s.id === currentSong.id);

    btn.classList.remove('active');
    if (expandedBtn) expandedBtn.classList.remove('active');
    showNotification('Shuffle Off', 'info');
  }

  renderQueue();
}

/**
 * Cycles through repeat modes: none -> all -> one -> none
 * - none: No repeat
 * - all: Repeat entire playlist
 * - one: Repeat current song
 */
function toggleRepeat() {
  const btn = document.getElementById('repeat-btn');
  const icon = btn.querySelector('i');

  if (appState.repeatMode === 'none') {
    appState.repeatMode = 'all';
    btn.classList.add('active');
    icon.className = 'ri-repeat-line';
    showNotification('Repeat All', 'info');
  } else if (appState.repeatMode === 'all') {
    appState.repeatMode = 'one';
    btn.classList.add('active');
    icon.className = 'ri-repeat-one-line';
    showNotification('Repeat One', 'info');
  } else {
    appState.repeatMode = 'none';
    btn.classList.remove('active');
    icon.className = 'ri-repeat-line';
    showNotification('Repeat Off', 'info');
  }
}

/**
 * Updates play/pause button icons across all player instances
 * Syncs both main player and expanded player buttons
 */
function updatePlayButton() {
  const btns = [document.getElementById('play-btn'), document.getElementById('expanded-play-btn')];

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

/**
 * Formats seconds into MM:SS format
 * 
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string (e.g., "3:45")
 */
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/**
 * Updates all progress indicators during playback
 * Updates main player bar, expanded player ring, linear bar, and time displays
 * 
 * @param {Event} e - Timeupdate event from audio element
 */
function updateProgress(e) {
  const { duration, currentTime } = audio;
  const progressPercent = (currentTime / duration) * 100;

  if (isNaN(duration)) return;

  // Main Player Progress Bar (linear)
  document.getElementById('progress-fill').style.width = `${progressPercent}%`;
  document.getElementById('time-current').textContent = formatTime(currentTime);
  document.getElementById('time-total').textContent = formatTime(duration);

  // Expanded Player Progress Ring (circular SVG)
  const circle = document.getElementById('circle-progress');
  if (circle) {
    const radius = circle.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  // Expanded Player Linear Progress Bar
  const expandedProgressFill = document.getElementById('expanded-progress-fill');
  if (expandedProgressFill) {
    expandedProgressFill.style.width = `${progressPercent}%`;
  }

  // Expanded Time Display
  const expTime = document.getElementById('expanded-time');
  if (expTime) expTime.textContent = formatTime(currentTime);
}

/**
 * Handles click on progress bar to seek to specific time
 * Calculates position based on click offset and sets audio currentTime
 * 
 * @param {Event} e - Click event
 */
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  if (isNaN(duration)) return;

  audio.currentTime = (clickX / width) * duration;
}

// ==========================================
// Event Listeners Setup
// ==========================================
function setupPlayerListeners() {
  // Audio events
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', () => {
    if (appState.repeatMode === 'one') {
      audio.currentTime = 0;
      audio.play();
    } else {
      nextSong();
    }
  });

  // Control buttons
  document.getElementById('play-btn').addEventListener('click', togglePlay);
  document.getElementById('prev-btn').addEventListener('click', prevSong);
  document.getElementById('next-btn').addEventListener('click', nextSong);
  document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
  document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);

  // Progress bar
  document.getElementById('progress-bar').addEventListener('click', setProgress);

  // Expand Interaction
  document.getElementById('player-cover').addEventListener('click', toggleExpandedPlayer);
  document.getElementById('player-cover').style.cursor = 'pointer';

  // Volume
  const volumeSlider = document.getElementById('volume-slider');
  const volumeBtn = document.getElementById('volume-btn');

  volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value / 100;
    appState.volume = value;
    audio.volume = value;
    updateVolumeUI(); // Update icon based on volume
  });

  volumeBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
      audio.volume = 0;
      volumeSlider.value = 0;
      volumeBtn.querySelector('i').className = 'ri-volume-mute-line';
    } else {
      audio.volume = appState.volume; // Restore to previous volume
      volumeSlider.value = appState.volume * 100;
      updateVolumeUI(); // Update icon based on restored volume
    }
  });

  // Favorite button
  document.getElementById('favorite-btn').addEventListener('click', () => {
    const currentSong = appState.playlist[appState.currentSongIndex];
    const index = appState.favorites.indexOf(currentSong.id);

    if (index === -1) {
      appState.favorites.push(currentSong.id);
      showNotification('Added to Favorites', 'success');
    } else {
      appState.favorites.splice(index, 1);
      showNotification('Removed from Favorites', 'info');
    }

    saveStateToStorage();
    loadSong(appState.currentSongIndex); // To update icon
  });

  // Visualizer toggle
  document.getElementById('visualizer-btn').addEventListener('click', () => {
    const panel = document.getElementById('visualizer-panel');
    panel.classList.add('active');
    appState.visualizerActive = true;

    if (!appState.audioContext) {
      initVisualizer();
    }
    drawVisualizer();
  });

  document.getElementById('close-visualizer').addEventListener('click', () => {
    const panel = document.getElementById('visualizer-panel');
    panel.classList.remove('panel-open');
    panel.classList.remove('active');
    appState.visualizerActive = false;
  });

  // Queue toggle
  document.getElementById('queue-btn').addEventListener('click', () => {
    document.getElementById('queue-panel').classList.add('panel-open');
    renderQueue();
  });

  document.getElementById('close-queue').addEventListener('click', () => {
    const panel = document.getElementById('queue-panel');
    panel.classList.remove('panel-open');
    panel.classList.remove('active');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Only if not typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowLeft') {
      prevSong();
    } else if (e.code === 'ArrowRight') {
      nextSong();
    } else if (e.code === 'ArrowUp') {
      e.preventDefault();
      const newVolume = Math.min(1, audio.volume + 0.1);
      audio.volume = newVolume;
      appState.volume = newVolume;
      document.getElementById('volume-slider').value = newVolume * 100;
      updateVolumeUI();
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      const newVolume = Math.max(0, audio.volume - 0.1);
      audio.volume = newVolume;
      appState.volume = newVolume;
      document.getElementById('volume-slider').value = newVolume * 100;
      updateVolumeUI();
    } else if (e.code === 'KeyM') {
      const volumeBtn = document.getElementById('volume-btn');
      const volumeSlider = document.getElementById('volume-slider');
      if (audio.volume > 0) {
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeBtn.querySelector('i').className = 'ri-volume-mute-line';
      } else {
        audio.volume = appState.volume;
        volumeSlider.value = appState.volume * 100;
        updateVolumeUI();
      }
    } else if (e.code === 'KeyS') {
      toggleShuffle();
    } else if (e.code === 'KeyR') {
      toggleRepeat();
    }
  });

  // Expanded Player Sync (only if elements exist)
  const expandedPlayBtn = document.getElementById('expanded-play-btn');
  const expandedPrevBtn = document.getElementById('expanded-prev-btn');
  const expandedNextBtn = document.getElementById('expanded-next-btn');

  if (expandedPlayBtn) expandedPlayBtn.addEventListener('click', togglePlay);
  if (expandedPrevBtn) expandedPrevBtn.addEventListener('click', prevSong);
  if (expandedNextBtn) expandedNextBtn.addEventListener('click', nextSong);

  // Download Button
  const downloadBtn = document.getElementById('download-btn');
  const expandedDownloadBtn = document.getElementById('expanded-download-btn');

  const handleDownload = () => {
    const song = appState.playlist[appState.currentSongIndex];
    if (!song) return;

    const link = document.createElement('a');
    link.href = song.sources[0];
    link.download = `${song.artist} - ${song.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Download started', 'success');
  };

  if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
  if (expandedDownloadBtn) expandedDownloadBtn.addEventListener('click', handleDownload);

  // Share Button
  const shareBtn = document.getElementById('share-btn');
  const expandedShareBtn = document.getElementById('expanded-share-btn');

  const handleShare = async () => {
    const song = appState.playlist[appState.currentSongIndex];
    if (!song) return;

    const shareData = {
      title: song.title,
      text: `Check out "${song.title}" by ${song.artist} on Neon Beats!`,
      url: window.location.href
    };

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showNotification('Shared successfully', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(text).then(() => {
        showNotification('Link copied to clipboard', 'success');
      }).catch(() => {
        showNotification('Failed to copy link', 'error');
      });
    }
  };

  if (shareBtn) shareBtn.addEventListener('click', handleShare);
  if (expandedShareBtn) expandedShareBtn.addEventListener('click', handleShare);

  // Expanded Player Volume Controls
  const expandedVolumeBtn = document.getElementById('expanded-volume-btn');
  const expandedVolumeSlider = document.getElementById('volume-slider-expanded');

  if (expandedVolumeSlider) {
    expandedVolumeSlider.addEventListener('input', (e) => {
      const value = e.target.value / 100;
      appState.volume = value;
      audio.volume = value;
      document.getElementById('volume-slider').value = e.target.value;
      updateVolumeUI();
    });
  }

  if (expandedVolumeBtn) {
    expandedVolumeBtn.addEventListener('click', () => {
      if (audio.volume > 0) {
        audio.volume = 0;
        if (expandedVolumeSlider) expandedVolumeSlider.value = 0;
        document.getElementById('volume-slider').value = 0;
        expandedVolumeBtn.querySelector('i').className = 'ri-volume-mute-line';
      } else {
        audio.volume = appState.volume;
        if (expandedVolumeSlider) expandedVolumeSlider.value = appState.volume * 100;
        document.getElementById('volume-slider').value = appState.volume * 100;
        updateVolumeUI();
      }
    });
  }

  // Expanded Progress Bar Click
  const expandedProgressBar = document.getElementById('expanded-progress-bar');
  if (expandedProgressBar) {
    expandedProgressBar.addEventListener('click', function (e) {
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;

      if (isNaN(duration)) return;

      audio.currentTime = (clickX / width) * duration;
    });
  }

  // Settings Menu Toggle
  const settingsBtn = document.getElementById('settings-btn');
  const settingsDropdown = document.getElementById('settings-dropdown');

  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = settingsDropdown.style.display === 'block';
      settingsDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      settingsDropdown.style.display = 'none';
    });

    settingsDropdown.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing when clicking inside
    });

    // Settings handlers with localStorage
    const audioQuality = document.getElementById('audio-quality');
    const crossfadeToggle = document.getElementById('crossfade-toggle');
    const normalizeToggle = document.getElementById('normalize-toggle');

    if (audioQuality) {
      // Load saved setting
      const savedQuality = localStorage.getItem('audioQuality');
      if (savedQuality) audioQuality.value = savedQuality;

      audioQuality.addEventListener('change', () => {
        localStorage.setItem('audioQuality', audioQuality.value);
        showNotification(`Audio quality: ${audioQuality.value}`, 'info');
      });
    }

    if (crossfadeToggle) {
      const savedCrossfade = localStorage.getItem('crossfade') === 'true';
      crossfadeToggle.checked = savedCrossfade;

      crossfadeToggle.addEventListener('change', () => {
        localStorage.setItem('crossfade', crossfadeToggle.checked);
        showNotification(`Crossfade ${crossfadeToggle.checked ? 'enabled' : 'disabled'}`, 'info');
      });
    }

    if (normalizeToggle) {
      const savedNormalize = localStorage.getItem('normalize') === 'true';
      normalizeToggle.checked = savedNormalize;

      normalizeToggle.addEventListener('change', () => {
        localStorage.setItem('normalize', normalizeToggle.checked);
        showNotification(`Volume normalization ${normalizeToggle.checked ? 'enabled' : 'disabled'}`, 'info');
      });
    }
  }
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      // Remove active class from all
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      // Add to current
      this.classList.add('active');
    });
  });

  // NavBar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Nav Toggle
  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('nav-menu').classList.toggle('active');
  });

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.toLowerCase();

      const clearBtn = document.getElementById('clear-search');
      if (clearBtn) clearBtn.style.display = appState.searchQuery ? 'block' : 'none';

      renderSongs();
    });
  }

  const clearSearch = document.getElementById('clear-search');
  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      appState.searchQuery = '';
      clearSearch.style.display = 'none';
      renderSongs();
    });
  }

  // Category Filters
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      // Update UI
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update state
      appState.filter = this.dataset.category;
      renderSongs();
    });
  });

  // Import Local Music
  const importBtn = document.getElementById('import-music-btn');
  const fileInput = document.getElementById('local-folder-input');

  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', handleLocalFiles);
  }



  // View Toggle (Grid/List)
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      appState.view = this.dataset.view;
      renderSongs();
    });
  });



  // Clear Queue Button
  const clearQueueBtn = document.getElementById('clear-queue');
  if (clearQueueBtn) {
    clearQueueBtn.addEventListener('click', () => {
      appState.queue = [];
      updateQueue();
      showNotification('Queue cleared', 'info');
    });
  }

  // Theme toggle removed
}

// ==========================================
// Advanced Feature: Audio Visualizer
// ==========================================
function initVisualizer() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    appState.audioContext = new AudioContext();
    appState.analyser = appState.audioContext.createAnalyser();

    // Connect audio source to analyser
    try {
      const source = appState.audioContext.createMediaElementSource(audio);
      source.connect(appState.analyser);
      appState.analyser.connect(appState.audioContext.destination);
    } catch (e) {
      console.warn('Visualizer connection failed (likely CORS):', e);
      // Fallback: just play audio without visualizer
      // Note: We don't need to connect to destination here because the <audio> element
      // is already connected to the output by default if we didn't successfully hijack it with createMediaElementSource
      // However, if createMediaElementSource DID succeed but connect failed, we might be in a weird state.
      // Usually, if createMediaElementSource works, it routes audio away from the destination.
      showNotification('Visualizer disabled (CORS restriction)', 'info');
      appState.visualizerActive = false;
      return;
    }

    appState.analyser.fftSize = 256;
  } catch (e) {
    console.error('Audio Context Error:', e);
  }
}

function drawVisualizer() {
  if (!appState.visualizerActive || !appState.analyser) return;

  const canvas = document.getElementById('visualizer-canvas');
  const ctx = canvas.getContext('2d');

  // Resize canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const bufferLength = appState.analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const draw = () => {
    if (!appState.visualizerActive) return;

    requestAnimationFrame(draw);

    appState.analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(10, 0, 14, 0.2)'; // Fade effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 2;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      gradient.addColorStop(0, '#7209b7');
      gradient.addColorStop(1, '#f72585');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  };

  draw();
}

// ==========================================
// Queue Management
// ==========================================
function renderQueue() {
  const currentContainer = document.getElementById('queue-current');
  const nextContainer = document.getElementById('queue-list');

  // Render Current
  const currentSong = appState.playlist[appState.currentSongIndex];
  if (currentSong) {
    currentContainer.innerHTML = `
      <div class="queue-item playing">
        <img loading="lazy" src="${currentSong.cover}" alt="cover">
        <div class="queue-info">
          <h5>${currentSong.title}</h5>
          <p>${currentSong.artist}</p>
        </div>
        <i class="ri-volume-up-fill" style="margin-left: auto; color: var(--primary)"></i>
      </div>
    `;
  }

  // Render Next
  nextContainer.innerHTML = '';

  // Show next 10 songs
  for (let i = 1; i <= 10; i++) {
    const nextIndex = (appState.currentSongIndex + i) % appState.playlist.length;
    const song = appState.playlist[nextIndex];

    const item = document.createElement('div');
    item.className = 'queue-item';
    item.innerHTML = `
      <img loading="lazy" src="${song.cover}" alt="cover">
      <div class="queue-info">
        <h5>${song.title}</h5>
        <p>${song.artist}</p>
      </div>
      <span style="margin-left: auto; font-size: 0.8rem; color: #666">${song.duration}</span>
    `;

    item.addEventListener('click', () => {
      playSongAtIndex(nextIndex);
    });

    nextContainer.appendChild(item);
  }
}



// ==========================================
// Notifications & Utils
// ==========================================
function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications');
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <i class="ri-close-line" style="cursor: pointer;" onclick="this.parentElement.remove()"></i>
  `;

  container.appendChild(notification);

  // Auto remove
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function saveStateToStorage() {
  localStorage.setItem('neonBeats_favorites', JSON.stringify(appState.favorites));
  localStorage.setItem('neonBeats_favorites', JSON.stringify(appState.favorites));
}

function loadStateForStorage() {
  const favorites = localStorage.getItem('neonBeats_favorites');
  if (favorites) appState.favorites = JSON.parse(favorites);

}

// ==========================================
// Local Music Handling
// ==========================================
function handleLocalFiles(e) {
  const allFiles = Array.from(e.target.files);
  const audioFiles = allFiles.filter(file => file.type.startsWith('audio/'));
  const imageFiles = allFiles.filter(file => file.type.startsWith('image/'));

  // Helper: map directory paths to finding a cover image
  const folderCovers = {};

  // 1. Scan for "common" cover names in each folder
  imageFiles.forEach(img => {
    const pathParts = img.webkitRelativePath.split('/');
    pathParts.pop(); // remove filename
    const dirPath = pathParts.join('/');

    const lowerName = img.name.toLowerCase();
    if (lowerName.includes('cover') || lowerName.includes('folder') || lowerName.includes('album') || lowerName.includes('front')) {
      if (!folderCovers[dirPath]) {
        folderCovers[dirPath] = img;
      }
    }
  });

  // 2. Fallback: if no specific cover found, use the first image in the folder
  imageFiles.forEach(img => {
    const pathParts = img.webkitRelativePath.split('/');
    pathParts.pop();
    const dirPath = pathParts.join('/');

    if (!folderCovers[dirPath]) {
      folderCovers[dirPath] = img;
    }
  });

  if (audioFiles.length === 0) {
    showNotification('No audio files found in selected folder', 'error');
    return;
  }

  showNotification(`Importing ${audioFiles.length} songs...`, 'info');

  let importedCount = 0;

  audioFiles.forEach((file, i) => {
    // Create object URL for the file
    const objectUrl = URL.createObjectURL(file);

    // Basic metadata parsing
    let artist = 'Unknown Artist';
    let title = file.name.replace(/\.[^/.]+$/, "");

    if (title.includes(' - ')) {
      const parts = title.split(' - ');
      artist = parts[0];
      title = parts.slice(1).join(' - ');
    }

    // Determine Cover Art
    let coverUrl = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'; // Default

    // Check for exact match
    const pathWithoutExt = file.webkitRelativePath.replace(/\.[^/.]+$/, "");
    const exactMatch = imageFiles.find(img =>
      img.webkitRelativePath.replace(/\.[^/.]+$/, "") === pathWithoutExt
    );

    // Check for folder cover
    const pathParts = file.webkitRelativePath.split('/');
    pathParts.pop();
    const dirPath = pathParts.join('/');
    const folderCover = folderCovers[dirPath];

    if (exactMatch) {
      coverUrl = URL.createObjectURL(exactMatch);
    } else if (folderCover) {
      coverUrl = URL.createObjectURL(folderCover);
    }

    const newSong = {
      id: `local_${Date.now()}_${i}`,
      title: title,
      artist: artist,
      album: 'Local Music',
      cover: coverUrl,
      sources: [objectUrl],
      duration: 'Unknown',
      category: ['local'],
      price: 0
    };

    appState.playlist.push(newSong);
    appState.originalPlaylist.push(newSong);
    importedCount++;
  });

  if (importedCount > 0) {
    showNotification(`${importedCount} songs imported successfully!`, 'success');

    // Switch filter to 'local' to show new songs? Or just 'all'
    // Let's keep current view but re-render
    renderSongs();

    // Update category tabs to include 'Local'
    addLocalCategoryTab();
  }
}

function addLocalCategoryTab() {
  const tabsContainer = document.querySelector('.category-tabs');
  if (!tabsContainer.querySelector('[data-category="local"]')) {
    const tab = document.createElement('button');
    tab.className = 'category-tab';
    tab.dataset.category = 'local';
    tab.textContent = 'Local Music';
    tab.addEventListener('click', function () {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      appState.filter = 'local';
      renderSongs();
    });
    tabsContainer.appendChild(tab);
  }
}

// Expose functions globally for HTML onclick events
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

// ==========================================
// Expanded Player Logic
// ==========================================
window.toggleExpandedPlayer = function () {
  const player = document.getElementById('expanded-player');
  player.classList.toggle('active');
  if (player.classList.contains('active')) {
    updateExpandedPlayerUI();
  }
};

function updateExpandedPlayerUI() {
  const song = appState.playlist[appState.currentSongIndex];
  if (!song) return;

  document.getElementById('expanded-title').textContent = song.title;
  document.getElementById('expanded-artist').textContent = song.artist;
  document.getElementById('expanded-art').src = song.cover;

  // Render Queue
  const queueList = document.getElementById('expanded-queue-list');
  if (queueList) {
    queueList.innerHTML = '';

    // Show next 5 songs
    for (let i = 1; i <= 6; i++) {
      const nextIndex = (appState.currentSongIndex + i) % appState.playlist.length;
      const nextSong = appState.playlist[nextIndex];

      const item = document.createElement('div');
      item.className = 'queue-item';
      item.onclick = () => playSongAtIndex(nextIndex);
      item.innerHTML = `
        <img loading="lazy" src="${nextSong.cover}" alt="Art">
        <div class="queue-info">
          <h5>${nextSong.title}</h5>
          <p>${nextSong.artist}</p>
        </div>
      `;
      queueList.appendChild(item);
    }
  }

  // Sync buttons
  updatePlayButton();
}

// ==========================================
// Store Modal Logic
// ==========================================
function openQuickView(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById('qv-image').src = product.image;
  document.getElementById('qv-title').textContent = product.title;
  document.getElementById('qv-category').textContent = product.category;
  document.getElementById('qv-price').textContent = '$' + product.price.toLocaleString();
  document.getElementById('qv-description').textContent = product.description || "Experience premium sound quality with this professional-grade instrument.";

  // Rating stars
  document.getElementById('qv-rating').innerHTML = getStarRating(product.rating);

  // Audio Demo Button (New)
  const infoContainer = document.querySelector('.quick-view-info');
  // Remove existing demo btn if any
  const oldDemo = document.getElementById('qv-demo-btn');
  if (oldDemo) oldDemo.remove();

  const demoBtn = document.createElement('button');
  demoBtn.id = 'qv-demo-btn';
  demoBtn.className = 'btn-secondary btn-sm';
  demoBtn.style.marginTop = '1rem';
  demoBtn.innerHTML = '<i class="ri-play-circle-line"></i> Audio Preview';
  demoBtn.onclick = () => {
    const audio = new Audio('assets/audio/sample.mp3');
    audio.volume = 0.5;
    audio.play();
    demoBtn.innerHTML = '<i class="ri-volume-up-line"></i> Playing...';
    setTimeout(() => {
      audio.pause();
      demoBtn.innerHTML = '<i class="ri-play-circle-line"></i> Audio Preview';
    }, 5000); // 5s preview
  };

  // Insert before description
  const desc = document.getElementById('qv-description');
  infoContainer.insertBefore(demoBtn, desc);

  // Mock Reviews
  const reviewsList = document.getElementById('qv-reviews-list');
  if (reviewsList) {
    reviewsList.innerHTML = `
        <div class="review-item">
            <div class="review-header">
                <strong>Alex M.</strong>
                <span class="stars">${getStarRating(5)}</span>
            </div>
            <p>"Absolutely stunning quality. Worth every penny!"</p>
        </div>
        <div class="review-item">
            <div class="review-header">
                <strong>Sarah J.</strong>
                <span class="stars">${getStarRating(4)}</span>
            </div>
            <p>"Great sound, fast shipping using Neon Beats."</p>
        </div>
      `;
  }

  // Bind Add Button
  const addBtn = document.getElementById('qv-add-btn');
  addBtn.onclick = () => {
    addToCart(product.id);
    closeQuickView();
  };

  document.getElementById('quick-view-modal').classList.add('active');
}

function closeQuickView() {
  document.getElementById('quick-view-modal').classList.remove('active');
}

function openCheckout() {
  if (appState.cart.length === 0) {
    showNotification('Your cart is empty!', 'error');
    return;
  }

  const total = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const count = appState.cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById('checkout-total').textContent = '$' + total.toFixed(2);
  document.getElementById('checkout-count').textContent = count;

  toggleCart(); // Close side panel
  document.getElementById('checkout-modal').classList.add('active');
}

function closeCheckout() {
  document.getElementById('checkout-modal').classList.remove('active');
}

function processPayment() {
  // Simulate processing
  const btn = document.querySelector('#checkout-form button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Processing...';
  btn.disabled = true;

  setTimeout(() => {
    // Hide checkout, show success
    closeCheckout();
    document.getElementById('success-overlay').style.display = 'flex';

    // Clear cart logic here
    appState.cart = [];
    updateCartUI();
    saveStateToStorage();

    // Reset button
    btn.textContent = originalText;
    btn.disabled = false;
  }, 1500);
}

function closeSuccess() {
  document.getElementById('success-overlay').style.display = 'none';
}

// Modal Event Listeners
document.getElementById('close-quick-view').addEventListener('click', closeQuickView);
document.getElementById('close-checkout').addEventListener('click', closeCheckout);

// Close on outside click
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// Side Panel Toggles
function toggleCart() {
  document.querySelector('.cart-panel').classList.toggle('active');
  const overlay = document.querySelector('.overlay');
  if (overlay) overlay.classList.toggle('active');
}

function toggleLibrary() {
  document.querySelector('.library-panel').classList.toggle('active'); // If library panel exists
}

window.toggleCart = toggleCart; // Expose globally for HTML onclicks

// ==========================================
// UI Helpers
// ==========================================
function updateVolumeUI() {
  const slider = document.getElementById('volume-slider');
  const volumeBtn = document.getElementById('volume-btn');
  if (slider) slider.value = appState.volume * 100;

  // Update icon based on volume
  if (volumeBtn) {
    if (appState.volume === 0) {
      volumeBtn.querySelector('i').className = 'ri-volume-mute-line';
    } else if (appState.volume < 0.5) {
      volumeBtn.querySelector('i').className = 'ri-volume-down-line';
    } else {
      volumeBtn.querySelector('i').className = 'ri-volume-up-line';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Add Checkout Button to Cart Panel if not there
  const cartFooter = document.querySelector('.cart-panel .panel-footer');
  if (cartFooter) {
    cartFooter.innerHTML = `
          <div class="cart-total">
            <span>Total:</span>
            <span id="cart-total-display">$0.00</span>
          </div>
          <button class="btn-primary btn-block" onclick="openCheckout()">Checkout</button>
        `;
  }
});

// End of Script

// Contact Form Handler
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        contactForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    });
  }
});

/* ==========================================
 * EXPANDED PLAYER ENHANCEMENTS
 * Waveform, Action Buttons, Touch Gestures
 * ========================================== */

/**
 * Generates waveform bars for the expanded player
 * Creates 80 bars with random heights to simulate audio waveform
 */
function generateWaveform() {
  const container = document.getElementById('waveform-container');
  if (!container) return;

  container.innerHTML = ''; // Clear existing
  const barCount = 80;

  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'waveform-bar';
    const height = 20 + Math.random() * 80;
    bar.style.height = `${height}%`;
    bar.dataset.index = i;

    // Click to seek
    bar.addEventListener('click', () => {
      const percent = (i / barCount) * 100;
      seekToPercent(percent);
    });

    container.appendChild(bar);
  }
}

/**
 * Updates waveform bars to show playback progress
 * @param {number} percent - Current playback percentage (0-100)
 */
function updateWaveformProgress(percent) {
  const bars = document.querySelectorAll('.waveform-bar');
  if (bars.length === 0) return;

  const activeIndex = Math.floor((percent / 100) * bars.length);

  bars.forEach((bar, idx) => {
    bar.classList.remove('active', 'passed');
    if (idx === activeIndex) {
      bar.classList.add('active');
    } else if (idx < activeIndex) {
      bar.classList.add('passed');
    }
  });
}

/**
 * Updates blurred album art background dynamically
 * @param {string} imageUrl - URL of the album art
 */
function updateAlbumBackground(imageUrl) {
  const bgElement = document.getElementById('album-art-bg');
  if (!bgElement) return;

  bgElement.style.backgroundImage = `url(${imageUrl})`;
}

/**
 *  Updates expanded player album name display
 */
function updateExpandedAlbumName() {
  const albumSpan = document.getElementById('expanded-album');
  if (!albumSpan || !appState.currentSong) return;

  const song = appState.playlist[appState.currentSong];
  albumSpan.textContent = song.album || 'Single';
}

/**
 * Sets up action button event listeners
 */
function setupActionButtons() {
  // Favorite button
  const favBtn = document.getElementById('expanded-favorite-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      if (appState.currentSong !== null) {
        toggleFavorite(appState.currentSong);
      }
    });
  }

  // Share button
  const shareBtn = document.getElementById('expanded-share-btn-2');
  if (shareBtn) {
    shareBtn.addEventListener('click', shareTrack);
  }

  // Download button
  const downloadBtn = document.getElementById('expanded-download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadTrack);
  }

  // Add to playlist button
  const playlistBtn = document.getElementById('expanded-add-playlist-btn');
  if (playlistBtn) {
    playlistBtn.addEventListener('click', () => {
      // For now, add to favorites (can be expanded later)
      if (appState.currentSong !== null) {
        toggleFavorite(appState.currentSong);
        showNotification('Added to favorites', 'success');
      }
    });
  }
}

/**
 * Sets up touch gesture handlers for mobile
 */
function setupTouchGestures() {
  const expandedPlayer = document.getElementById('expanded-player');
  if (!expandedPlayer) return;

  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 50;

  expandedPlayer.addEventListener('touchstart', (e) => {
    // Only capture touches on the player background, not on buttons
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  expandedPlayer.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Determine direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0) {
          // Swipe right - previous song
          prevSong();
          showSwipeIndicator('left');
        } else {
          // Swipe left - next song
          nextSong();
          showSwipeIndicator('right');
        }
      }
    } else {
      // Vertical swipe
      if (deltaY > SWIPE_THRESHOLD) {
        // Swipe down - close expanded player
        const expandedPlayer = document.getElementById('expanded-player');
        if (expandedPlayer && expandedPlayer.classList.contains('active')) {
          expandedPlayer.classList.remove('active');
        }
      }
    }

    touchStartX = 0;
    touchStartY = 0;
  });
}

/**
 * Shows a visual indicator for swipe gestures
 * @param {string} direction - 'left' or 'right'
 */
function showSwipeIndicator(direction) {
  // Create temporary indicator if it doesn't exist
  let indicator = document.querySelector(`.swipe-indicator.${direction}`);

  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = `swipe-indicator ${direction}`;
    indicator.innerHTML = direction === 'left' ? '<i class="ri-skip-back-fill"></i>' : '<i class="ri-skip-forward-fill"></i>';
    document.body.appendChild(indicator);
  }

  indicator.classList.add('active');
  setTimeout(() => {
    indicator.classList.remove('active');
  }, 300);
}

/**
 * Adds playing class to art container for rotation animation
 */
function updatePlayingAnimation() {
  const artContainer = document.querySelector('.art-container');
  if (!artContainer) return;

  if (!audio.paused) {
    artContainer.classList.add('playing');
  } else {
    artContainer.classList.remove('playing');
  }
}

// Initialize enhanced features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add small delay to ensure all elements are ready
  setTimeout(() => {
    // Generate waveform
    generateWaveform();

    // Setup action buttons
    setupActionButtons();

    // Setup touch gestures
    setupTouchGestures();

    // Setup audio event listeners for waveform
    const audioElement = document.getElementById('audio-player');
    if (audioElement) {
      audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
          const percent = (audioElement.currentTime / audioElement.duration) * 100;
          updateWaveformProgress(percent);
        }
        updatePlayingAnimation();
      });

      audioElement.addEventListener('play', updatePlayingAnimation);
      audioElement.addEventListener('pause', updatePlayingAnimation);
    }
  }, 500);
});



// ==========================================
// Queue Sidebar Functionality
// ==========================================
function updateNextUpQueue() {
  const container = document.getElementById('next-up-list');
  if (!container) return;

  const currentIndex = appState.currentSongIndex;
  // Get next 5 songs
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
  }
}
