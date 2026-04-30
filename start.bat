@echo off
setlocal enabledelayedexpansion

echo 🚀 Iniciando IA Documents...
echo.

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker no está instalado. Por favor instala Docker Desktop.
    exit /b 1
)

echo ✓ Docker disponible
echo.

REM Start services
echo 📦 Iniciando servicios (MongoDB, MinIO, MailHog)...
docker-compose up -d
echo.

REM Wait for MongoDB
echo ⏳ Esperando a que los servicios se inicialicen...
:wait_mongodb
docker ps --format "table {{.Names}}" | findstr /I "ia-documents-mongodb" >nul
if errorlevel 1 (
    echo   ⏳ MongoDB inicializando...
    timeout /t 5 /nobreak
    goto wait_mongodb
)

echo ✓ MongoDB listo
echo.

REM Wait for MinIO
echo ⏳ Esperando a MinIO...
:wait_minio
docker ps --format "table {{.Names}}" | findstr /I "ia-documents-minio" >nul
if errorlevel 1 (
    echo   ⏳ MinIO inicializando...
    timeout /t 5 /nobreak
    goto wait_minio
)

echo ✓ MinIO listo
echo.

REM Check node_modules
if not exist "node_modules" (
    echo 📚 Instalando dependencias...
    call pnpm install
)

echo.
echo ✅ Todo listo!
echo.
echo 🎯 Ejecutando servidor de desarrollo...
echo    URL: http://localhost:3100
echo.
echo Presiona Ctrl+C para detener la aplicación
echo.

call pnpm run dev

endlocal
