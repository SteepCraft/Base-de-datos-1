import models from "../models/index.js";

export async function getAllVentas(req, res) {
  try {
    const ventas = await models.Ventas.findAll();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getVentaById(req, res) {
  try {
    const venta = await models.Ventas.findByPk(req.params.id);
    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createVenta(req, res) {
  try {
    const venta = await models.Ventas.create(req.body);
    res.status(201).json(venta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
