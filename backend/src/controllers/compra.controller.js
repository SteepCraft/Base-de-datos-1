import models from "../models/index.js";

class CompraController {
  static async getAllCompra(req, res) {
    try {
      const compras = await models.Compra.findAll();
      res.json(compras);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCompraById(req, res) {
    try {
      const compra = await models.Compra.findByPk(req.params.id);
      if (!compra)
        return res.status(404).json({ error: "Compra no encontrada" });
      res.json(compra);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCompra(req, res) {
    try {
      const compra = await models.Compra.create(req.body);
      res.status(201).json(compra);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateCompra(req, res) {
    try {
      const [updated] = await models.Compra.update(req.body, {
        where: { codi_compra: req.params.id },
      });
      if (!updated)
        return res.status(404).json({ error: "Compra no encontrada" });
      const compra = await models.Compra.findByPk(req.params.id);
      res.json(compra);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCompra(req, res) {
    try {
      const deleted = await models.Compra.destroy({
        where: { codi_compra: req.params.id },
      });
      if (!deleted)
        return res.status(404).json({ error: "Compra no encontrada" });
      res.json({ message: "Compra eliminada" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default CompraController;
