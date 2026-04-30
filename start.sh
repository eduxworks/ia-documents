#!/bin/bash

echo "🚀 Iniciando IA Documents..."
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    exit 1
fi

echo "✓ Docker disponible"

# Iniciar servicios
echo ""
echo "📦 Iniciando servicios (MongoDB, MinIO, MailHog)..."
docker-compose up -d

# Esperar a que MongoDB esté listo
echo "⏳ Esperando a que los servicios se inicialicen..."
until docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "ia-documents-mongodb.*healthy"; do
    echo "  ⏳ MongoDB inicializando..."
    sleep 5
done

echo "✓ MongoDB listo"

# Esperar a que MinIO esté listo
until docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "ia-documents-minio.*Up"; do
    echo "  ⏳ MinIO inicializando..."
    sleep 5
done

echo "✓ MinIO listo"
echo ""

# Verificar si necesita instalar dependencias
if [ ! -d "node_modules" ]; then
    echo "📚 Instalando dependencias..."
    pnpm install
fi

echo ""
echo "✅ Todo listo!"
echo ""
echo "🎯 Ejecutando servidor de desarrollo..."
echo "   URL: http://localhost:3100"
echo ""
echo "Presiona Ctrl+C para detener la aplicación"
echo ""

pnpm run dev
