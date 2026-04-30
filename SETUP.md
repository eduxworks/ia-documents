# IA Documents - Guía de Instalación y Ejecución

## Requisitos Previos

- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local sin Docker)
- pnpm (gestor de paquetes)

## Opción 1: Ejecución con Docker Compose (Recomendado)

### 1. Crear archivo `docker-compose.yml` en la raíz del proyecto

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: ia-documents-mongodb
    ports:
      - "27018:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    volumes:
      - mongodb_data:/data/db

  minio:
    image: minio/minio:latest
    container_name: ia-documents-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

  mailhog:
    image: mailhog/mailhog:latest
    container_name: ia-documents-mailhog
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  mongodb_data:
  minio_data:
```

### 2. Iniciar los servicios Docker

```bash
docker-compose up -d
```

### 3. Crear el bucket en MinIO (Rustfs)

```bash
# Acceder a la consola de MinIO
# URL: http://localhost:9001
# Usuario: minioadmin
# Contraseña: minioadmin
# Crear bucket: ia-documents
```

O desde la línea de comandos:

```bash
docker exec -it ia-documents-minio mc mb minio/ia-documents
```

### 4. Ejecutar la aplicación Next.js

```bash
pnpm install
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3100`

## Opción 2: Ejecución Local sin Docker

Si tienes MongoDB y MinIO/S3 ejecutándose en tu máquina local:

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Editar `.env.local` con tus credenciales:

```env
MONGODB_URL=mongodb://admin:admin@localhost:27018
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=ia-documents
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
```

### 3. Ejecutar en desarrollo

```bash
pnpm run dev
```

### 4. Compilar para producción

```bash
pnpm run build
pnpm start
```

## Características

✅ **Subida de documentos** - Interfaz drag-and-drop
✅ **Almacenamiento S3/Rustfs** - Compatible con AWS S3
✅ **Metadatos clave/valor** - Almacenados en MongoDB
✅ **Etiquetado de documentos** - Tags asociados a cada documento
✅ **Sin autenticación** - Acceso público
✅ **Interfaz responsiva** - Diseño mobile-first con Tailwind CSS

## Estructura del Proyecto

```
.
├── app/                    # Next.js app router
│   ├── api/               # Rutas API
│   │   ├── upload/        # Endpoint de carga
│   │   └── documents/     # Endpoint de listado
│   ├── layout.tsx         # Layout raíz con AppProvider
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── DocumentUpload.tsx # Formulario de carga
│   └── DocumentList.tsx   # Lista de documentos
├── context/               # Context API
│   └── AppContext.tsx     # Estado global de la app
├── lib/                   # Utilidades y configuración
│   ├── db.ts             # Conexión MongoDB
│   ├── s3.ts             # Configuración S3
│   └── types.ts          # Tipos TypeScript
└── public/               # Archivos estáticos
```

## Códigos de Estado HTTP

- **201 Created** - Documento subido exitosamente
- **400 Bad Request** - Archivo no proporcionado
- **500 Internal Server Error** - Error en el servidor

## Variables de Entorno

| Variable | Descripción | Por Defecto |
|----------|-------------|------------|
| `MONGODB_URL` | URL de conexión MongoDB | `mongodb://localhost:27018` |
| `S3_ENDPOINT` | Endpoint S3/MinIO | `http://localhost:9000` |
| `S3_BUCKET` | Bucket S3 | `ia-documents` |
| `AWS_REGION` | Región AWS | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Clave de acceso S3 | `minioadmin` |
| `AWS_SECRET_ACCESS_KEY` | Contraseña S3 | `minioadmin` |

## Desarrollo

### Comandos Disponibles

```bash
pnpm run dev      # Servidor desarrollo en http://localhost:3000
pnpm run build    # Compilar para producción
pnpm start        # Ejecutar compilación producción
pnpm run lint     # Ejecutar ESLint
```

### Stack Técnico

- **Framework**: Next.js 16.2.4
- **Runtime**: React 19.2.4
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Base de Datos**: MongoDB 7.0
- **Storage**: MinIO (S3-compatible)
- **Validación**: Zod

## Solución de Problemas

### Error: "No se puede conectar a MongoDB"
- Verificar que MongoDB está corriendo en puerto 27018
- Verificar credenciales en `.env.local`

### Error: "No se puede escribir en S3"
- Verificar que MinIO está corriendo en puerto 9000
- Verificar que el bucket `ia-documents` existe
- Verificar credenciales S3 en `.env.local`

### Bucket no existe en MinIO
```bash
docker exec -it ia-documents-minio mc mb minio/ia-documents
```

## Contacto

Para soporte o reportar bugs, contacta a eduxworks@gmail.com
