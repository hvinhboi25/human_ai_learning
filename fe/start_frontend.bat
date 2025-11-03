@echo off
echo ========================================
echo Starting Human-AI Learning Frontend
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Creating .env from example...
    copy .env.example .env
    echo Please edit .env if needed.
)

REM Start development server
echo.
echo ========================================
echo Starting React development server...
echo App will be available at http://localhost:3000
echo Press Ctrl+C to stop
echo ========================================
echo.
npm start

pause

