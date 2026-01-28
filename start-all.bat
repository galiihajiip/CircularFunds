@echo off
echo ========================================
echo   CircularFund Platform Startup
echo ========================================
echo.

echo Starting AI Service...
start "AI Service" cmd /k "cd ai-service && python main.py"
timeout /t 3 /nobreak >nul

echo Starting Backend...
start "Backend" cmd /k "cd backend && npm run start:prod"
timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Frontend:    http://localhost:3000
echo Backend:     http://localhost:4000
echo AI Service:  http://localhost:5000
echo.
echo Press any key to exit...
pause >nul
