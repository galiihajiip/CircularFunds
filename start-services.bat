@echo off
echo Starting CircularFund Services...

echo.
echo [1/2] Starting Python AI Service...
start "AI Service" cmd /k "cd ai-service && python main.py"

timeout /t 3 /nobreak > nul

echo.
echo [2/2] Starting NestJS Backend...
start "Backend API" cmd /k "cd backend && npm run start:dev"

echo.
echo Services starting...
echo - AI Service: http://localhost:5000
echo - Backend API: http://localhost:4000
echo.
echo Press any key to stop all services...
pause > nul

taskkill /FI "WindowTitle eq AI Service*" /T /F
taskkill /FI "WindowTitle eq Backend API*" /T /F
