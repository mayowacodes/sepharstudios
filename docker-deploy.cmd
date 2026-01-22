@echo off
setlocal enabledelayedexpansion

REM Configuration
set IMAGE_NAME=manimasaun/sepharstudios
set VERSION=0.0.1

echo ============================================
echo Building and Deploying Docker Image
echo ============================================
echo.

REM Step 1: Build the image
echo [1/2] Building Docker image...
docker build -t %IMAGE_NAME%:%VERSION% .

if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Step 2: Push to Docker Hub
echo [2/2] Pushing to Docker Hub...
docker push %IMAGE_NAME%:%VERSION%

if errorlevel 1 (
    echo ❌ Push failed!
    echo Make sure you're logged in: docker login
    exit /b 1
)

echo.
echo ============================================
echo ✅ Deployment Complete!
echo ============================================
echo Image: %IMAGE_NAME%:%VERSION%
echo.
echo Next steps:
echo 1. Pull the image in Dokploy: %IMAGE_NAME%:%VERSION%
echo 2. Set environment variables in Dokploy dashboard
echo 3. Deploy!
echo ============================================

endlocal
