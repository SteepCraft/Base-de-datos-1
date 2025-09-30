import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Compras = sequelize.define(
  "Compras",
  {
    codigo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: "CODIGO",
    },

    fecha_compra: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "FECHA_COMPRA",
    },

    id_proveedor: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "ID_PROVEEDOR",
    },

    tot_compras: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: { min: 0.01 },
      field: "TOT_COMPRAS",
    },
  },
  {
    tableName: "COMPRAS",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Compras;
