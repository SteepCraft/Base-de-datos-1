import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Cliente = sequelize.define(
  "Cliente",
  {
    id: {
      type: DataTypes.INTEGER,
<<<<<<< HEAD
<<<<<<< HEAD
      autoIncrement: true,
=======
>>>>>>> 1842c09 (Actualizaciones en sql, controllers y modelos de sequelize)
=======
>>>>>>> origin/master
      primaryKey: true,
      autoIncrement: true,
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
<<<<<<< HEAD
<<<<<<< HEAD
      type: DataTypes.STRING(50),
      field: "DIRECCION",
    },
    telefono: {
      type: DataTypes.STRING(10),
=======
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "DIRECCION",
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
>>>>>>> 1842c09 (Actualizaciones en sql, controllers y modelos de sequelize)
=======
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "DIRECCION",
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
>>>>>>> origin/master
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
