@echo off
chcp 65001 >nul
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
  echo Não encontrei o Python. Instale a partir de python.org e marque a opção "Add python.exe to PATH".
  pause
  exit /b
)
echo Verificando bibliotecas, a primeira vez demora um pouco...
python -m pip install --quiet --disable-pip-version-check aiohttp edge-tts
python script.py
pause
