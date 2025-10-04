# Configuración de Oracle XE con Docker

## Inicialización Completa (Primera vez o reset completo)

Si quieres que el script `init.sql` se ejecute automáticamente, necesitas eliminar el volumen existente:

```bash
# Detener y eliminar el contenedor y volúmenes
sudo docker compose down -v

# Iniciar de nuevo (ejecutará init.sql automáticamente)
sudo docker compose up -d

# Esperar a que Oracle esté listo (puede tardar 1-2 minutos)
sudo docker compose logs -f oracle-xe
```

## Crear Usuario Manualmente (si el contenedor ya existe)

Si el contenedor ya está corriendo y solo necesitas crear/recrear el usuario:

```bash
# Opción 1: Usar el script automatizado
./setup-user.sh

# Opción 2: Manualmente con sqlplus
sudo docker exec -it oracle-xe sqlplus system/123@localhost:1521/XEPDB1
```

## Verificar que el Usuario Existe

```bash
# Desde fuera del contenedor
sudo docker exec -i oracle-xe sqlplus -s SANAYA/123@localhost:1521/XEPDB1 <<< "SELECT USER FROM DUAL;"

# Desde dentro del contenedor
sudo docker exec -it oracle-xe sqlplus SANAYA/123@localhost:1521/XEPDB1
```

## Información de Conexión

- **Usuario:** SANAYA
- **Password:** 123
- **Host:** localhost
- **Puerto:** 1521
- **Service Name (PDB):** XEPDB1
- **Service Name (CDB):** XE

## Comandos Útiles

```bash
# Ver logs del contenedor
sudo docker compose logs -f oracle-xe

# Reiniciar el contenedor
sudo docker compose restart oracle-xe

# Acceder al contenedor
sudo docker exec -it oracle-xe bash

# Conectar como SYSTEM
sudo docker exec -it oracle-xe sqlplus system/123@localhost:1521/XEPDB1

# Conectar como SANAYA
sudo docker exec -it oracle-xe sqlplus SANAYA/123@localhost:1521/XEPDB1
```

## Notas Importantes

- Los scripts en `/container-entrypoint-initdb.d/` **solo se ejecutan en la primera inicialización**
- Si el volumen `oracle-data` ya existe, Oracle no volverá a ejecutar `init.sql`
- Para forzar la reinicialización, usa `docker compose down -v` (⚠️ esto **elimina todos los datos**)
- El usuario SANAYA necesita crearse tanto en CDB (XE) como en PDB (XEPDB1)
- Normalmente las aplicaciones se conectan a XEPDB1, no a XE
