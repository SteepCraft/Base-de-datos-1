import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Usuario = sequelize.define(
  "USUARIO",
  {
    id: {
<<<<<<< HEAD
<<<<<<< HEAD
      type: DataTypes.INTEGER,
=======
      type: DataTypes.NUMBER(10),
>>>>>>> 1842c09 (Actualizaciones en sql, controllers y modelos de sequelize)
=======
      type: DataTypes.NUMBER(10),
>>>>>>> origin/master
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
<<<<<<< HEAD
<<<<<<< HEAD
    contrasena: {
=======
    password: {
>>>>>>> 1842c09 (Actualizaciones en sql, controllers y modelos de sequelize)
=======
    password: {
>>>>>>> origin/master
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "CONTRASENA",
    },
    nombres: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "NOMBRES",
    },
<<<<<<< HEAD
<<<<<<< HEAD
    apelidos: {
=======
    apellidos: {
>>>>>>> 1842c09 (Actualizaciones en sql, controllers y modelos de sequelize)
=======
    apellidos: {
>>>>>>> origin/master
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "APELLIDOS",
    },
<<<<<<< HEAD
=======

<<<<<<< HEAD
>>>>>>> 1842c09 (Actualizaciones en sql, controllers y modelos de sequelize)
=======
>>>>>>> origin/master
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
