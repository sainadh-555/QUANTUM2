@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

if not exist "node_modules\vite" (
    echo [Quantum Studio] Installing dependencies first, please wait...
    call npm install
)

echo [Quantum Studio] Starting Vite development server...
npm run dev

