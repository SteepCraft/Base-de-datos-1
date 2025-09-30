import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const DetalleCompra = sequelize.define(
  "DETALLE_COMPRA",
  {
    codigo_compra: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      field: "CODIGO_COMPRA",
    },
    codigo_producto: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      field: "CODIGO_PRODUCTO",
    },
    cant_compras: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: "CANT_COMPRAS",
    },
    precio_unit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
      field: "PRECIO_UNIT",
    },
  },
  {
    tableName: "DETALLE_COMPRA",
    timestamps: false,
  }
);

export default DetalleCompra;
