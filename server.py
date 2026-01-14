#!/usr/bin/env python3
"""
Simple HTTP Server for Neon Beats Music Player
Runs on http://localhost:8000
"""
import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add CORS headers to allow audio loading
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        # Cache control for faster loading
        self.send_header('Cache-Control', 'max-age=3600')
        super().end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"""
╔══════════════════════════════════════════════════╗
║     🎵 Neon Beats - Local Server Running 🎵     ║
╚══════════════════════════════════════════════════╝

🌐 Server URL: http://localhost:{PORT}
📁 Serving from: {DIRECTORY}

✅ CORS enabled for audio playback
✅ Ready for offline use

Press Ctrl+C to stop the server
""")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped. Goodbye!")
