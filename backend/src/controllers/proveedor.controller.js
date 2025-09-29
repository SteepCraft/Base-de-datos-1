import { Proveedor } from "../models/index.js";

export async function getAllProveedores(req, res) {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProveedorById(req, res) {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createProveedor(req, res) {
  try {
    const proveedor = await Proveedor.create(req.body);
    res.status(201).json(proveedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateProveedor(req, res) {
  try {
    const [updated] = await Proveedor.update(req.body, { where: { id_proveedor: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Proveedor no encontrado" });
    const proveedor = await Proveedor.findByPk(req.params.id);
    res.json(proveedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteProveedor(req, res) {
  try {
    const deleted = await Proveedor.destroy({ where: { id_proveedor: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json({ message: "Proveedor eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
