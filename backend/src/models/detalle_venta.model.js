import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const DetalleVenta = sequelize.define(
  "DETALLE_VENTA",
  {
    codi_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "CODI_VENTA",
    },
    codi_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "CODI_PRODUCTO",
    },
    cant_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "CANT_VENTA",
    },
    precio_producto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "PRECIO_PRODUCTO",
    },
  },
  {
    tableName: "DETALLE_VENTA",
    timestamps: false,
  }
);

export default DetalleVenta;
