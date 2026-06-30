/**
 * ====================================================================
 * NEON BEATS - MAIN APPLICATION SCRIPT (v3.0 REBUILD)
 * ====================================================================
 */

// ==========================================
// 1. APPLICATION STATE
// ==========================================
const appState = {
  currentSongIndex: 0,
  isPlaying: false,
  isShuffled: false,
  repeatMode: 'none', // 'none', 'all', 'one'
  volume: 0.7,
  playlist: [],
  originalPlaylist: [],
  searchQuery: '',
  view: 'grid', // 'grid' or 'list'
  sidebarOpen: false,
  sidebarTab: 'now-playing', // 'now-playing', 'queue', 'visualizer'
  savedVolume: 0.7
};

// ==========================================
// 2. SONG CATALOG
// ==========================================
const songs = [
  {
    id: 's1',
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    cover: "assets/images/MidnightCity.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "4:03"
  },
  {
    id: 's2',
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "assets/images/BlindingLights.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:20"
  },
  {
    id: 's3',
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover: "assets/images/MidnightCity.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:45"
  },
  {
    id: 's4',
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "assets/images/SaveYourTears.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:35"
  },
  {
    id: 's5',
    title: "Stay",
    artist: "The Kid LAROI",
    album: "F*CK LOVE 3: OVER YOU",
    cover: "assets/images/HeatWaves.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "2:21"
  },
  {
    id: 's6',
    title: "Bad Habit",
    artist: "Steve Lacy",
    album: "Gemini Rights",
    cover: "assets/images/BlindingLights.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:52"
  },
  {
    id: 's7',
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    cover: "assets/images/HeatWaves.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:58"
  },
  {
    id: 's8',
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    cover: "assets/images/SaveYourTears.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "2:47"
  },
  {
    id: 's9',
    title: "Running Up That Hill",
    artist: "Kate Bush",
    album: "Hounds of Love",
    cover: "assets/images/MidnightCity.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "4:58"
  },
  {
    id: 's10',
    title: "Glimpse of Us",
    artist: "Joji",
    album: "SMITHEREENS",
    cover: "assets/images/BlindingLights.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:53"
  },
  {
    id: 's11',
    title: "Break My Soul",
    artist: "Beyoncé",
    album: "RENAISSANCE",
    cover: "assets/images/HeatWaves.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "4:38"
  },
  {
    id: 's12',
    title: "About Damn Time",
    artist: "Lizzo",
    album: "Special",
    cover: "assets/images/SaveYourTears.jpg",
    sources: ['assets/audio/sample.mp3'],
    duration: "3:11"
  }
];

const audio = document.getElementById('audio-player');

// ==========================================
// 3. INITIALIZATION & LAUNCH
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Load local storage preferences
    loadSettings();

    // Populate catalog
    appState.playlist = [...songs];
    appState.originalPlaylist = [...songs];

    // Initial render
    renderSongs();
    updateVolumeUI();

    // Load first track (unplayed)
    loadSong(appState.currentSongIndex);

    // Bind all user controls
    setupListeners();

    // Navbar scroll detection
    setupScrollSpy();

    // Generate unique album art for songs with shared covers
    generateAllCovers();

    // Mobile hamburger nav
    setupMobileNav();

  } catch (err) {
    console.error('Initialization error:', err);
    showNotification('Error starting app: ' + err.message, 'error');
  } finally {
    // Hide startup loading screen
    setTimeout(() => {
      const loader = document.getElementById('loading-overlay');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 300);
      }
    }, 200);
  }
});

// ==========================================
// 4. LIBRARY RENDER ENGINE
// ==========================================
function renderSongs() {
  const container = document.getElementById('songs-container');
  if (!container) return;

  container.className = `songs-container ${appState.view}-view`;
  container.innerHTML = '';

  const filtered = appState.playlist.filter(song => {
    return !appState.searchQuery ||
      song.title.toLowerCase().includes(appState.searchQuery) ||
      song.artist.toLowerCase().includes(appState.searchQuery) ||
      song.album.toLowerCase().includes(appState.searchQuery);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state">No songs found matching your search.</div>`;
    return;
  }

  filtered.forEach((song, index) => {
    const currentActiveSong = appState.playlist[appState.currentSongIndex];
    const isActive = currentActiveSong && currentActiveSong.id === song.id;
    const absoluteIndex = appState.playlist.findIndex(s => s.id === song.id);

    const card = document.createElement('div');
    card.className = `song-card ${isActive ? 'active' : ''}`;
    card.style.opacity = '0';
    card.style.animation = `fadeInUp 0.3s ease forwards ${index * 0.04}s`;

    card.innerHTML = `
      <div class="song-image-container">
        <img loading="lazy" src="${song.cover}" alt="${song.title}" class="song-image" onload="this.classList.add('loaded')">
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

    card.onclick = () => playSongAtIndex(absoluteIndex);
    container.appendChild(card);
  });
}

// ==========================================
// 5. AUDIO PLAYBACK OPERATIONS
// ==========================================
function loadSong(index) {
  if (index < 0 || index >= appState.playlist.length) return;

  const song = appState.playlist[index];
  
  // Set source with catch-all fallback check
  audio.src = song.sources[0];
  audio.load();

  // Bottom Player Bar Update
  document.getElementById('player-title').textContent = song.title;
  document.getElementById('player-artist').textContent = song.artist;
  document.getElementById('player-cover').src = song.cover;

  // Sidebar Now Playing Panel Update
  document.getElementById('sp-title').textContent = song.title;
  document.getElementById('sp-artist').textContent = song.artist;
  document.getElementById('sp-art').src = song.cover;

  // Sync all panels views
  renderSidebarQueue();
  updateNextUpQueue();
  renderSongs();

  // Update Background Ambience glows
  updateBackgroundGlow(song.cover);
}

function playAudio() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      appState.isPlaying = true;
      updatePlayControlsUI();
    }).catch(err => {
      console.warn("Source load failed, falling back to sample.mp3:", err);
      showNotification('Playing fallback track (sample.mp3)', 'warning');
      audio.src = 'assets/audio/sample.mp3';
      audio.load();
      audio.play().then(() => {
        appState.isPlaying = true;
        updatePlayControlsUI();
      }).catch(e => {
        console.error("Playback engine failure:", e);
        showNotification('Failed to play fallback track', 'error');
      });
    });
  }
}

function pauseAudio() {
  audio.pause();
  appState.isPlaying = false;
  updatePlayControlsUI();
}

function togglePlay() {
  if (appState.isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function playSongAtIndex(index) {
  appState.currentSongIndex = index;
  loadSong(index);
  playAudio();
}

function playSongById(id) {
  const idx = appState.playlist.findIndex(s => s.id === id);
  if (idx !== -1) playSongAtIndex(idx);
}

function nextSong() {
  if (appState.repeatMode === 'one') {
    audio.currentTime = 0;
    playAudio();
    return;
  }

  const isLast = appState.currentSongIndex === appState.playlist.length - 1;

  if (isLast && appState.repeatMode === 'none') {
    appState.currentSongIndex = 0;
    loadSong(0);
    pauseAudio();
    showNotification('End of playlist', 'info');
    return;
  }

  appState.currentSongIndex = (appState.currentSongIndex + 1) % appState.playlist.length;
  loadSong(appState.currentSongIndex);
  if (appState.isPlaying) playAudio();
}

function prevSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  appState.currentSongIndex = (appState.currentSongIndex - 1 + appState.playlist.length) % appState.playlist.length;
  loadSong(appState.currentSongIndex);
  if (appState.isPlaying) playAudio();
}

function toggleShuffle() {
  appState.isShuffled = !appState.isShuffled;
  const btn = document.getElementById('shuffle-btn');

  if (appState.isShuffled) {
    btn.classList.add('active');
    const current = appState.playlist[appState.currentSongIndex];
    const remaining = appState.playlist.filter(s => s.id !== current.id);
    
    // Fisher-Yates Shuffling
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    appState.playlist = [current, ...remaining];
    appState.currentSongIndex = 0;
    showNotification('Shuffle Active', 'info');
  } else {
    btn.classList.remove('active');
    const current = appState.playlist[appState.currentSongIndex];
    appState.playlist = [...appState.originalPlaylist];
    appState.currentSongIndex = appState.playlist.findIndex(s => s.id === current.id);
    showNotification('Shuffle Inactive', 'info');
  }

  renderSidebarQueue();
  updateNextUpQueue();
}

function toggleRepeat() {
  const btn = document.getElementById('repeat-btn');
  const icon = btn.querySelector('i');

  if (appState.repeatMode === 'none') {
    appState.repeatMode = 'all';
    btn.classList.add('active');
    showNotification('Repeat All Tracks', 'info');
  } else if (appState.repeatMode === 'all') {
    appState.repeatMode = 'one';
    icon.className = 'ri-repeat-one-line';
    showNotification('Repeat One Track', 'info');
  } else {
    appState.repeatMode = 'none';
    btn.classList.remove('active');
    icon.className = 'ri-repeat-line';
    showNotification('Repeat Off', 'info');
  }
}

// ==========================================
// 6. UI & PANEL SYNCHRONIZATION
// ==========================================
function updatePlayControlsUI() {
  const playIcon = document.getElementById('play-btn').querySelector('i');
  if (appState.isPlaying) {
    playIcon.className = 'ri-pause-fill';
    document.getElementById('sp-art').classList.add('playing');
    document.getElementById('sp-css-visualizer').classList.add('playing');
  } else {
    playIcon.className = 'ri-play-fill';
    document.getElementById('sp-art').classList.remove('playing');
    document.getElementById('sp-css-visualizer').classList.remove('playing');
  }
}

function updateVolumeUI() {
  const slider = document.getElementById('volume-slider');
  const volBtn = document.getElementById('volume-btn');

  const percent = appState.volume * 100;
  if (slider) slider.value = percent;

  // Change volume indicator icon
  let iconClass = 'ri-volume-mute-line';
  if (appState.volume > 0.5) {
    iconClass = 'ri-volume-up-line';
  } else if (appState.volume > 0) {
    iconClass = 'ri-volume-down-line';
  }
  
  if (volBtn) volBtn.querySelector('i').className = iconClass;
}

function updateBackgroundGlow(coverPath) {
  const glowElement = document.getElementById('album-art-bg');
  if (glowElement) {
    glowElement.style.backgroundImage = `radial-gradient(circle, rgba(114, 9, 183, 0.25) 0%, transparent 60%), url('${coverPath}')`;
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Notification Toast Alert
function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Trigger animation transition slide
  setTimeout(() => toast.classList.add('show'), 10);

  // Clear toast alert
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 2500);
}

// ==========================================
// 7. UNIFIED RIGHT SIDE PANEL
// ==========================================
function toggleSidebar() {
  const sidebar = document.getElementById('right-sidebar');
  if (!sidebar) return;

  appState.sidebarOpen = !appState.sidebarOpen;
  sidebar.classList.toggle('active', appState.sidebarOpen);
}

function setSidebarTab(tabName) {
  appState.sidebarTab = tabName;
  
  // Highlight Active Trigger Header Button
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Display Matching Content panel
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabName}`);
  });
}

function renderSidebarQueue() {
  const list = document.getElementById('sp-queue-list');
  if (!list) return;

  const upcoming = appState.playlist.slice(appState.currentSongIndex + 1);

  if (upcoming.length === 0) {
    list.innerHTML = `<p style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">Play queue is empty</p>`;
  } else {
    list.innerHTML = upcoming.map((song, i) => `
      <div class="queue-item" onclick="playSongAtIndex(${appState.currentSongIndex + 1 + i})">
        <img src="${song.cover}" alt="${song.title}">
        <div class="queue-info">
          <h5>${song.title}</h5>
          <p>${song.artist}</p>
        </div>
      </div>
    `).join('');
  }

  // Render Current track
  const current = appState.playlist[appState.currentSongIndex];
  const currentWrapper = document.getElementById('sp-queue-current');
  if (currentWrapper && current) {
    currentWrapper.innerHTML = `
      <div class="queue-item active">
        <img src="${current.cover}" alt="${current.title}">
        <div class="queue-info">
          <h5>${current.title}</h5>
          <p>${current.artist}</p>
        </div>
      </div>
    `;
  }
}

function updateNextUpQueue() {
  const list = document.getElementById('sp-next-up-list');
  if (!list) return;

  // Render next 3 songs as quick preview
  const nextSongs = appState.playlist.slice(appState.currentSongIndex + 1, appState.currentSongIndex + 4);

  if (nextSongs.length === 0) {
    list.innerHTML = `<p style="color:var(--text-muted); font-size:0.8rem;">End of queue</p>`;
    return;
  }

  list.innerHTML = nextSongs.map((song, i) => `
    <div class="queue-item" onclick="playSongAtIndex(${appState.currentSongIndex + 1 + i})">
      <img src="${song.cover}" alt="${song.title}">
      <div class="queue-info">
        <h5>${song.title}</h5>
        <p>${song.artist}</p>
      </div>
    </div>
  `).join('');
}

function clearQueue() {
  if (appState.playlist.length > appState.currentSongIndex + 1) {
    appState.playlist.splice(appState.currentSongIndex + 1);
    showNotification('Queue cleared', 'info');
    renderSidebarQueue();
    updateNextUpQueue();
  } else {
    showNotification('No upcoming tracks in queue', 'info');
  }
}

// ==========================================
// 8. INTERACTIVE INPUT HANDLERS & BINDINGS
// ==========================================
function setupListeners() {
  // Mini Player Bar buttons
  document.getElementById('play-btn').addEventListener('click', togglePlay);
  document.getElementById('prev-btn').addEventListener('click', prevSong);
  document.getElementById('next-btn').addEventListener('click', nextSong);
  document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
  document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);

  // Clicking bottom player cover or info panel toggles sidebar Player view
  document.getElementById('player-left-clickable').addEventListener('click', () => {
    toggleSidebar();
    setSidebarTab('now-playing');
  });

  // Sidebar controls
  document.getElementById('sidebar-toggle-btn').addEventListener('click', toggleSidebar);
  document.getElementById('close-sidebar-btn').addEventListener('click', toggleSidebar);

  // Sidebar header tabs clicks
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      setSidebarTab(e.target.dataset.tab);
    });
  });

  // Clear Queue
  const spClearBtn = document.getElementById('sp-clear-queue-btn');
  if (spClearBtn) spClearBtn.addEventListener('click', clearQueue);

  // Quality settings toggles
  const qualitySelect = document.getElementById('settings-quality');
  if (qualitySelect) {
    qualitySelect.addEventListener('change', (e) => {
      localStorage.setItem('audioQuality', e.target.value);
      showNotification(`Audio Quality: ${e.target.value.toUpperCase()}`, 'success');
    });
  }
  const crossfadeCb = document.getElementById('settings-crossfade');
  if (crossfadeCb) {
    crossfadeCb.addEventListener('change', (e) => {
      localStorage.setItem('crossfade', e.target.checked);
      showNotification(`Crossfade ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'success');
    });
  }
  const normalizeCb = document.getElementById('settings-normalize');
  if (normalizeCb) {
    normalizeCb.addEventListener('change', (e) => {
      localStorage.setItem('normalize', e.target.checked);
      showNotification(`Volume Normalization ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'success');
    });
  }

  // Gear Settings dropdown toggle
  const settingsBtn = document.getElementById('sp-settings-btn');
  const dropdown = document.getElementById('sp-settings-dropdown');
  if (settingsBtn && dropdown) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });
    // Click outside closing dropdown
    window.addEventListener('click', () => {
      dropdown.classList.remove('active');
    });
  }

  // Volume Slider slider input
  const volSlider = document.getElementById('volume-slider');
  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      appState.volume = e.target.value / 100;
      audio.volume = appState.volume;
      updateVolumeUI();
      localStorage.setItem('neon_volume', appState.volume);
    });
  }

  // Volume Mute Button toggle
  const volumeBtn = document.getElementById('volume-btn');
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      if (audio.volume > 0) {
        appState.savedVolume = appState.volume;
        appState.volume = 0;
      } else {
        appState.volume = appState.savedVolume || 0.7;
      }
      audio.volume = appState.volume;
      updateVolumeUI();
      localStorage.setItem('neon_volume', appState.volume);
    });
  }

  // Audio HTML5 Core playback events
  audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    if (isNaN(duration)) return;

    const percent = (currentTime / duration) * 100;
    
    // Update seeking visual filled track
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${percent}%`;

    // Time progress labels
    document.getElementById('time-current').textContent = formatTime(currentTime);
    document.getElementById('time-total').textContent = formatTime(duration);
  });

  audio.addEventListener('ended', nextSong);

  // Clickable Seek Bar Seeking
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.addEventListener('click', function (e) {
      const clickX = e.offsetX;
      const width = this.clientWidth;
      if (audio.duration) {
        audio.currentTime = (clickX / width) * audio.duration;
      }
    });
  }

  // Grid/List View switcher toggles
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.view = btn.dataset.view;
      renderSongs();
    });
  });

  // Search filter typing input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.trim().toLowerCase();
      
      const clearBtn = document.getElementById('clear-search');
      if (clearBtn) {
        clearBtn.style.display = appState.searchQuery ? 'block' : 'none';
      }
      renderSongs();
    });
  }

  // Clear Search button clicks
  const clearSearchBtn = document.getElementById('clear-search');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      const input = document.getElementById('search-input');
      input.value = '';
      appState.searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderSongs();
    });
  }

  // Local music file system imports
  const importBtn = document.getElementById('import-music-btn');
  const fileInput = document.getElementById('local-folder-input');

  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFolderImport);
  }
}

// Local music importer folder reader
function handleFolderImport(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  let count = 0;

  Array.from(files).forEach(file => {
    const isAudioType = file.type.startsWith('audio/');
    const isAudioExt = /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(file.name);

    if (isAudioType || isAudioExt) {
      const trackTitle = file.name.replace(/\.[^/.]+$/, "");
      const localTrack = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: trackTitle, // Strip ext
        artist: "Local Track",
        album: "Local Folder",
        cover: generateCoverArt(trackTitle, "Local Track"),
        sources: [URL.createObjectURL(file)],
        duration: "Local"
      };

      appState.playlist.push(localTrack);
      appState.originalPlaylist.push(localTrack);
      count++;
    }
  });

  if (count > 0) {
    showNotification(`Successfully imported ${count} local tracks`, 'success');
    renderSongs();
    renderSidebarQueue();
  } else {
    showNotification('No audio tracks found in directory', 'warning');
  }
}

// ==========================================
// 9. SETTINGS PREFERENCE LOADER
// ==========================================
function loadSettings() {
  try {
    const vol = localStorage.getItem('neon_volume');
    if (vol !== null) {
      appState.volume = parseFloat(vol);
      audio.volume = appState.volume;
    } else {
      audio.volume = appState.volume; // 0.7 default
    }

    const quality = localStorage.getItem('audioQuality') || 'high';
    const qualSelect = document.getElementById('settings-quality');
    if (qualSelect) qualSelect.value = quality;

    const crossfade = localStorage.getItem('crossfade') === 'true';
    const crossCb = document.getElementById('settings-crossfade');
    if (crossCb) crossCb.checked = crossfade;

    const normalize = localStorage.getItem('normalize') === 'true';
    const normCb = document.getElementById('settings-normalize');
    if (normCb) normCb.checked = normalize;

  } catch (err) {
    console.warn("Could not read localStorage settings:", err);
  }
}

// ==========================================
// 10. NAVBAR SCROLL-SPY
// ==========================================
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// ==========================================
// 11. CANVAS ALBUM ART GENERATOR
// ==========================================
function generateCoverArt(title, artist) {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  // Deterministic hash for unique colors per song
  let hash = 0;
  const seed = title + artist;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }

  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 45 + Math.abs((hash >> 8) % 40)) % 360;

  // Gradient background
  const bg = ctx.createLinearGradient(0, 0, 400, 400);
  bg.addColorStop(0, `hsl(${hue1}, 55%, 18%)`);
  bg.addColorStop(1, `hsl(${hue2}, 65%, 8%)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 400, 400);

  // Radial glow accent
  const glow = ctx.createRadialGradient(200, 160, 20, 200, 160, 180);
  glow.addColorStop(0, `hsla(${hue1}, 70%, 50%, 0.2)`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 400, 400);

  // Decorative circles
  for (let i = 0; i < 3; i++) {
    const cx = 80 + Math.abs((hash >> (i * 4)) % 240);
    const cy = 60 + Math.abs((hash >> (i * 3 + 2)) % 200);
    const r = 30 + Math.abs((hash >> (i * 5)) % 60);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(hue1 + i * 80) % 360}, 60%, 50%, 0.08)`;
    ctx.fill();
  }

  // Music note icon
  ctx.font = '72px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `hsla(${hue1}, 50%, 65%, 0.25)`;
  ctx.fillText('\u266B', 200, 150);

  // Song title
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.textBaseline = 'bottom';
  let displayTitle = title;
  if (ctx.measureText(displayTitle).width > 340) {
    displayTitle = displayTitle.substring(0, 18) + '\u2026';
  }
  ctx.fillText(displayTitle, 200, 300);

  // Artist name
  ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.textBaseline = 'top';
  ctx.fillText(artist, 200, 310);

  // Top accent line
  ctx.strokeStyle = `hsla(${hue1}, 70%, 55%, 0.35)`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, 55);
  ctx.lineTo(300, 55);
  ctx.stroke();

  return canvas.toDataURL('image/jpeg', 0.85);
}

function generateAllCovers() {
  appState.playlist.forEach((song, i) => {
    // Generate unique canvas cover art for every single track in the database!
    const newCover = generateCoverArt(song.title, song.artist);
    appState.playlist[i].cover = newCover;
    appState.originalPlaylist[i].cover = newCover;
  });

  // Re-render with new unique covers
  renderSongs();
  loadSong(appState.currentSongIndex);
}

// ==========================================
// 12. MOBILE NAVIGATION TOGGLE
// ==========================================
function setupMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('mobile-active');
      const icon = toggle.querySelector('i');
      icon.className = menu.classList.contains('mobile-active')
        ? 'ri-close-line'
        : 'ri-menu-line';
    });

    // Close menu on nav link click
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('mobile-active');
        toggle.querySelector('i').className = 'ri-menu-line';
      });
    });
  }
}