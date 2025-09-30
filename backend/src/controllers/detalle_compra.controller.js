import models from "../models/index.js";

class DetalleCompraController {
  static async getAllDetalleCompra(req, res) {
    try {
      const detalles = await models.DetalleCompra.findAll();
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDetalleCompraById(req, res) {
    try {
      const detalle = await models.DetalleCompra.findOne({
        where: {
          codi_compra: req.params.codi_compra,
          codi_producto: req.params.codi_producto,
        },
      });
      if (!detalle)
        return res.status(404).json({ error: "Detalle no encontrado" });
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createDetalleCompra(req, res) {
    try {
      const detalle = await models.DetalleCompra.create(req.body);
      res.status(201).json(detalle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateDetalleCompra(req, res) {
    try {
      const [updated] = await models.DetalleCompra.update(req.body, {
        where: {
          codi_compra: req.params.codi_compra,
          codi_producto: req.params.codi_producto,
        },
      });
      if (!updated)
        return res.status(404).json({ error: "Detalle no encontrado" });
      const detalle = await models.DetalleCompra.findOne({
        where: {
          codi_compra: req.params.codi_compra,
          codi_producto: req.params.codi_producto,
        },
      });
      res.json(detalle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteDetalleCompra(req, res) {
    try {
      const deleted = await models.DetalleCompra.destroy({
        where: {
          codi_compra: req.params.codi_compra,
          codi_producto: req.params.codi_producto,
        },
      });
      if (!deleted)
        return res.status(404).json({ error: "Detalle no encontrado" });
      res.json({ message: "Detalle eliminado" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default DetalleCompraController;
