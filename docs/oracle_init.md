# Inicialización de Oracle Database con Docker Compose

Esta guía explica cómo levantar una base de datos Oracle XE en Docker usando **docker-compose**, crear el usuario de trabajo (`sanaya`) y preparar el entorno para el proyecto.

## Requisitos previos
- Tener instalado [Docker](https://docs.docker.com/get-docker/)
- Tener instalado [Docker Compose](https://docs.docker.com/compose/)

---

## 1. Crear archivo `docker-compose.yml`

En tu proyecto crea un archivo llamado `docker-compose.yml` con el siguiente contenido:

```yaml
version: "3.8"

services:
  oracle-xe:
    image: gvenzl/oracle-xe:21.3.0-slim
    container_name: oracle-xe
    ports:
      - "1521:1521"
    environment:
      ORACLE_PASSWORD: "123"
    volumes:
      - oracle-data:/opt/oracle/oradata
      - ./init.sql:/container-entrypoint-initdb.d/init.sql

volumes:
  oracle-data:
```

---

## 2. Script de inicialización (`init.sql`)

En la misma carpeta que `docker-compose.yml`, crea un archivo llamado `init.sql` con el contenido:

```sql
ALTER SESSION SET "_ORACLE_SCRIPT"=true;

CREATE USER sanaya IDENTIFIED BY 123;
GRANT CONNECT, RESOURCE, DBA TO sanaya;
ALTER USER sanaya DEFAULT TABLESPACE USERS;
```

Esto asegura que el usuario `sanaya` se cree automáticamente al levantar el contenedor.

---

## 3. Levantar el contenedor

Ejecuta:

```bash
docker-compose up -d
```

Esto creará y levantará el contenedor con Oracle XE.

---

## 4. Acceder a la base de datos

### Conexión como `system` (administrador)

1. Dentro del contenedor con SQLPlus:
```bash
docker exec -it oracle-xe sqlplus system/123@localhost/XEPDB1
```

2. Desde tu máquina (si tienes SQLPlus instalado):
```bash
sqlplus system/123@localhost:1521/XEPDB1
```

3. Usando DBeaver, Oracle SQL Developer u otro cliente:
- **Host:** localhost  
- **Puerto:** 1521  
- **Usuario:** system  
- **Contraseña:** 123  
- **Service:** XEPDB1  

### Conexión como `sanaya`

- **Host:** localhost  
- **Puerto:** 1521  
- **Usuario:** sanaya  
- **Contraseña:** 123  
- **Service:** XEPDB1  

---

## 5. Cargar el esquema

Copia tu archivo SQL al contenedor y ejecútalo:

```bash
docker cp ../backend/sanaya.sql oracle-xe:/tmp/sanaya.sql
docker exec -it oracle-xe sqlplus sanaya/123@localhost/XEPDB1 @/tmp/sanaya.sql
```

---

## 6. Configurar variables de entorno en el backend

En la carpeta `backend/` copia el archivo `.env.example` como `.env`:

```bash
cp .env.example .env
```

Asegúrate de que contenga:

```
ORACLE_USER=sanaya
ORACLE_PASS=123
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_DB=XEPDB1
```

---

## 7. Verificar tablas

Conéctate como `sanaya` y ejecuta:

```sql
SELECT table_name FROM user_tables;
```

---

## 8. Posibles problemas y soluciones

### ❌ Error `ORA-01920: user name 'SANAYA' conflicts with another user`
👉 Ya existe el usuario. Solución:  
```sql
DROP USER sanaya CASCADE;
```

### ❌ Error `ORA-65040: operation not allowed from within a pluggable database`
👉 No se activó el modo script. Solución:  
```sql
ALTER SESSION SET "_ORACLE_SCRIPT"=true;
```

### ❌ Error `ORA-65066: The specified changes must apply to all containers`
👉 Intentaste modificar el usuario en el contenedor equivocado. Asegúrate de estar conectado a `XEPDB1` y no a `CDB$ROOT`.

### ❌ Conflicto de nombre de contenedor
👉 Otro contenedor usa el nombre `oracle-xe`. Solución:  
```bash
docker rm -f oracle-xe
```

### ❌ Persisten errores aunque elimines el contenedor
👉 Probablemente el volumen guardó datos antiguos. Solución:  
```bash
docker-compose down -v
docker-compose up -d
```

---

✅ Ahora tienes un entorno de Oracle XE listo con **docker-compose**, usuario inicial creado automáticamente y las soluciones a los errores más comunes.
