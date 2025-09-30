import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Inventario = sequelize.define(
  "INVENTARIO",
  {
    codi_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "CODI_PRODUCTO",
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "STOCK_ACTUAL",
    },
    stock_inicio: {
      type: DataTypes.INTEGER,
      field: "STOCK_INICIO",
    },
    stock_final: {
      type: DataTypes.INTEGER,
      field: "STOCK_FINAL",
    },
    fecha_regis: {
      type: DataTypes.DATE,
      field: "FECHA_REGIS",
    },
  },
  {
    tableName: "INVENTARIO",
    timestamps: false,
  }
);

export default Inventario;
