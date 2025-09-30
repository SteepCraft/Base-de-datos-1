import models from "../models/index.js";

class InventarioController {
  static async getAllInventario(req, res) {
    try {
      const inventario = await models.Inventario.findAll();
      res.json(inventario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getInventarioById(req, res) {
    try {
      const item = await models.Inventario.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Item no encontrado" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createInventario(req, res) {
    try {
      const item = await models.Inventario.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateInventario(req, res) {
    try {
      const [updated] = await models.Inventario.update(req.body, {
        where: { codi_producto: req.params.id },
      });
      if (!updated)
        return res.status(404).json({ error: "Item no encontrado" });
      const item = await models.Inventario.findByPk(req.params.id);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteInventario(req, res) {
    try {
      const deleted = await models.Inventario.destroy({
        where: { codi_producto: req.params.id },
      });
      if (!deleted)
        return res.status(404).json({ error: "Item no encontrado" });
      res.json({ message: "Item eliminado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default InventarioController;
