import { Inventario } from "../models/index.js";

export async function getAllInventario(req, res) {
  try {
    const inventario = await Inventario.findAll();
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getInventarioById(req, res) {
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createInventario(req, res) {
  try {
    const item = await Inventario.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateInventario(req, res) {
  try {
    const [updated] = await Inventario.update(req.body, { where: { codi_producto: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Item no encontrado" });
    const item = await Inventario.findByPk(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteInventario(req, res) {
  try {
    const deleted = await Inventario.destroy({ where: { codi_producto: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Item no encontrado" });
    res.json({ message: "Item eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
