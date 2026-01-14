@echo off
REM Start Neon Beats Local Server
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║     🎵 Starting Neon Beats Server...  🎵        ║
echo ╚══════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.x
    echo.
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Start the server
echo ✅ Python found. Starting server...
echo.
python server.py

pause
