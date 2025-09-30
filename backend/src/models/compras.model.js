import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Compras = sequelize.define(
  "COMPRAS",
  {
    codigo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "CODIGO",
    },
    fecha_compra: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "FECHA_COMPRA",
    },
    id_proveedor: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "ID_PROVEEDOR",
    },
    tot_compras: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
      field: "TOT_COMPRAS",
    },
  },
  {
    tableName: "COMPRAS",
    timestamps: false,
  }
);

export default Compras;
