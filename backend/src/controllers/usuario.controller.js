import models from "../models/index.js";

class UsuarioController {
  static async getAllUsuarios(req, res) {
    try {
      const usuarios = await models.Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
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

      // 4) Fallback: intentar por cada atributo del modelo (útil si el 'field' real es diferente)
      if (!usuario) {
        const attrs = Object.keys(Usuario.getAttributes || {});
        for (const attr of attrs) {
          // omitimos búsquedas masivas en atributos tipo texto por performance,
          // pero intentamos por igualdad con el value 1 o '1'.
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

      return res.json(usuario);
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
      const usuario = await models.Usuario.create(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
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
      const [updated] = await models.Usuario.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated)
        return res.status(404).json({ error: "Usuario no encontrado" });
      const usuario = await models.Usuario.findByPk(req.params.id);
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteUsuario(req, res) {
    try {
      const deleted = await models.Usuario.destroy({
        where: { id: req.params.id },
      });
      if (!deleted)
        return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ message: "Usuario eliminado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UsuarioController;
