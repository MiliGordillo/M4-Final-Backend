# M4-Final-Backend

Backend para una aplicación de gestión de usuarios, perfiles, playlists y autenticación con integración a Spotify. Desarrollado con Node.js, Express y MongoDB.

## Características principales
- Registro e inicio de sesión de usuarios con JWT
- Gestión de perfiles de usuario
- Creación y manejo de playlists
- Integración con la API de Spotify
- Protección de rutas mediante middlewares de autenticación

## Estructura del proyecto
```
backend/
├── package.json
├── .env
└── src/
    ├── app.js
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── services/
    └── utils/
```
## Endpoints principales
- `POST /api/auth/register` — Registro de usuario
- `POST /api/auth/login` — Inicio de sesión
- `GET /api/profiles` — Listar perfiles (requiere autenticación)
- `POST /api/playlists` — Crear playlist
- `GET /api/spotify/...` — Integración con Spotify
