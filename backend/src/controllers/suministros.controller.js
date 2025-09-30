import models from "../models/index.js";

class SuministrosController {
  static async getAllSuministros(req, res) {
    try {
      const suministros = await models.Suministros.findAll();
      res.json(suministros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSuministroById(req, res) {
    try {
      const suministro = await models.Suministros.findOne({
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

  static async createSuministro(req, res) {
    try {
      const suministro = await models.Suministros.create(req.body);
      res.status(201).json(suministro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateSuministro(req, res) {
    try {
      const [updated] = await models.Suministros.update(req.body, {
        where: {
          id_proveedor: req.params.id_proveedor,
          codi_producto: req.params.codi_producto,
        },
      });
      if (!updated)
        return res.status(404).json({ error: "Suministro no encontrado" });
      const suministro = await models.Suministros.findOne({
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

  static async deleteSuministro(req, res) {
    try {
      const deleted = await models.Suministros.destroy({
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
}

export default SuministrosController;
