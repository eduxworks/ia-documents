# Quick Start - IA Documents

## 🚀 Inicio Rápido (3 pasos)

### Windows
```bash
.\start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### Manual
```bash
docker-compose up -d
pnpm install
pnpm run dev
```

**La aplicación abrirá en:** `http://localhost:3100`

---

## 📊 ¿Qué hace la aplicación?

```
┌─────────────────────────────────────────┐
│        IA DOCUMENTS (Next.js)           │
│                                         │
│  1. Sube archivos (cualquier tipo)     │
│  2. Se guardan en MinIO (S3)           │
│  3. Metadatos en MongoDB               │
│  4. Tags para organizar                │
└─────────────────────────────────────────┘
         ↓              ↓              ↓
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  MinIO   │  │ MongoDB  │  │ MailHog  │
   │ :9000    │  │ :27018   │  │ :8025    │
   └──────────┘  └──────────┘  └──────────┘
```

---

## ✨ Características

| Característica | Detalles |
|---|---|
| **Upload** | Drag & drop, seleccionar archivo |
| **Metadatos** | Pares clave/valor customizables |
| **Tags** | Categorización de documentos |
| **Almacenamiento** | S3 compatible (MinIO) |
| **Base de Datos** | MongoDB nativa |
| **Interfaz** | Responsive, Mobile-friendly |
| **Sin Auth** | Acceso público |

---

## 🔧 Configuración por defecto

```
URL de App:      http://localhost:3100
MongoDB:         mongodb://localhost:27018
MinIO Console:   http://localhost:9001
MinIO API:       http://localhost:9000
MailHog:         http://localhost:8025
```

**Credenciales MinIO:**
- Usuario: `minioadmin`
- Contraseña: `minioadmin`
- Bucket: `ia-documents`

---

## 📝 Cambiar Configuración

Edita `.env.local`:

```env
PORT=3100                              # Puerto de la app
MONGODB_URL=mongodb://localhost:27018  # Base de datos
S3_ENDPOINT=http://localhost:9000      # MinIO/S3
```

---

## 🐛 Si algo falla

### Error 500 al subir
→ Ver **TROUBLESHOOTING.md**

### Docker no inicia
```bash
docker-compose down -v
docker-compose up -d
```

### Puerto 3100 ocupado
```env
# En .env.local, cambiar a:
PORT=3101
```

---

## 📚 Documentación Completa

- **SETUP.md** - Instalación detallada
- **TROUBLESHOOTING.md** - Solucionar problemas
- **AGENTS.md** - Reglas del proyecto
- **microprompt.md** - Arquitectura

---

## 🎯 Próximos Pasos

1. ✅ Ejecuta `docker-compose up -d`
2. ✅ Ejecuta `pnpm run dev`
3. ✅ Abre http://localhost:3100
4. ✅ ¡Sube tu primer documento!

---

**¿Necesitas ayuda?** 
📧 eduxworks@gmail.com
