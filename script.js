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
  cart: [],
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

const products = [
  {
    id: 'p1',
    title: "Fender Stratocaster - Neon Edition",
    price: 1499.99,
    category: "guitars",
    image: "assets/images/fender_strat.jpg",
    rating: 4.9,
    description: "The classic Strat sound with a futuristic neon finish. Maple neck, alder body, and custom shop pickups."
  },
  {
    id: 'p2',
    title: "Roland Synthesis Keyboard",
    price: 899.99,
    category: "keyboards",
    image: "assets/images/roland_synth.jpg",
    rating: 4.8,
    description: "A powerhouse synthesizer with over 2000 sounds and intuitive controls for live performance."
  },
  {
    id: 'p3',
    title: "Yamaha Stage Drum Kit",
    price: 1299.99,
    category: "drums",
    image: "assets/images/yamaha_drums.jpg",
    rating: 4.7,
    description: "Professional birch shells for recording and touring. Includes hardware and cymbals."
  },
  {
    id: 'p4',
    title: "Audio-Technica Master Headphones",
    price: 199.99,
    category: "accessories",
    image: "assets/images/audiotechnica.jpg",
    rating: 4.9,
    description: "Reference quality open-back headphones for mixing and mastering."
  },
  {
    id: 'p5',
    title: "Gibson Les Paul Standard",
    price: 2499.99,
    category: "guitars",
    image: "assets/images/gibson_lespaul.jpg",
    rating: 5.0,
    description: "The iconic rock machine. Mahogany body with maple top for sustain and bite."
  },
  {
    id: 'p6',
    title: "Shure SM7B Vocal Mic",
    price: 399.99,
    category: "accessories",
    image: "assets/images/shure_sm7b.jpg",
    rating: 4.8,
    description: "The podcast and vocal standard. smooth, flat, wide-range frequency response."
  },
  {
    id: 'p7',
    title: "Korg Minilogue Poly-Synth",
    price: 549.99,
    category: "keyboards",
    image: "assets/images/korg_minilogue.jpg",
    rating: 4.6,
    description: "Next-gen analog synthesizer with 4-voice polyphony and built-in delay."
  },
  {
    id: 'p8',
    title: "Martin D-28 Acoustic",
    price: 2999.99,
    category: "guitars",
    image: "assets/images/martin_d28.jpg",
    rating: 5.0,
    description: "The dreadnought by which all others are judged. Sitka spruce top and rosewood back."
  },
  {
    id: 'p9',
    title: "Pioneer DJ Controller",
    price: 800.00,
    category: "accessories",
    image: "assets/images/pioneer_dj.jpg",
    rating: 4.7,
    description: "4-channel performance DJ controller for rekordbox dj."
  }
];



// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Load saved state from localStorage
  try {
    // Theme removed

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      appState.cart = JSON.parse(savedCart);
    }

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
  updateCartUI();
  updateVolumeUI();

  // Load initial song
  loadSong(appState.currentSongIndex);

  // Setup Listeners
  setupPlayerListeners();
  setupEventListeners();

  // Remove loading overlay (fast!)
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
});

// ==========================================
// Rendering Components
// ==========================================
function renderSongs() {
  const container = document.getElementById('songs-container');
  container.className = `songs-container ${appState.view}-view`;
  container.innerHTML = '';

  const filteredSongs = appState.playlist.filter(song => {
    // Filter by category
    const categoryMatch = appState.filter === 'all' ||
      (appState.filter === 'favorites' && appState.favorites.includes(song.id)) ||
      song.category.includes(appState.filter);

    // Filter by search
    const searchMatch = !appState.searchQuery ||
      song.title.toLowerCase().includes(appState.searchQuery) ||
      song.artist.toLowerCase().includes(appState.searchQuery) ||
      song.album.toLowerCase().includes(appState.searchQuery);

    return categoryMatch && searchMatch;
  });

  if (filteredSongs.length === 0) {
    container.innerHTML = `<div class="empty-state">No songs found matching your criteria.</div>`;
    return;
  }

  filteredSongs.forEach((song, index) => {
    // Determine if this song is currently playing or selected
    const isActive = appState.playlist[appState.currentSongIndex].id === song.id;
    const isFavorite = appState.favorites.includes(song.id);

    // Find absolute index in the main playlist for playing
    const absoluteIndex = appState.playlist.findIndex(s => s.id === song.id);

    const card = document.createElement('div');
    card.className = `song-card ${isActive ? 'active' : ''}`;
    card.dataset.id = song.id;
    card.dataset.index = absoluteIndex;

    // Staggered Animation
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

    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      playSongAtIndex(absoluteIndex);
    });
    container.appendChild(card);
  });
}

function renderProducts(filter = 'all') {
  const container = document.getElementById('products-grid');
  container.innerHTML = '';

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  filteredProducts.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Staggered Animation
    card.style.opacity = '0';
    card.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.05}s`;

    card.innerHTML = `
      <div class="product-image">
        <img loading="lazy" src="${product.image}" alt="${product.title}" loading="lazy">
        <div class="product-overlay">
          <button type="button" class="btn-icon" onclick="addToCart('${product.id}')" title="Add to Cart">
            <i class="ri-shopping-cart-2-line"></i>
          </button>
          <button type="button" class="btn-icon" onclick="openQuickView('${product.id}')" title="Quick View">
            <i class="ri-eye-line"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rating">
          ${getStarRating(product.rating)}
        </div>
        <div class="product-price">$${product.price}</div>
      </div>
    `;

    container.appendChild(card);
  });
}



function getStarRating(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="ri-star-fill" style="color: #fca311; font-size: 0.8rem"></i>';
    } else if (i - 0.5 <= rating) {
      stars += '<i class="ri-star-half-fill" style="color: #fca311; font-size: 0.8rem"></i>';
    } else {
      stars += '<i class="ri-star-line" style="color: #666; font-size: 0.8rem"></i>';
    }
  }
  return stars;
}

// ==========================================
// Music Player Logic
// ==========================================
const audio = document.getElementById('audio-player');

function loadSong(index) {
  appState.currentSongIndex = index; // Ensure currentSongIndex is updated
  const song = appState.playlist[index];
  if (!song) return;

  document.getElementById('player-title').textContent = song.title;
  document.getElementById('player-artist').textContent = song.artist;
  document.getElementById('player-cover').src = song.cover;

  // Set first source by default for metadata
  // If it's 404, it might error, but we'll catch it on play
  audio.src = song.sources[0];

  renderSongs(); // Re-render to highlight active song

  // Update favorite button
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

  // Sync expanded player heart
  const expandedHeart = document.getElementById('expanded-heart');
  if (expandedHeart) {
    expandedHeart.className = isFavorite ? 'ri-heart-fill' : 'ri-heart-line';
  }

  // Setup media session with multiple artwork sizes
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
}

async function playWithFallback(song) {
  let played = false;

  // Try each source
  for (let i = 0; i < song.sources.length; i++) {
    try {
      console.log(`Trying source ${i + 1}: ${song.sources[i]}`);
      audio.src = song.sources[i];
      await audio.play();
      played = true;
      appState.isPlaying = true;
      updatePlayButton();

      // Initialize visualizer if needed
      if (!appState.audioContext) {
        initVisualizer();
      }
      break; // Success, exit loop
    } catch (e) {
      console.warn(`Source ${i + 1} failed:`, e);
      // Continue to next source
    }
  }

  if (!played) {
    appState.isPlaying = false;
    updatePlayButton();
    showNotification('All sources failed for this song.', 'error');

    // Auto skip to next song if this one is broken?
    // Maybe not, might cause infinite loop if all broken.
  }
}

function playSongAtIndex(index) {
  appState.currentSongIndex = index;
  const song = appState.playlist[index];

  // Update UI immediately (optimistic)
  // loadSong already updates player info and re-renders songs/queue
  loadSong(index);

  playWithFallback(song);
}

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

function pauseAudio() {
  audio.pause();
  appState.isPlaying = false;
  updatePlayButton();
}

function togglePlay() {
  if (appState.isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function prevSong() {
  appState.currentSongIndex--;
  if (appState.currentSongIndex < 0) {
    appState.currentSongIndex = appState.playlist.length - 1;
  }
  loadSong(appState.currentSongIndex);
  if (appState.isPlaying) playAudio();
}

function nextSong() {
  appState.currentSongIndex++;
  if (appState.currentSongIndex > appState.playlist.length - 1) {
    appState.currentSongIndex = 0;
  }
  loadSong(appState.currentSongIndex);
  if (appState.isPlaying) playAudio();
}

function toggleShuffle() {
  appState.isShuffled = !appState.isShuffled;
  const btn = document.getElementById('shuffle-btn');
  const expandedBtn = document.getElementById('expanded-shuffle-btn');

  if (appState.isShuffled) {
    // Fisher-Yates shuffle
    const currentSong = appState.playlist[appState.currentSongIndex];
    let shuffled = [...appState.playlist];

    // Remove current song
    shuffled = shuffled.filter(s => s.id !== currentSong.id);

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Add current song back at start
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

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateProgress(e) {
  const { duration, currentTime } = audio;
  const progressPercent = (currentTime / duration) * 100;

  if (isNaN(duration)) return;

  // Main Player Progress Bar
  document.getElementById('progress-fill').style.width = `${progressPercent}%`;
  document.getElementById('time-current').textContent = formatTime(currentTime);
  document.getElementById('time-total').textContent = formatTime(duration);

  // Expanded Player Progress Ring
  const circle = document.getElementById('circle-progress');
  if (circle) {
    const radius = circle.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  // Expanded Time Display
  const expTime = document.getElementById('expanded-time');
  if (expTime) expTime.textContent = formatTime(currentTime);
}

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
    document.getElementById('visualizer-panel').classList.remove('panel-open');
    appState.visualizerActive = false;
  });

  // Queue toggle
  document.getElementById('queue-btn').addEventListener('click', () => {
    document.getElementById('queue-panel').classList.add('panel-open');
    renderQueue();
  });

  document.getElementById('close-queue').addEventListener('click', () => {
    document.getElementById('queue-panel').classList.remove('panel-open');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Only if not typing in an input
    if (e.target.tagName === 'INPUT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowLeft') {
      prevSong();
    } else if (e.code === 'ArrowRight') {
      nextSong();
    }
  });

  // Expanded Player Sync (only if elements exist)
  const expandedPlayBtn = document.getElementById('expanded-play-btn');
  const expandedPrevBtn = document.getElementById('expanded-prev-btn');
  const expandedNextBtn = document.getElementById('expanded-next-btn');

  if (expandedPlayBtn) expandedPlayBtn.addEventListener('click', togglePlay);
  if (expandedPrevBtn) expandedPrevBtn.addEventListener('click', prevSong);
  if (expandedNextBtn) expandedNextBtn.addEventListener('click', nextSong);
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

  // Store Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.dataset.filter;

      // Update UI
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter products
      renderProducts(filter);
    });
  });

  // View Toggle (Grid/List)
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      appState.view = this.dataset.view;
      renderSongs();
    });
  });

  // Cart Toggle
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) cartBtn.addEventListener('click', toggleCart);

  const closeCartBtn = document.getElementById('close-cart');
  if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);

  // Checkout Button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);

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
// Shopping Cart
// ==========================================
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = appState.cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
    showNotification('Quantity updated!', 'info');
  } else {
    appState.cart.push({ ...product, quantity: 1 });
    showNotification(`${product.title} added to cart!`, 'success');
  }

  updateCartUI();
  saveStateToStorage();
}

function removeFromCart(id) {
  appState.cart = appState.cart.filter(item => item.id !== id);
  updateCartUI();
  saveStateToStorage();
}

function updateCartUI() {
  const container = document.querySelector('.cart-items');
  if (!container) return;
  container.innerHTML = '';

  let total = 0;
  let count = 0;

  appState.cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img loading="lazy" src="${item.image}" alt="${item.title}">
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <div class="cart-item-price">$${item.price.toLocaleString()} x ${item.quantity}</div>
      </div>
      <button class="remove-btn" onclick="removeFromCart('${item.id}')">
        <i class="ri-close-line"></i>
      </button>
    `;
    container.appendChild(cartItem);
  });

  // Update Total
  const totalEl = document.getElementById('cart-total-display');
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);

  // Update Badge
  const badges = document.querySelectorAll('.cart-count');
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
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
  localStorage.setItem('neonBeats_cart', JSON.stringify(appState.cart));
}

function loadStateForStorage() {
  const favorites = localStorage.getItem('neonBeats_favorites');
  if (favorites) appState.favorites = JSON.parse(favorites);

  const cart = localStorage.getItem('neonBeats_cart');
  if (cart) appState.cart = JSON.parse(cart);
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
