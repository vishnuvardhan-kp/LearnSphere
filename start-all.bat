@echo off
echo ========================================
echo Starting ALL LearnSphere Components
echo ========================================
echo.
echo This will open 4 separate windows:
echo   1. Backend Server (Port 5001)
echo   2. Admin Frontend (Port 5173)
echo   3. Instructor Frontend (Port 5174)
echo   4. Learner Frontend (Port 5175)
echo.
echo Press any key to start all components...
pause > nul

echo.
echo Starting Backend Server...
start "LearnSphere Backend" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 3 > nul

echo Starting Admin Frontend...
start "LearnSphere Admin" cmd /k "cd /d "%~dp0frontend\admin" && npm run dev"

timeout /t 2 > nul

echo Starting Instructor Frontend...
start "LearnSphere Instructor" cmd /k "cd /d "%~dp0frontend\instructor" && npm run dev"

timeout /t 2 > nul

echo Starting Learner Frontend...
start "LearnSphere Learner" cmd /k "cd /d "%~dp0frontend\learner" && npm run dev"

echo.
echo ========================================
echo All components are starting!
echo ========================================
echo.
echo URLs:
echo   Backend:    http://localhost:5001
echo   Admin:      http://localhost:5173
echo   Instructor: http://localhost:5174
echo   Learner:    http://localhost:5175
echo.
echo Close this window when done.
pause
