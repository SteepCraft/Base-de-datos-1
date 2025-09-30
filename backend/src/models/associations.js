export default function applyAssociations(models) {
  const {
    Cliente,
    Producto,
    Proveedor,
    Ventas,
    DetalleVenta,
    Compras,
    DetalleCompras,
    Inventario,
    Suministros,
  } = models;

  // -------------------------
  // VENTAS <-> CLIENTE
  // ventas.id_cliente -> cliente.id
  // ventas (1) --- (N) detalle_venta
  // -------------------------
  if (Ventas && Cliente) {
    Ventas.belongsTo(Cliente, {
      foreignKey: "id_cliente",
      as: "cliente",
    });
    Cliente.hasMany(Ventas, {
      foreignKey: "id_cliente",
      as: "ventas",
    });
  }

  // -------------------------
  // DETALLE_VENTA -> VENTAS, PRODUCTO
  // detalle_venta.venta_codigo -> ventas.codigo
  // detalle_venta.codigo_producto -> producto.codigo
  // -------------------------
  if (DetalleVenta && Ventas) {
    DetalleVenta.belongsTo(Ventas, {
      foreignKey: "venta_codigo",
      as: "venta",
    });
    Ventas.hasMany(DetalleVenta, {
      foreignKey: "venta_codigo",
      as: "detalleVentas",
    });
  }

  if (DetalleVenta && Producto) {
    DetalleVenta.belongsTo(Producto, {
      foreignKey: "codigo_producto",
      as: "producto",
    });
    Producto.hasMany(DetalleVenta, {
      foreignKey: "codigo_producto",
      as: "detalleVentas",
    });
  }

  // -------------------------
  // COMPRAS <-> PROVEEDOR
  // -------------------------
  if (Compras && Proveedor) {
    Compras.belongsTo(Proveedor, {
      foreignKey: "id_proveedor",
      as: "proveedor",
    });
    Proveedor.hasMany(Compras, {
      foreignKey: "id_proveedor",
      as: "compras",
    });
  }

  // -------------------------
  // DETALLE_COMPRAS -> COMPRAS, PRODUCTO
  // -------------------------
  if (DetalleCompras && Compras) {
    DetalleCompras.belongsTo(Compras, {
      foreignKey: "compra_codigo",
      as: "compra",
    });
    Compras.hasMany(DetalleCompras, {
      foreignKey: "compra_codigo",
      as: "detalleCompras",
    });
  }

  if (DetalleCompras && Producto) {
    DetalleCompras.belongsTo(Producto, {
      foreignKey: "codigo_producto",
      as: "producto",
    });
    Producto.hasMany(DetalleCompras, {
      foreignKey: "codigo_producto",
      as: "detalleCompras",
    });
  }

  // -------------------------
  // INVENTARIO -> PRODUCTO (1:1)
  // -------------------------
  if (Inventario && Producto) {
    Inventario.belongsTo(Producto, {
      foreignKey: "codigo_producto",
      as: "producto",
    });
    Producto.hasOne(Inventario, {
      foreignKey: "codigo_producto",
      as: "inventario",
    });
  }

  // -------------------------
  // SUMINISTROS: relación many-to-many (Proveedor <-> Producto)
  // Usamos la tabla intermedia 'suministros'
  // -------------------------
  if (Proveedor && Producto && Suministros) {
    // Proveedor <-> Producto a través de Suministros
    Proveedor.belongsToMany(Producto, {
      through: Suministros,
      foreignKey: "id_proveedor",
      otherKey: "codigo_producto",
      as: "productosSuministrados",
    });

    Producto.belongsToMany(Proveedor, {
      through: Suministros,
      foreignKey: "codigo_producto",
      otherKey: "id_proveedor",
      as: "proveedores",
    });

    // Además mapear relaciones directas para acceder al registro de la tabla intermedia
    Suministros.belongsTo(Proveedor, {
      foreignKey: "id_proveedor",
      as: "proveedor",
    });
    Suministros.belongsTo(Producto, {
      foreignKey: "codigo_producto",
      as: "producto",
    });
  }

  return models;
}
