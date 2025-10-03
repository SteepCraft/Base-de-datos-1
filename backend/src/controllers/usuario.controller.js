import models from "../models/index.js";

const ALLOWED_FIELDS = [
  "email",
  "contrasena",
  "nombres",
  "apellidos",
  "telefono",
  "foto_perfil",
  "estado",
];

// convierte valores entrantes a 1/0 (DB)
function parseEstadoToDb(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value ? 1 : 0;
  const v = String(value).toLowerCase().trim();
  if (["1", "true", "y", "yes", "activo", "active"].includes(v)) return 1;
  return 0;
}

// convierte 1/0 (DB) a booleano para la API
function formatEstadoFromDb(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === "number") return value === 1;
  const v = String(value).trim();
  return v === "1" || v.toLowerCase() === "y" || v.toLowerCase() === "true";
}

// limpia un objeto usuario (instancia o plain) -> quita contrasena y normaliza estado
function sanitizeUsuario(obj) {
  if (!obj) return obj;
  const plain = typeof obj.toJSON === "function" ? obj.toJSON() : { ...obj };
  if ("contrasena" in plain) delete plain.contrasena;
  if ("estado" in plain) plain.estado = formatEstadoFromDb(plain.estado);
  return plain;
}

class UsuarioController {
  static async getAllUsuarios(req, res) {
    try {
      const usuarios = await models.Usuario.findAll();
      // usuarios es un array de instancias -> convertir y sanear cada uno
      const usuariosSafe = usuarios.map((u) => sanitizeUsuario(u));
      return res.json(usuariosSafe);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUsuarioById(req, res) {
    try {
      const rawId = req.params.id;
      if (!rawId)
        return res.status(400).json({ error: "Parámetro 'id' obligatorio" });

      const Usuario = models?.Usuario;
      if (!Usuario)
        return res.status(500).json({ error: "Modelo Usuario no disponible" });

      // Forzar número si parece número
      const numId = Number(rawId);
      let usuario = null;

      // 1) Intento findByPk con número (si es numérico)
      if (!Number.isNaN(numId)) {
        usuario = await Usuario.findByPk(numId, { raw: true });
      }

      // 2) Intento findByPk con string (por si PK es VARCHAR2)
      if (!usuario) {
        usuario = await Usuario.findByPk(rawId, { raw: true });
      }

      // 3) Intento findOne por la columna JS 'id' (si existe)
      if (!usuario) {
        try {
          usuario = await Usuario.findOne({
            where: { id: numId || rawId },
            raw: true,
          });
        } catch {
          // ignore
        }
      }

      // 4) Fallback: intentar por cada atributo del modelo
      if (!usuario) {
        const attrs = Object.keys(Usuario.getAttributes || {});
        for (const attr of attrs) {
          try {
            const where = {};
            where[attr] = numId || rawId;
            const r = await Usuario.findOne({ where, raw: true });
            if (r) {
              usuario = r;
              break;
            }
          } catch {
            // ignore
          }
        }
      }

      if (!usuario) {
        return res.status(404).json({
          error: "Usuario no encontrado",
          debug: {
            attemptedId: rawId,
            primaryKeyAttributes: Usuario.primaryKeyAttributes,
            modelAttributes: Object.keys(Usuario.rawAttributes || {}),
          },
        });
      }

      // usuario es plain object por raw: true -> sanear manualmente
      const usuarioSafe = {
        ...usuario,
        // eliminar contrasena si existe bajo ese nombre
        ...(usuario.contrasena ? {} : {}),
      };
      if ("contrasena" in usuarioSafe) delete usuarioSafe.contrasena;
      if ("estado" in usuarioSafe)
        usuarioSafe.estado = formatEstadoFromDb(usuario.estado);

      return res.json(usuarioSafe);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createUsuario(req, res) {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe ser un objeto JSON válido",
      });
    }
    const requiredFields = ["nombres", "apellidos", "email", "contrasena"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ error: `El campo '${field}' es obligatorio` });
      }
    }
    try {
      // construir payload seguro sólo con campos permitidos
      const payload = {};
      for (const k of ALLOWED_FIELDS) {
        if (k in req.body) payload[k] = req.body[k];
      }
      // normalizar estado a 1/0 si viene
      if ("estado" in payload) {
        const p = parseEstadoToDb(payload.estado);
        if (p !== undefined) payload.estado = p;
        else delete payload.estado;
      }

      const usuario = await models.Usuario.create(payload);
      const usuarioSafe = sanitizeUsuario(usuario);
      return res.status(201).json(usuarioSafe);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateUsuario(req, res) {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe ser un objeto JSON válido",
      });
    }
    if (!req.params.id) {
      return res
        .status(400)
        .json({ error: "El parámetro 'id' es obligatorio" });
    }
    try {
      // construir payload seguro
      const payload = {};
      for (const k of ALLOWED_FIELDS) {
        if (k in req.body) payload[k] = req.body[k];
      }
      if ("estado" in payload) {
        const p = parseEstadoToDb(payload.estado);
        if (p !== undefined) payload.estado = p;
        else delete payload.estado;
      }

      const [updated] = await models.Usuario.update(payload, {
        where: { id: req.params.id },
      });
      if (!updated)
        return res.status(404).json({ error: "Usuario no encontrado" });

      const usuario = await models.Usuario.findByPk(req.params.id);
      const usuarioSafe = sanitizeUsuario(usuario);
      return res.json(usuarioSafe);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async deleteUsuario(req, res) {
    try {
      const deleted = await models.Usuario.destroy({
        where: { id: req.params.id },
      });
      if (!deleted)
        return res.status(404).json({ error: "Usuario no encontrado" });
      return res.json({ message: "Usuario eliminado" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default UsuarioController;
