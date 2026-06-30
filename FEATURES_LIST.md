# Neon Beats - Rebuild Feature Specification

This document details the refined features list for the refactored, fresh version of Neon Beats, incorporating the user's modifications (features removed, and overlays consolidated into a side panel).

---

## 1. General & Layout Features
- **Glassmorphism Design**: Dark cyberpunk theme utilizing translucent elements (`rgba`), backdrop blurs (`backdrop-filter`), and distinct neon accents (hot-pink, deep-purple, cyan).
- **Animations & Microinteractions**: Hover scaling on buttons/cards, animated background scale (`bgZoom`) in the hero section, scroll indicator bounces, and active visualizer bar animations.
- **Sticky Navigation Bar**: Top navigation bar with logo branding, nav links (Home, Library, Playlists, About), and Sign In controls.
- **Hero Section**: Large neon title text, quick call-to-action button to jump to the library, and stats counters (Songs, Artists, Users).
- **About Bento Section**: Bento grid layout illustrating Hi-Fi Audio (lossless quality card), Animated Visualizer (with animated mini frequency bars), and Offline Mode support.
- **Site Footer**: Navigation links, support resources, social links, contact info, and copyright tags.

## 2. Music Player & Bottom Bar
- **Floating Bottom Player Bar (Spotify-like layout)**:
  - Details card showing current song's art, title, and artist. Clicking the cover art toggles the Right Side Panel.
  - Playback controls: Play/Pause, Previous, Next, Shuffle, Repeat cycle.
  - Clickable linear progress bar showing current time and track duration.
  - Volume slider and Mute button.
  - **Panel Toggle Buttons**: Buttons to toggle the unified Right Side Panel and select its active tab (Now Playing, Queue, or Visualizer).

## 3. Unified Right Side Panel
Toggled via buttons in the bottom player bar or clicking the album cover. Slides out from the right side and contains three tabbed sections:
- **Tab 1: Now Playing**:
  - Large cover art (pulsing/breathing when playing).
  - Title and artist name.
  - Settings dropdown (gear icon) supporting:
    - Audio Quality selection (High, Medium, Low).
    - Crossfade toggle.
    - Volume Normalization toggle.
  - "Next Up" queue preview list.
- **Tab 2: Queue**:
  - Lists "Now Playing" and upcoming tracks.
  - "Clear Queue" button.
- **Tab 3: Visualizer**:
  - Hosting a beautiful, high-performance CSS-animated frequency bar visualizer that bounces dynamically when music is playing.

## 4. State & Playback Engine Logic
- **Audio Engine Control**: Built on a hidden `<audio>` element with robust play, pause, seek, and track-advancement operations.
- **Universal Fallback Handler**: Fallback handling that plays `sample.mp3` with warning notifications if a requested local song file is missing.
- **Repeat Modes**: Support for Repeat Off (stops/pauses after the last track ends), Repeat All, and Repeat One.
- **Shuffle Mode**: Fisher-Yates shuffling algorithm that shuffles the playlist order (preserving current playing song at position 0) and restores the original catalog order when turned off.
- **Settings Persistence**: Saves and loads variables (`neon_volume`, `audioQuality`, `crossfade`, `normalize`) to/from `localStorage` for continuity across sessions.

## 5. Interactive & Input Features
- **Search Engine**: Real-time debounce search scanning titles, artists, and albums as the user types.
- **Local Music Import**:
  - Directory folder imports via webkit file selection.
  - Robust check for audio types and file extensions (`.mp3`, `.wav`, `.ogg`, `.m4a`, `.flac`, `.aac`).
  - Generates object URLs and updates the current playlist and original catalog.
- **Library View Control**: Grid or List view toggling for browsing songs.

---

## 🚫 Removed Features (Per User Request)
- Newsletter Subscription Card and form.
- Action buttons (Like, Download, Share, Add-to-Playlist, Queue Next) from bottom bar, cards, and panels.
- Real-Time Web Audio API Visualizer Engine (replaced by CSS-animated visualizer).
- Media Session API integrations.
- Category filter tabs in the library (replaced by unified view with search).
- Global keyboard shortcuts.
- Track Download.
- Web Share.
