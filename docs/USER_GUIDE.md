# User Guide

## Getting Started
Start the server using `START_SERVER.bat` or `python server.py` and open http://localhost:8000 in your browser. No account required.

## Music Player

### Basic Controls
- **Play/Pause**: Click the center button or press `Spacebar`
- **Skip Track**: Click Next/Prev arrows or use `Left`/`Right` arrow keys
- **Volume**: Drag the volume slider or use `Up`/`Down` arrow keys
- **Download**: Click download button (📥) to save the current track
- **Share**: Click share button (🔗) to share via Web Share API or copy link
- **Add to Playlist**: Click playlist+ button to add song to favorites
- **Queue Next**: Click list button to queue song after current track

### Expanded Mode
Click the **Album Art** in the bottom player to enter **Expanded Mode**.
- **Circular Progress Ring**: Visual progress indicator
- **Linear Progress Bar**: Click anywhere to seek to that position
- **Volume Controls**: Dedicated volume slider and mute button
- **Settings Menu**: Click gear icon (⚙️) for:
  - Audio Quality (High/Medium/Low)
  - Crossfade toggle
  - Normalize Volume toggle
- **Next Up**: View upcoming songs in the sidebar
- **Minimize**: Click the down arrow to return to normal view

### Offline Music (Local Files)
You can play your own MP3s directly in the app:
1. Go to the **Library** section
2. Click **"Import Local"**
3. Select a folder containing audio files
4. The app will parse them and add a **"Local Music"** tab
   - *Tip: Place a `cover.jpg` in the folder to set the album art*


## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| **Space** | Play / Pause |
| **→** | Next Song |
| **←** | Previous Song |
| **↑** | Volume Up |
| **↓** | Volume Down |
| **M** | Mute / Unmute |
| **S** | Shuffle Toggle |
| **R** | Repeat Cycle (Off → All → One) |

> **Note**: Keyboard shortcuts are disabled when typing in input or textarea fields

## Troubleshooting
- **No Sound?**: Ensure your system volume is up and the web page is not muted
- **Visualizer not moving?**: The browser might block audio context. Click anywhere on the page to resume audio context

- **Settings not persisting?**: Check that your browser allows localStorage
