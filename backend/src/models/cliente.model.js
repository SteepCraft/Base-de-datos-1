import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Cliente = sequelize.define(
  "CLIENTE",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      field: "ID",
    },
    nombres: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "NOMBRES",
    },
    apellidos: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "APELLIDOS",
    },
    direccion: {
      type: DataTypes.STRING(50),
      field: "DIRECCION",
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
      field: "TELEFONO",
    },
  },
  {
    tableName: "CLIENTE",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Cliente;
