# Neon Beats - Project Documentation

## 1. Project Overview
**Neon Beats** is a hybrid web application that combines a premium music player with an e-commerce music store. It features a modern, "glassmorphism" design aesthetic, real-time audio visualization, and a fully functional shopping cart system. The application runs on a lightweight Python HTTP server to handle local assets and CORS requirements.

## 2. Tech Stack

### Frontend
*   **HTML5**: Provides the semantic structure for the application, divided into sections for Home, Store, Library, and Player.
*   **CSS3 (Custom)**:
    *   **Glassmorphism Design**: Heavily relies on `backdrop-filter: blur()`, semi-transparent backgrounds, and vibrant neon accents.
    *   **Animations**: uses CSS `@keyframes` for fade-ins, sliding panels, and interactive hover effects.
    *   **Responsive Design**: Fully responsive layout using Flexbox and Grid.
*   **Vanilla JavaScript (ES6+)**:
    *   **No Frameworks**: Pure JavaScript manages all state, DOM manipulation, and logic.
    *   **Web Audio API**: Powered the real-time visualizer and advanced audio handling.
    *   **LocalStorage**: Persists user data like Favorites and Shopping Cart between sessions.

### Backend / Infrastructure
*   **Python 3**: Uses `http.server` to serve static files.
    *   **CORS Handling**: Custom Python script (`server.py`) handles Cross-Origin Resource Sharing to allow the Web Audio API to analyze audio data from local files.
*   **Asset Management**:
    *   `assets/audio/`: Stores MP3 files (and fallback samples).
    *   `assets/images/`: Stores album art and product images.

## 3. Features

### 🎵 Music Player
*   **Core Playback**: Play, Pause, Next, Previous, Shuffle (Fisher-Yates algorithm), and Repeat (One/All/None).
*   **Smart Fallback System**: Automatically switches to a universal sample track if a requested song file is missing, ensuring uninterrupted playback.
*   **Expanded Player**: A full-screen overlay mode featuring:
    *   Circular progress ring.
    *   Large album art.
    *   "Next Up" queue sidebar.
*   **Audio Visualizer**: Real-time frequency bars that react to the music beat using `AnalyserNode`.
*   **Queue Management**: View upcoming songs, clear queue, and see "Now Playing".
*   **Media Session API**: Integrates with OS-level media controls (play/pause from keyboard or lock screen).

### 🛒 Music Store
*   **Product Catalog**: Browsable grid of musical instruments and accessories (Guitars, Keyboards, Drums, etc.).
*   **Filtering**: Filter products by category (e.g., "Guitars", "Accessories").
*   **Shopping Cart**:
    *   Add items to cart.
    *   Real-time total calculation.
    *   Checkout simulation process.
*   **Quick View**: Modal popup for detailed product information and ratings.

### ⚙️ System & UI
*   **Search & Filtering**: Real-time filtering of the song library by Title, Artist, or Album, plus category tags (Popular, Rock, Pop, etc.).
*   **Local Music Import**: Ability to select local files (stubbed functionality for browser security context).
*   **Responsive Panels**: Slide-out panels for the Queue, Visualizer, and Cart.
*   **Keyboard Shortcuts**:
    *   `Space`: Play/Pause
    *   `Arrows`: Next/Prev, Volume Up/Down
    *   `M`: Mute
    *   `S`: Shuffle
    *   `R`: Repeat

## 4. How It Works

### Application State
A central `appState` object tracks the entire application status:
```javascript
const appState = {
  currentSongIndex: 0,
  isPlaying: false,
  cart: [],
  favorites: [],
  // ...and more
};
```
Changes to this state trigger UI render functions like `renderSongs()`, `updateCartUI()`, and `updatePlayButton()`.

### Audio Engine
1.  **Loading**: `loadSong(index)` sets the `audio.src` and updates metadata.
2.  **Playback**: `playWithFallback(song)` attempts to play the primary source. If it fails (e.g., file not found), it catches the error and seamlessly plays `sample.mp3` instead, notifying the user via a toast message.
3.  **Visualization**: An `AudioContext` is created on the first user interaction. The audio source is connected to an `AnalyserNode`, which provides frequency data to a `requestAnimationFrame` loop that draws bars on the `<canvas>`.

### Store Logic
*   **Data Structure**: Products are defined in a static `products` array.
*   **Cart Operations**: Adding an item pushes it to `appState.cart` and saves to `localStorage`. The UI updates immediately to show the badge count and total price.
*   **Checkout**: A simulated checkout process validates inputs and clears the cart upon "success".

## 5. Directory Structure
```
Music Player/
├── index.html          # Main application entry point
├── styles.css          # All styling and glassmorphism effects
├── script.js           # Core logic (State, Player, Store, Visualizer)
├── queue-sidebar.js    # Logic specific to the sidebars
├── server.py           # Python server for local development
├── assets/             # Images and Audio files
└── docs/               # Detailed documentation files
```
