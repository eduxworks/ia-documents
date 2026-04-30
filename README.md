# IA Documents 📄

**Professional document management application with MongoDB and S3/MinIO storage**

A modern web application for uploading, storing, and managing documents with metadata and tags. Built with Next.js, TypeScript, MongoDB, and MinIO (S3-compatible storage).

## ✨ Features

- 📤 **Document Upload** - Drag & drop interface
- 🏷️ **Tags** - Organize documents with custom tags
- 📝 **Metadata** - Key/value pairs for custom document information
- 💾 **S3 Storage** - Compatible with MinIO for secure file storage
- 🗄️ **MongoDB** - Persistent metadata storage
- 📱 **Responsive** - Works on desktop and mobile devices
- 🚀 **No Authentication** - Public access (configurable)

## 🏗️ Architecture

```
Next.js (Port 3100)
├── Frontend (React + TypeScript)
├── API Routes
│   ├── /api/upload (POST)
│   └── /api/documents (GET)
└── Global Context for state management
    ├── MongoDB (Port 27019)
    │   └── Metadata & Tags Storage
    └── MinIO S3 (Port 9100)
        └── File Storage (ia-documents bucket)
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/eduxworks/ia-documents.git
cd ia-documents

# Install dependencies
pnpm install

# Start services (MongoDB, MinIO)
docker-compose up -d

# Run development server
pnpm run dev
```

Open [http://localhost:3100](http://localhost:3100) in your browser.

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 3-step quick start guide
- **[SETUP.md](./SETUP.md)** - Detailed installation & configuration
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues & solutions

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.4 | Framework |
| **React** | 19.2.4 | UI Library |
| **TypeScript** | 5 | Type Safety |
| **Tailwind CSS** | 4 | Styling |
| **MongoDB** | 7.0 | Database |
| **MinIO** | Latest | S3 Storage |
| **AWS SDK** | 3.1039 | S3 Client |

## 📁 Project Structure

```
web-documents/
├── app/
│   ├── api/
│   │   ├── upload/route.ts
│   │   └── documents/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── DocumentUpload.tsx
│   └── DocumentList.tsx
├── context/
│   └── AppContext.tsx
├── lib/
│   ├── db.ts
│   ├── s3.ts
│   └── types.ts
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

Create `.env.local`:

```env
PORT=3100
MONGODB_URL=mongodb://localhost:27019/documents_db
S3_ENDPOINT=http://localhost:9100
S3_BUCKET=ia-documents
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin123
```

## 📊 API Endpoints

### POST `/api/upload`
Upload a document with metadata and tags.

**Request:**
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('metadata', JSON.stringify({key: 'value'}));
formData.append('tags', 'tag1,tag2');

fetch('/api/upload', { method: 'POST', body: formData });
```

**Response:**
```json
{
  "success": true,
  "document": {
    "_id": "...",
    "filename": "document.pdf",
    "size": 1024,
    "uploadedAt": "2026-04-30T...",
    "metadata": {},
    "tags": []
  }
}
```

### GET `/api/documents`
Retrieve all documents.

**Response:**
```json
{
  "success": true,
  "documents": [...]
}
```

## 🐛 Troubleshooting

**MongoDB connection error?**
```bash
docker-compose up -d mongodb
```

**MinIO bucket missing?**
```bash
docker-compose up -d create-bucket
```

**Port conflicts?**
```bash
# Change PORT in .env.local
PORT=3101
```

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more solutions.

## 📝 Scripts

```bash
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm start        # Start production server
pnpm run lint     # Run ESLint
```

## 🌐 Services

| Service | Port | URL |
|---------|------|-----|
| **Next.js App** | 3100 | http://localhost:3100 |
| **MongoDB** | 27019 | mongodb://localhost:27019 |
| **MinIO API** | 9100 | http://localhost:9100 |
| **MinIO Console** | 9101 | http://localhost:9101 |

## 📧 Support

For questions or issues, contact: **eduxworks@gmail.com**

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ by Claude**
