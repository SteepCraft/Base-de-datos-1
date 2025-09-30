import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Inventario = sequelize.define(
  "INVENTARIO",
  {
    codigo_producto: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      field: "CODIGO_PRODUCTO",
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
      defaultValue: 0,
      field: "STOCK_ACTUAL",
    },
    stock_inicio: {
      type: DataTypes.INTEGER,
      validate: { min: 0 },
      defaultValue: 0,
      field: "STOCK_INICIO",
    },
    stock_final: {
      type: DataTypes.INTEGER,
      validate: { min: 0 },
      defaultValue: 0,
      field: "STOCK_FINAL",
    },
    fecha_regis: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "INVENTARIO",
    timestamps: false,
  }
);

export default Inventario;
