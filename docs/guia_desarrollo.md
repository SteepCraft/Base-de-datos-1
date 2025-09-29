# Guía de Desarrollo

Esta guía describe los pasos para levantar y trabajar en el entorno de desarrollo del proyecto.

## Requisitos previos
- Node.js >= 18
- pnpm (o npm/yarn)
- Docker (para la base de datos Oracle)

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd bd1
```

## 2. Inicializar la base de datos Oracle

Sigue las instrucciones en `docs/INICIALIZAR_ORACLE_DOCKER.md` para levantar Oracle XE y crear el usuario/esquema.

## 3. Backend

```bash
cd backend
pnpm install # o npm install
```

### Variables de entorno
Crea un archivo `.env` en `backend/` con los datos de conexión a Oracle:

```
ORACLE_USER=sanaya
ORACLE_PASSWORD=sanaya
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_DB=XEPDB1
```

### Levantar el servidor

```bash
pnpm dev # o npm run dev
```

## 4. Frontend

```bash
cd ../forntend
pnpm install # o npm install
pnpm dev # o npm run dev
```

## 5. Pruebas

- Para probar la conexión a la base de datos y los modelos:

```bash
cd backend
node src/config/test-db.js
```

- Para probar la API, usa Postman, Thunder Client o curl.

## 6. Estructura del proyecto

- `backend/`: Código del servidor Node.js, modelos, controladores, rutas.
- `forntend/`: Código del frontend (Vite, React, etc.).
- `docs/`: Documentación técnica y de despliegue.

---

Para dudas o problemas, consulta los archivos en `docs/` o abre un issue.
