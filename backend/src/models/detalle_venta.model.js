import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const DetalleVenta = sequelize.define(
  "DETALLE_VENTA",
  {
    venta_codigo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      field: "VENTA_CODIGO",
    },
    codigo_producto: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      field: "CODIGO_PRODUCTO",
    },
    cant_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
      defaultValue: 1,
      field: "CANT_VENTA",
    },
    precio_producto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
      field: "PRECIO_PRODUCTO",
    },
  },
  {
    tableName: "DETALLE_VENTA",
    timestamps: false,
  }
);

export default DetalleVenta;
