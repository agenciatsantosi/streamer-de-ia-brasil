@echo off
chcp 65001 >nul
cd /d "%~dp0"
python --version >nul 2>&1
if errorlevel 1 (
  echo Nao encontrei o Python no sistema.
  pause
  exit /b
)
echo Verificando bibliotecas necessarias...
python -m pip install --quiet --disable-pip-version-check aiohttp edge-tts
python script.py
pause
