import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Proveedor = sequelize.define(
  "PROVEEDOR",
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      field: "ID",
    },
    nombres: {
      type: DataTypes.STRING(50),
      field: "NOMBRES",
    },
    apellidos: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "APELLIDOS",
    },
    direccion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "DIRECCION",
    },
    providencia: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "PROVIDENCIA",
    },
    telefono: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      field: "TELEFONO",
    },
  },
  {
    tableName: "PROVEEDOR",
    timestamps: false,
  }
);

export default Proveedor;
