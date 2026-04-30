## Design guidelines (for 'frontend-design' skill)
- Light background with dark text for readability
- Customer-facing: clean, modern storefront feel — bold typography, clear CTAs
- Color palette: pick one accent color and stay consistent
- No images anywhere — use category-colored icon placeholders (CSS only)
- Mobile-responsive layouts

## Arquitectura Base de datos
- Como base de datos elegiremos mongodb con el driver nativo.
- Database: MongoDB con driver nativo, corriendo en Docker (puerto por defecto 27018).

## Arquitectura Storage de pdf, videos, audios, etc.
- Aws s3 librerias usando Rustfs que esta en docker.
- Crear el bucket si no existe.

## Arquitectura Mail
- Usar mailhog que esta instalados en docker.

## Arquitectura Frontend
- Usar nextjs con typescript.
- No usar ya el fichero middleware.tsx, sino usar proxy en su lugar.
- Usar un globalcontext para almacenar el estado global de la aplicación, como el usuario autenticado, preferencias, etc. Evitar prop drilling.
- Hacer npm run build cuando se haya acabado la codificación, no cada vez.

## Repositorio en github
- Hacer commit con mensajes claros y descriptivos.
- Organiza el codigo en carpetas logicas (componets, pages, lib, etc.).
- Usa ramas para nuevas features o fixes y haz merge a main solo cuando esten completas y te lo diga.

## coding rules
1. Read the Next.js docs in node_modules/next/dist/docs/ before using any API.
2. All DB access goes through lib/db.ts singleton — never create a new MongoClient inline.
3. All money values stored and computed in cents (integers) — format for display only at render time.
4. API routes return { error: string } on failure with the appropriate HTTP status.
5. No "any" types — [use proper TypeScript interfaces in lib/types.ts].*
