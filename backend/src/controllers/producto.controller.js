import models from "../models/index.js";

class ProductoController {
  static async getAllProductos(req, res) {
    try {
      const productos = await models.Producto.findAll({
        include: [
          {
            model: models.Inventario,
            as: "inventario",
            attributes: ["stock_actual", "stock_inicio", "stock_final"],
          },
        ],
      });
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductoById(req, res) {
    try {
      const producto = await models.Producto.findByPk(req.params.id, {
        include: [
          {
            model: models.Inventario,
            as: "inventario",
          },
        ],
      });
      if (!producto)
        return res.status(404).json({ error: "Producto no encontrado" });
      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProducto(req, res) {
    const transaction = await models.sequelize.transaction();
    try {
      const { codigo, descripcion, precio, num_existencia } = req.body;

      // Crear producto
      const producto = await models.Producto.create(
        {
          codigo,
          descripcion,
          precio,
          num_existencia: num_existencia || 0,
        },
        { transaction }
      );

      // Crear registro de inventario automáticamente
      await models.Inventario.create(
        {
          codigo_producto: producto.codigo,
          stock_actual: num_existencia || 0,
          stock_inicio: num_existencia || 0,
          stock_final: num_existencia || 0,
          fecha_regis: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      // Devolver producto con inventario
      const productoCompleto = await models.Producto.findByPk(producto.codigo, {
        include: [{ model: models.Inventario, as: "inventario" }],
      });

      res.status(201).json(productoCompleto);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProducto(req, res) {
    const transaction = await models.sequelize.transaction();
    try {
      const { descripcion, precio, num_existencia } = req.body;

      const producto = await models.Producto.findByPk(req.params.id);
      if (!producto) {
        await transaction.rollback();
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Actualizar producto
      await producto.update(
        {
          descripcion,
          precio,
          num_existencia,
        },
        { transaction }
      );

      // Actualizar inventario si cambió num_existencia
      if (num_existencia !== undefined) {
        await models.Inventario.update(
          {
            stock_actual: num_existencia,
            stock_final: num_existencia,
          },
          {
            where: { codigo_producto: producto.codigo },
            transaction,
          }
        );
      }

      await transaction.commit();

      // Devolver producto actualizado con inventario
      const productoActualizado = await models.Producto.findByPk(
        producto.codigo,
        {
          include: [{ model: models.Inventario, as: "inventario" }],
        }
      );

      res.json(productoActualizado);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProducto(req, res) {
    const transaction = await models.sequelize.transaction();
    try {
      // Primero eliminar inventario
      await models.Inventario.destroy({
        where: { codigo_producto: req.params.id },
        transaction,
      });

      // Luego eliminar producto
      const deleted = await models.Producto.destroy({
        where: { codigo: req.params.id },
        transaction,
      });

      if (!deleted) {
        await transaction.rollback();
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      await transaction.commit();
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProductoController;
