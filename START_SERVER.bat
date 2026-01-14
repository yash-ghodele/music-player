@echo off
REM ===================================================
REM   NEON BEATS - One-Click Launcher
REM   Starts server and opens browser automatically
REM ===================================================

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║          🎵 NEON BEATS LAUNCHER 🎵              ║
echo ╚══════════════════════════════════════════════════╝
echo.

REM Check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python not found!
    echo.
    echo Please install Python 3.x from:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo ✅ Python found
echo ⚙️  Starting server on http://localhost:8000...
echo.

REM Start server and open browser
start /B python server.py
timeout /t 2 /nobreak >nul

echo 🌐 Opening browser...
start http://localhost:8000

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║              🎵 SERVER RUNNING 🎵               ║
echo ║                                                  ║
echo ║  URL: http://localhost:8000                      ║
echo ║  Press Ctrl+C to stop the server                 ║
echo ╚══════════════════════════════════════════════════╝
echo.

REM Keep window open and show server output
python server.py

pause
