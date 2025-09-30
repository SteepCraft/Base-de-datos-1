import models from "../models/index.js";

export async function getAllUsuarios(req, res) {
  try {
    const usuarios = await models.Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUsuarioById(req, res) {
  try {
    const usuario = await models.Usuario.findByPk(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createUsuario(req, res) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un objeto JSON válido",
    });
  }
  const requiredFields = [
    "id_usuario",
    "nom_usuario",
    "ape_usuario",
    "email_usuario",
  ];
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

export async function updateUsuario(req, res) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un objeto JSON válido",
    });
  }
  if (!req.params.id) {
    return res.status(400).json({ error: "El parámetro 'id' es obligatorio" });
  }
  try {
    const [updated] = await models.Usuario.update(req.body, {
      where: { id_usuario: req.params.id },
    });
    if (!updated)
      return res.status(404).json({ error: "Usuario no encontrado" });
    const usuario = await models.Usuario.findByPk(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteUsuario(req, res) {
  try {
    const deleted = await models.Usuario.destroy({
      where: { id_usuario: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
