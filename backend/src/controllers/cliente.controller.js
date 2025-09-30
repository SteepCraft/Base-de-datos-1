import models from "../models/index.js";

class ClienteController {
  static async getAllClientes(req, res) {
    try {
      const clientes = await models.Cliente.findAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getClienteById(req, res) {
    try {
      const cliente = await models.Cliente.findByPk(req.params.id);
      if (!cliente)
        return res.status(404).json({ error: "Cliente no encontrado" });
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCliente(req, res) {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        error: "El cuerpo de la solicitud debe ser un objeto JSON válido",
      });
    }
    const requiredFields = ["id_cliente", "nom_cliente", "ape_cliente"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ error: `El campo '${field}' es obligatorio` });
      }
    }
    try {
      const cliente = await models.Cliente.create(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateCliente(req, res) {
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
      const [updated] = await models.Cliente.update(req.body, {
        where: { id_cliente: req.params.id },
      });
      if (!updated)
        return res.status(404).json({ error: "Cliente no encontrado" });
      const cliente = await models.Cliente.findByPk(req.params.id);
      res.json(cliente);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCliente(req, res) {
    try {
      const deleted = await models.Cliente.destroy({
        where: { id_cliente: req.params.id },
      });
      if (!deleted)
        return res.status(404).json({ error: "Cliente no encontrado" });
      res.json({ message: "Cliente eliminado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ClienteController;
