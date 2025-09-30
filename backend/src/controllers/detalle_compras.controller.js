import { DetalleCompras } from "../models/index.js";

export async function getAllDetalleCompras(req, res) {
  try {
    const detalles = await DetalleCompras.findAll();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getDetalleComprasById(req, res) {
  try {
    const detalle = await DetalleCompras.findOne({
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

export async function createDetalleCompras(req, res) {
  try {
    const detalle = await DetalleCompras.create(req.body);
    res.status(201).json(detalle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateDetalleCompras(req, res) {
  try {
    const [updated] = await DetalleCompras.update(req.body, {
      where: {
        codi_compra: req.params.codi_compra,
        codi_producto: req.params.codi_producto,
      },
    });
    if (!updated)
      return res.status(404).json({ error: "Detalle no encontrado" });
    const detalle = await DetalleCompras.findOne({
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

export async function deleteDetalleCompras(req, res) {
  try {
    const deleted = await DetalleCompras.destroy({
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
