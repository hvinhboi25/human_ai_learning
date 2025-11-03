@echo off
echo ========================================
echo Starting Human-AI Learning Backend
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo.
echo Installing dependencies...
pip install -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and configure it.
    pause
    exit
)

REM Run migrations
echo.
echo Running database migrations...
python run_migrations.py

REM Create audio directory
if not exist "audio_files" mkdir audio_files

REM Start server
echo.
echo ========================================
echo Starting FastAPI server...
echo Server will be available at http://localhost:8000
echo Press Ctrl+C to stop
echo ========================================
echo.
python main.py

pause

