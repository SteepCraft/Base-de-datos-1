import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Ventas = sequelize.define(
  "VENTAS",
  {
    codi_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "CODI_VENTA",
    },
    id_cliente: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "ID_CLIENTE",
    },
    fecha_venta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "FECHA_VENTA",
    },
    valor_tot: {
      type: DataTypes.DECIMAL(10, 2),
      validate: { min: 0.01 },
      field: "VALOR_TOT",
    },
  },
  {
    tableName: "VENTAS",
    timestamps: false,
  }
);

export default Ventas;
