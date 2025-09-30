import models from "../models/index.js";

export async function getAllDetalleVenta(req, res) {
  try {
    const detalles = await models.DetalleVenta.findAll();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getDetalleVentaById(req, res) {
  try {
    const detalle = await models.DetalleVenta.findOne({
      where: {
        codi_venta: req.params.codi_venta,
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

export async function createDetalleVenta(req, res) {
  try {
    const detalle = await models.DetalleVenta.create(req.body);
    res.status(201).json(detalle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateDetalleVenta(req, res) {
  try {
    const [updated] = await models.DetalleVenta.update(req.body, {
      where: {
        codi_venta: req.params.codi_venta,
        codi_producto: req.params.codi_producto,
      },
    });
    if (!updated)
      return res.status(404).json({ error: "Detalle no encontrado" });
    const detalle = await models.DetalleVenta.findOne({
      where: {
        codi_venta: req.params.codi_venta,
        codi_producto: req.params.codi_producto,
      },
    });
    res.json(detalle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteDetalleVenta(req, res) {
  try {
    const deleted = await models.DetalleVenta.destroy({
      where: {
        codi_venta: req.params.codi_venta,
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
