import models from "../models/index.js";

class VentasController {
  static async getAllVentas(req, res) {
    try {
      const ventas = await models.Ventas.findAll({
        include: [
          {
            model: models.Cliente,
            as: "cliente",
            attributes: ["id", "nombres", "apellidos"],
          },
          {
            model: models.DetalleVenta,
            as: "detalleVentas",
            include: [
              {
                model: models.Producto,
                as: "producto",
                attributes: ["codigo", "descripcion", "precio"],
              },
            ],
          },
        ],
        order: [["fecha_venta", "DESC"]],
      });
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVentaById(req, res) {
    try {
      const venta = await models.Ventas.findByPk(req.params.id, {
        include: [
          {
            model: models.Cliente,
            as: "cliente",
          },
          {
            model: models.DetalleVenta,
            as: "detalleVentas",
            include: [
              {
                model: models.Producto,
                as: "producto",
              },
            ],
          },
        ],
      });
      if (!venta) return res.status(404).json({ error: "Venta no encontrada" });
      res.json(venta);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createVenta(req, res) {
    const transaction = await models.sequelize.transaction();
    try {
      const { codigo, id_cliente, productos } = req.body;

      // Validar que hay productos
      if (!productos || productos.length === 0) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ error: "Debe incluir al menos un producto en la venta" });
      }

      // Calcular valor total y verificar stock
      let valor_tot = 0;
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

        // Verificar stock disponible
        if (producto.num_existencia < item.cant_venta) {
          await transaction.rollback();
          return res.status(400).json({
            error: `Stock insuficiente para ${producto.descripcion}. Disponible: ${producto.num_existencia}, Solicitado: ${item.cant_venta}`,
          });
        }

        valor_tot +=
          item.cant_venta * (item.precio_producto || producto.precio);
      }

      // Crear venta
      await models.Ventas.create(
        {
          codigo,
          id_cliente,
          fecha_venta: new Date(),
          valor_tot,
        },
        { transaction }
      );

      // Crear detalles y actualizar stock
      for (const item of productos) {
        // Crear detalle de venta
        await models.DetalleVenta.create(
          {
            venta_codigo: codigo,
            codigo_producto: item.codigo_producto,
            cant_venta: item.cant_venta,
            precio_producto: item.precio_producto,
          },
          { transaction }
        );

        // Actualizar stock del producto
        const producto = await models.Producto.findByPk(item.codigo_producto, {
          transaction,
        });
        const nuevoStock = producto.num_existencia - item.cant_venta;

        await producto.update({ num_existencia: nuevoStock }, { transaction });

        // Actualizar inventario
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

      // Devolver venta completa con detalles
      const ventaCompleta = await models.Ventas.findByPk(codigo, {
        include: [
          {
            model: models.Cliente,
            as: "cliente",
          },
          {
            model: models.DetalleVenta,
            as: "detalleVentas",
            include: [
              {
                model: models.Producto,
                as: "producto",
              },
            ],
          },
        ],
      });

      res.status(201).json(ventaCompleta);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  }
}

export default VentasController;
