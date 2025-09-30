import { Suministros } from "../models/index.js";

export async function getAllSuministros(req, res) {
  try {
    const suministros = await Suministros.findAll();
    res.json(suministros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getSuministroById(req, res) {
  try {
    const suministro = await Suministros.findOne({
      where: {
        id_proveedor: req.params.id_proveedor,
        codi_producto: req.params.codi_producto,
      },
    });
    if (!suministro)
      return res.status(404).json({ error: "Suministro no encontrado" });
    res.json(suministro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createSuministro(req, res) {
  try {
    const suministro = await Suministros.create(req.body);
    res.status(201).json(suministro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateSuministro(req, res) {
  try {
    const [updated] = await Suministros.update(req.body, {
      where: {
        id_proveedor: req.params.id_proveedor,
        codi_producto: req.params.codi_producto,
      },
    });
    if (!updated)
      return res.status(404).json({ error: "Suministro no encontrado" });
    const suministro = await Suministros.findOne({
      where: {
        id_proveedor: req.params.id_proveedor,
        codi_producto: req.params.codi_producto,
      },
    });
    res.json(suministro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteSuministro(req, res) {
  try {
    const deleted = await Suministros.destroy({
      where: {
        id_proveedor: req.params.id_proveedor,
        codi_producto: req.params.codi_producto,
      },
    });
    if (!deleted)
      return res.status(404).json({ error: "Suministro no encontrado" });
    res.json({ message: "Suministro eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
