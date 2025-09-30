import models from "../models/index.js";

export async function getAllProductos(req, res) {
  try {
    const productos = await models.Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProductoById(req, res) {
  try {
    const producto = await models.Producto.findByPk(req.params.id);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createProducto(req, res) {
  try {
    const producto = await models.Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateProducto(req, res) {
  try {
    const [updated] = await models.Producto.update(req.body, {
      where: { codi_producto: req.params.id },
    });
    if (!updated)
      return res.status(404).json({ error: "Producto no encontrado" });
    const producto = await models.Producto.findByPk(req.params.id);
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteProducto(req, res) {
  try {
    const deleted = await models.Producto.destroy({
      where: { codi_producto: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
