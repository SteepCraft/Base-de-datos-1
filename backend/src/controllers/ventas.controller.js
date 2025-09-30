import models from "../models/index.js";

class VentasController {
  static async getAllVentas(req, res) {
    try {
      const ventas = await models.Ventas.findAll();
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVentaById(req, res) {
    try {
      const venta = await models.Ventas.findByPk(req.params.id);
      if (!venta) return res.status(404).json({ error: "Venta no encontrada" });
      res.json(venta);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createVenta(req, res) {
    try {
      const venta = await models.Ventas.create(req.body);
      res.status(201).json(venta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default VentasController;
