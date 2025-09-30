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

  // Helpers para no re-crear la misma asociación varias veces
  const hasAssoc = (model, alias) =>
    model &&
    model.associations &&
    Object.prototype.hasOwnProperty.call(model.associations, alias);

  const addBelongsTo = (source, target, opts) => {
    if (!source || !target || !opts?.as) return;
    if (!hasAssoc(source, opts.as)) source.belongsTo(target, opts);
  };

  const addHasMany = (source, target, opts) => {
    if (!source || !target || !opts?.as) return;
    if (!hasAssoc(source, opts.as)) source.hasMany(target, opts);
  };

  const addHasOne = (source, target, opts) => {
    if (!source || !target || !opts?.as) return;
    if (!hasAssoc(source, opts.as)) source.hasOne(target, opts);
  };

  const addBelongsToMany = (source, target, opts) => {
    // for belongsToMany we check the alias on source
    if (!source || !target || !opts?.as) return;
    if (!hasAssoc(source, opts.as)) source.belongsToMany(target, opts);
  };

  // -------------------------
  // VENTAS <-> CLIENTE
  // -------------------------
  if (Ventas && Cliente) {
    addBelongsTo(Ventas, Cliente, { foreignKey: "id_cliente", as: "cliente" });
    addHasMany(Cliente, Ventas, { foreignKey: "id_cliente", as: "ventas" });
  }

  // -------------------------
  // DETALLE_VENTA -> VENTAS, PRODUCTO
  // -------------------------
  if (DetalleVenta && Ventas) {
    addBelongsTo(DetalleVenta, Ventas, {
      foreignKey: "venta_codigo",
      as: "venta",
    });
    addHasMany(Ventas, DetalleVenta, {
      foreignKey: "venta_codigo",
      as: "detalleVentas",
    });
  }

  if (DetalleVenta && Producto) {
    addBelongsTo(DetalleVenta, Producto, {
      foreignKey: "codigo_producto",
      as: "producto",
    });
    addHasMany(Producto, DetalleVenta, {
      foreignKey: "codigo_producto",
      as: "detalleVentas",
    });
  }

  // -------------------------
  // COMPRAS <-> PROVEEDOR
  // -------------------------
  if (Compras && Proveedor) {
    addBelongsTo(Compras, Proveedor, {
      foreignKey: "id_proveedor",
      as: "proveedor",
    });
    addHasMany(Proveedor, Compras, {
      foreignKey: "id_proveedor",
      as: "compras",
    });
  }

  // -------------------------
  // DETALLE_COMPRAS -> COMPRAS, PRODUCTO
  // -------------------------
  if (DetalleCompras && Compras) {
    addBelongsTo(DetalleCompras, Compras, {
      foreignKey: "compra_codigo",
      as: "compra",
    });
    addHasMany(Compras, DetalleCompras, {
      foreignKey: "compra_codigo",
      as: "detalleCompras",
    });
  }

  if (DetalleCompras && Producto) {
    addBelongsTo(DetalleCompras, Producto, {
      foreignKey: "codigo_producto",
      as: "producto",
    });
    addHasMany(Producto, DetalleCompras, {
      foreignKey: "codigo_producto",
      as: "detalleCompras",
    });
  }

  // -------------------------
  // INVENTARIO -> PRODUCTO (1:1)
  // -------------------------
  if (Inventario && Producto) {
    addBelongsTo(Inventario, Producto, {
      foreignKey: "codigo_producto",
      as: "producto",
    });
    addHasOne(Producto, Inventario, {
      foreignKey: "codigo_producto",
      as: "inventario",
    });
  }

  // -------------------------
  // SUMINISTROS: Proveedor <-> Producto (m:n) vía suministros
  // -------------------------
  if (Proveedor && Producto && Suministros) {
    addBelongsToMany(Proveedor, Producto, {
      through: Suministros,
      foreignKey: "id_proveedor",
      otherKey: "codigo_producto",
      as: "productosSuministrados",
    });

    addBelongsToMany(Producto, Proveedor, {
      through: Suministros,
      foreignKey: "codigo_producto",
      otherKey: "id_proveedor",
      as: "proveedores",
    });

    // relaciones directas para acceder al registro intermedio
    addBelongsTo(Suministros, Proveedor, {
      foreignKey: "id_proveedor",
      as: "proveedor",
    });
    addBelongsTo(Suministros, Producto, {
      foreignKey: "codigo_producto",
      as: "producto",
    });
  }

  return models;
}
