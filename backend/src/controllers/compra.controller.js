import models from "../models/index.js";

class CompraController {
  static async getAllCompra(req, res) {
    try {
      const compras = await models.Compra.findAll({
        include: [
          {
            model: models.Proveedor,
            as: "proveedor",
            attributes: ["id", "nombres", "apellidos"],
          },
          {
            model: models.DetalleCompra,
            as: "detalleCompras",
            include: [
              {
                model: models.Producto,
                as: "producto",
                attributes: ["codigo", "descripcion", "precio"],
              },
            ],
          },
        ],
        order: [["fecha_compra", "DESC"]],
      });
      res.json(compras);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCompraById(req, res) {
    try {
      const compra = await models.Compra.findByPk(req.params.id, {
        include: [
          {
            model: models.Proveedor,
            as: "proveedor",
          },
          {
            model: models.DetalleCompra,
            as: "detalleCompras",
            include: [
              {
                model: models.Producto,
                as: "producto",
              },
            ],
          },
        ],
      });
      if (!compra)
        return res.status(404).json({ error: "Compra no encontrada" });
      res.json(compra);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCompra(req, res) {
    const transaction = await models.sequelize.transaction();
    try {
      const { codigo, id_proveedor, productos } = req.body;

      if (!productos || productos.length === 0) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ error: "Debe incluir al menos un producto en la compra" });
      }

      let tot_compras = 0;
      for (const item of productos) {
        const producto = await models.Producto.findByPk(item.codigo_producto, {
          transaction,
        });

        if (!producto) {
          await transaction.rollback();
          return res.status(400).json({
            error: `Producto con código ${item.codigo_producto} no encontrado`,
          });
        }

        tot_compras +=
          item.cant_compra * (item.precio_producto || producto.precio);
      }

      await models.Compra.create(
        {
          codigo,
          id_proveedor,
          fecha_compra: new Date(),
          tot_compras,
        },
        { transaction }
      );

      for (const item of productos) {
        await models.DetalleCompra.create(
          {
            codigo_compra: codigo,
            codigo_producto: item.codigo_producto,
            cant_compra: item.cant_compra,
            precio_producto: item.precio_producto,
          },
          { transaction }
        );

        const producto = await models.Producto.findByPk(item.codigo_producto, {
          transaction,
        });
        const nuevoStock = producto.num_existencia + item.cant_compra;

        await producto.update({ num_existencia: nuevoStock }, { transaction });

        await models.Inventario.update(
          {
            stock_actual: nuevoStock,
            stock_final: nuevoStock,
          },
          {
            where: { codigo_producto: item.codigo_producto },
            transaction,
          }
        );
      }

      await transaction.commit();

      const compraCompleta = await models.Compra.findByPk(codigo, {
        include: [
          {
            model: models.Proveedor,
            as: "proveedor",
          },
          {
            model: models.DetalleCompra,
            as: "detalleCompras",
            include: [
              {
                model: models.Producto,
                as: "producto",
              },
            ],
          },
        ],
      });

      res.status(201).json(compraCompleta);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  }

  static async updateCompra(req, res) {
    try {
      const [updated] = await models.Compra.update(req.body, {
        where: { codigo: req.params.id },
      });
      if (!updated)
        return res.status(404).json({ error: "Compra no encontrada" });
      const compra = await models.Compra.findByPk(req.params.id);
      res.json(compra);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCompra(req, res) {
    try {
      const deleted = await models.Compra.destroy({
        where: { codigo: req.params.id },
      });
      if (!deleted)
        return res.status(404).json({ error: "Compra no encontrada" });
      res.json({ message: "Compra eliminada" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default CompraController;
