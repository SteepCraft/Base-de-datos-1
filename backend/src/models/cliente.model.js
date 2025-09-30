import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Cliente = sequelize.define(
  "CLIENTE",
  {
    id_cliente: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      field: "ID_CLIENTE",
    },
    nom_cliente: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "NOM_CLIENTE",
    },
    ape_cliente: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "APE_CLIENTE",
    },
    dire_cliente: {
      type: DataTypes.STRING(50),
      field: "DIRE_CLIENTE",
    },
    num_tel_cliente: {
      type: DataTypes.STRING(10),
      unique: true,
      field: "NUM_TEL_CLIENTE",
    },
  },
  {
    tableName: "CLIENTE",
    timestamps: false,
  }
);

export default Cliente;
