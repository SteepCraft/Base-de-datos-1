import models from "../models/index.js";

class DetalleVentaController {
  static async getAllDetalleVenta(req, res) {
    try {
      const detalles = await models.DetalleVenta.findAll();
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDetalleVentaById(req, res) {
    try {
      const detalle = await models.DetalleVenta.findOne({
        where: {
          venta_codigo: req.params.venta_codigo,
          codigo_producto: req.params.codigo_producto,
        },
      });
      if (!detalle)
        return res.status(404).json({ error: "Detalle no encontrado" });
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createDetalleVenta(req, res) {
    try {
      const detalle = await models.DetalleVenta.create(req.body);
      res.status(201).json(detalle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateDetalleVenta(req, res) {
    try {
      const [updated] = await models.DetalleVenta.update(req.body, {
        where: {
          venta_codigo: req.params.venta_codigo,
          codigo_producto: req.params.codigo_producto,
        },
      });
      if (!updated)
        return res.status(404).json({ error: "Detalle no encontrado" });
      const detalle = await models.DetalleVenta.findOne({
        where: {
          venta_codigo: req.params.venta_codigo,
          codigo_producto: req.params.codigo_producto,
        },
      });
      res.json(detalle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteDetalleVenta(req, res) {
    try {
      const deleted = await models.DetalleVenta.destroy({
        where: {
          venta_codigo: req.params.venta_codigo,
          codigo_producto: req.params.codigo_producto,
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

export default DetalleVentaController;
