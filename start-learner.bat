@echo off
echo ========================================
echo Starting Learner Frontend
echo ========================================
echo.
echo Port: 5175 (expected)
echo URL: http://localhost:5175
echo.
echo Login: learner1@example.com / password123
echo Or signup for a new account!
echo.
cd /d "%~dp0frontend\learner"
npm run dev
pause
