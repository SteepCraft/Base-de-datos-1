# Inicialización de Oracle Database con Docker

Esta guía explica cómo levantar una base de datos Oracle XE en Docker y prepararla para el proyecto.

## Requisitos previos
- Tener instalado [Docker](https://docs.docker.com/get-docker/)

## 1. Descargar la imagen de Oracle XE

```bash
docker pull gvenzl/oracle-xe:21.3.0-slim
```

## 2. Crear y ejecutar el contenedor

```bash
docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -e ORACLE_PASSWORD=123 \
  gvenzl/oracle-xe:21.3.0-slim
```

- El usuario por defecto es `system` y la contraseña es la que pusiste en `ORACLE_PASS` (en este ejemplo: `123`).

## 3. Acceder a la base de datos

### Conexión como System (administrador)

Para conectarte como usuario `system` (administrador), puedes usar cualquiera de estos métodos:

1. Usando SQLPlus dentro del contenedor:
```bash
docker exec -it oracle-xe sqlplus system/123@localhost/XEPDB1
```

2. Usando SQLPlus desde tu máquina (si lo tienes instalado):
```bash
sqlplus system/123@localhost:1521/XEPDB1
```

3. Usando una herramienta gráfica (DBeaver, Oracle SQL Developer, etc):
- **Host:** localhost
- **Puerto:** 1521
- **Usuario:** system
- **Contraseña:** 123 (la que definiste en ORACLE_PASSWORD)
- **SID/Service:** XEPDB1

### Conexión como usuario normal

Para otros usuarios (como `sanaya`), los datos de conexión son:

- **Host:** localhost
- **Puerto:** 1521
- **Usuario:** sanaya (o el que crees)
- **Contraseña:** la que definas
- **SID/Service:** XEPDB1

## 4. Crear usuario y cargar el esquema

1. Conéctate como `system` y ejecuta:

```sql
CREATE USER sanaya IDENTIFIED BY 123;
GRANT CONNECT, RESOURCE, DBA TO sanaya;
ALTER USER sanaya DEFAULT TABLESPACE USERS;
```

2. Carga el archivo SQL del esquema (por ejemplo, desde el backend):

```bash
docker cp ../backend/sanaya.sql oracle-xe:/tmp/sanaya.sql
docker exec -it oracle-xe bash
# Dentro del contenedor:
sqlplus sanaya/123@localhost/XEPDB1 @/tmp/sanaya.sql
```

## 5. Configura las variables de entorno

En la carpeta `backend/` copia el archivo `.env.example` como `.env` y edítalo si es necesario:

```bash
cp .env.example .env
```

Asegúrate de que los valores coincidan con los datos de tu base de datos:

```
ORACLE_USER=sanaya
ORACLE_PASS=123
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_DB=XEPDB1
```

## 6. Verifica las tablas

Conéctate como `sanaya` y ejecuta:

```sql
SELECT table_name FROM user_tables;
```

---

Ahora la base de datos está lista para usarse con el backend Node.js y las variables de entorno configuradas.
