import { Compras } from "../models/index.js";

export async function getAllCompras(req, res) {
  try {
    const compras = await Compras.findAll();
    res.json(compras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCompraById(req, res) {
  try {
    const compra = await Compras.findByPk(req.params.id);
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });
    res.json(compra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createCompra(req, res) {
  try {
    const compra = await Compras.create(req.body);
    res.status(201).json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateCompra(req, res) {
  try {
    const [updated] = await Compras.update(req.body, {
      where: { codi_compra: req.params.id },
    });
    if (!updated)
      return res.status(404).json({ error: "Compra no encontrada" });
    const compra = await Compras.findByPk(req.params.id);
    res.json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteCompra(req, res) {
  try {
    const deleted = await Compras.destroy({
      where: { codi_compra: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Compra no encontrada" });
    res.json({ message: "Compra eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
