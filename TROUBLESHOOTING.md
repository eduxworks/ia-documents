# Guía de Solución de Problemas

## Error 500 al subir archivos

### Causas comunes:

#### 1. **MongoDB no está conectando**

**Síntoma:** `MongoDB operation failed: connect ECONNREFUSED`

**Solución:**
```bash
# Verificar que MongoDB está corriendo
docker ps | grep ia-documents-mongodb

# Si no está corriendo, reinicia los servicios
docker-compose down
docker-compose up -d

# Esperar a que MongoDB esté listo (healthy)
docker ps --format "table {{.Names}}\t{{.Status}}" | grep mongodb
```

#### 2. **MinIO/S3 no está disponible**

**Síntoma:** `S3 upload failed: Network error`

**Solución:**
```bash
# Verificar que MinIO está corriendo
docker ps | grep ia-documents-minio

# Verificar que el bucket existe
docker exec ia-documents-minio mc ls minio/ia-documents

# Si no existe, crear el bucket
docker exec ia-documents-minio mc mb minio/ia-documents
```

#### 3. **Puerto 3100 ya está en uso**

**Síntoma:** `Error: listen EADDRINUSE :::3100`

**Solución:**
```bash
# Opción A: Cambiar el puerto en .env.local
PORT=3101

# Opción B: Liberar el puerto (si sabes qué proceso lo usa)
# En Windows:
netstat -ano | findstr :3100
taskkill /PID <PID> /F

# En Linux/Mac:
lsof -i :3100
kill -9 <PID>
```

## Docker issues

### "Docker daemon is not running"

**Solución:**
- Abre Docker Desktop
- Espera a que esté completamente inicializado
- Verifica con `docker ps`

### "Cannot connect to Docker daemon"

**En Windows:**
```bash
# Reinicia el servicio de Docker
net stop com.docker.service
net start com.docker.service

# O reinicia Docker Desktop
```

### Error TLS durante descarga de imágenes

**Síntoma:** `local error: tls: bad record MAC`

**Solución:**
```bash
# Reintentar
docker-compose up -d

# O forzar descarga sin caché
docker-compose up --no-cache -d
```

## Problemas de Conexión

### "Connection refused" a localhost:9000

**Solución:**
```bash
# Verificar que MinIO está escuchando
docker logs ia-documents-minio

# Prueba la conexión
curl http://localhost:9000

# Si no funciona, reinicia
docker-compose restart minio
```

### "Cannot reach MongoDB"

**Solución:**
```bash
# Verificar logs de MongoDB
docker logs ia-documents-mongodb

# Verificar la variable MONGODB_URL en .env.local
# Debe ser: mongodb://localhost:27018

# Prueba telnet
telnet localhost 27018
```

## Problemas de Desarrollo

### "TypeScript compilation error"

**Solución:**
```bash
# Limpiar caché
rm -rf .next
rm -rf node_modules

# Reinstalar
pnpm install

# Compilar
npm run build
```

### Cambios en código no se reflejan

**Solución:**
- Reinicia el servidor dev con `Ctrl+C` y `pnpm run dev`
- Abre una nueva pestaña del navegador en incógnito (limpia caché)

## Verificación Rápida

Ejecuta esto para verificar que todo está bien:

```bash
# 1. Verificar Docker
docker ps

# 2. Verificar servicios
docker-compose ps

# 3. Verificar MongoDB (desde contenedor)
docker exec ia-documents-mongodb mongosh localhost:27017 --quiet --eval "db.adminCommand('ping')"

# 4. Verificar MinIO
docker exec ia-documents-minio mc ls minio/

# 5. Verificar bucket
docker exec ia-documents-minio mc ls minio/ia-documents/
```

## Logs Útiles

```bash
# Logs de MongoDB
docker logs ia-documents-mongodb

# Logs de MinIO
docker logs ia-documents-minio

# Logs de MailHog
docker logs ia-documents-mailhog

# Logs de Next.js (en terminal)
npm run dev
```

## Reset Completo

Si todo falla, haz un reset completo:

```bash
# Detener y remover todo
docker-compose down -v

# Limpiar caché local
rm -rf .next

# Reiniciar
docker-compose up -d
pnpm run dev
```

## Información de Contacto

- **Email:** eduxworks@gmail.com
- **Documentación:** Ver `SETUP.md` para instrucciones detalladas
