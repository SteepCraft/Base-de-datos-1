import models from "../models/index.js";

class ProveedorController {
  static async getAllProveedores(req, res) {
    try {
      const proveedores = await models.Proveedor.findAll();
      res.json(proveedores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProveedorById(req, res) {
    try {
      const proveedor = await models.Proveedor.findByPk(req.params.id);
      if (!proveedor)
        return res.status(404).json({ error: "Proveedor no encontrado" });
      res.json(proveedor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProveedor(req, res) {
    try {
      const proveedor = await models.Proveedor.create(req.body);
      res.status(201).json(proveedor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProveedor(req, res) {
    try {
      const [updated] = await models.Proveedor.update(req.body, {
        where: { id_proveedor: req.params.id },
      });
      if (!updated)
        return res.status(404).json({ error: "Proveedor no encontrado" });
      const proveedor = await models.Proveedor.findByPk(req.params.id);
      res.json(proveedor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProveedor(req, res) {
    try {
      const deleted = await models.Proveedor.destroy({
        where: { id_proveedor: req.params.id },
      });
      if (!deleted)
        return res.status(404).json({ error: "Proveedor no encontrado" });
      res.json({ message: "Proveedor eliminado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProveedorController;
