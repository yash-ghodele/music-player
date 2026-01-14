# Neon Beats 🎵

**Neon Beats** is a premium, web-based music player and conceptual instrument store built with modern web technologies. It features a stunning glassmorphism design, real-time audio visualization, and a fully offline-capable architecture.

![Neon Beats Preview](assets/images/MidnightCity.jpg)

## ✨ Key Features

### 🎧 Advanced Music Player
- **Immersive Experience**: Full-screen "Expanded Mode" with circular progress visualization and orbital controls.
- **Audio Visualizer**: Real-time frequency analysis bars that dance to the music (Web Audio API).
- **Smart Queue**: Manage upcoming tracks with a slide-out queue sidebar.
- **Local Music Support**: Import your own MP3 folder and play your personal library seamlessly.

### 🎨 Premium Design
- **Glassmorphism UI**: Modern, translucent aesthetics with neon gradients (`#f72585`, `#7209b7`).
- **Bento Grid Layout**: A visually engaging "About" section showcasing core features.
- **Responsive**: Fully optimized for desktop, tablet, and mobile experiences.

### 🛍️ Gear Store (Concept)
- **Product Catalog**: Browse premium musical instruments (Guitars, Synths, Drums).
- **Quick View**: detailed product modals with rating and specs.
- **Cart System**: Functional shopping cart state with checkout simulation.

### 🌐 Offline Ready
- **Zero Dependencies**: Pure HTML/CSS/JS. No heavy frameworks.
- **Offline Assets**: All images and icons are cached locally (`assets/images`), ensuring the app looks great even without internet.

## 🚀 How to Run

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yash-ghodele/music-player.git
    cd music-player
    ```

2.  **Open in Browser**:
    Simply open `index.html` in Chrome, Edge, or Firefox.

    *Note: For the best experience with the Audio Visualizer and Local File Import, it's recommended to run a local server to avoid browser security restrictions:*
    ```bash
    # If you have Python
    python -m http.server

    # If you have Node.js
    npx serve
    ```

## 🛠️ Technologies
- **HTML5**: Semantic structure.
- **CSS3**: Variables, Flexbox/Grid, Animations.
- **JavaScript (ES6+)**: AudioContext, LocalStorage, DOM Manipulation.
- **Remix Icon**: For vector icons.

## 📷 Screenshots

| Expanded Player | Bento Detail |
|-----------------|--------------|
| *Immersive full-screen playback* | *Modern feature grid* |

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

---
Made with ❤️ by [Yash Ghodele](https://github.com/yash-ghodele)
