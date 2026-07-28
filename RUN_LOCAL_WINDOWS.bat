@echo off
setlocal
title Gang Doyoon Phone
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\local-server.ps1"
if errorlevel 1 (
  echo.
  echo The local preview could not start.
  pause
)
