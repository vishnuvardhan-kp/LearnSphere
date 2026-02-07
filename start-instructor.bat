@echo off
echo ========================================
echo Starting Instructor Frontend
echo ========================================
echo.
echo Port: 5174 (expected)
echo URL: http://localhost:5174
echo.
echo Login: instructor1@example.com / password123
echo.
cd /d "%~dp0frontend\instructor"
npm run dev
pause
