@echo off
echo ========================================
echo Starting Admin Frontend
echo ========================================
echo.
echo Port: 5173
echo URL: http://localhost:5173
echo.
echo Login: admin@example.com / password123
echo.
cd /d "%~dp0frontend\admin"
npm run dev
pause
