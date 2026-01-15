# System Architecture

## Overview
Neon Beats is a single-page application (SPA) built with vanilla HTML, CSS, and JavaScript. It avoids heavy frameworks to maximize performance and portability.

## File Structure

### 1. `index.html`
The semantic backbone of the application.
- **Sections**: Hero, Store (Grid), Library (List), About (Bento Grid), Newsletter.
- **Modals**: `#quick-view-modal` (Product details), `#checkout-modal` (Cart), `#expanded-player` (Full-screen UI).
- **Core Components**: Navbar, Fixed Bottom Player, Footer.

### 2. `styles.css`
Contains all visual styling, organized by component.
- **Variables**: CSS Custom Properties (`:root`) define the theme colors (`--primary`, `--surface`, etc.) and spacing.
- **Glassmorphism**: Extensive use of `backdrop-filter: blur()` and `rgba` backgrounds.
- **Animations**: Keyframes for `fadeInUp`, `pulse`, and `spin`.
- **Media Queries**: Responsive breakpoints at 1024px, 768px, and 480px.

### 3. `script.js`
Handles the application state and logic.

#### State Management (`appState`)
A centralized state object tracks:
- `playlist`: Array of current songs.
- `currentSongIndex`: Integer pointer.
- `cart`: Array of items in the shopping cart.
- `favorites`: Array of favored song IDs.
- `audioContext`: Web Audio API context for the visualizer.

#### Key Functions
- **`loadSong(index)`**: Handles audio source loading, metadata updates, and fallback logic if a source fails.
- **`renderSongs()`**: Dynamically builds the song list based on search/filter state.
- **`updateExpandedPlayerUI()`**: Syncs the full-screen overlay with the currently playing track.
- **`handleLocalFiles(files)`**: Processes user-uploaded MP3s and images to create local song objects.
- **`initVisualizer()`**: Connects the Audio element to the Canvas analyser for real-time graphics.

## Data Persistence
The app uses the browser's `localStorage` to save:
- **`neon_favorites`**: IDs of liked songs
- **`neon_cart`**: Current shopping cart contents
- **`neon_volume`**: Last used volume level
- **`audioQuality`**: Selected audio quality (high/medium/low)
- **`crossfade`**: Crossfade enabled/disabled state
- **`normalize`**: Volume normalization enabled/disabled state

This ensures a continuity of experience across reloads.

## Recent Improvements (v1.0)
- Enhanced keyboard shortcuts with volume control and playback toggles
- Download and share functionality using Web Share API
- Settings menu with persistent user preferences
- Improved expanded player with clickable progress bar
- Quick action buttons for playlist management
- Fixed panel close button reliability
