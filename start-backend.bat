@echo off
echo ========================================
echo Starting LearnSphere Backend Server
echo ========================================
echo.
echo Port: 5001
echo URL: http://localhost:5001
echo.
cd /d "%~dp0backend"
npm start
pause
