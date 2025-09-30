import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Usuario = sequelize.define(
  "USUARIO",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "ID",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "EMAIL",
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "CONTRASENA",
    },
    nombres: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "NOMBRES",
    },
    apelidos: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "APELLIDOS",
    },
    telefono: {
      type: DataTypes.STRING(10),
      unique: true,
      field: "TELEFONO",
    },
    foto_perfil: {
      type: DataTypes.STRING(255),
      field: "FOTO_PERFIL",
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: "ACTIVO",
      validate: {
        isIn: [["ACTIVO", "INACTIVO", "SUSPENDIDO"]],
      },
      field: "ESTADO",
    },
  },
  {
    tableName: "USUARIO",
    timestamps: false,
  }
);

export default Usuario;
