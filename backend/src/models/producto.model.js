import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Producto = sequelize.define(
  "PRODUCTO",
  {
    codigo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "CODIGO",
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "DESCRIPCION",
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
      field: "PRECIO",
    },
    num_existencia: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "NUM_EXISTENCIA",
    },
  },
  {
    tableName: "PRODUCTO",
    timestamps: false,
  }
);

export default Producto;
