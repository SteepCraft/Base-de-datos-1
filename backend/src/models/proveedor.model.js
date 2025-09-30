import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Proveedor = sequelize.define(
  "PROVEEDOR",
  {
    id_proveedor: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      field: "ID_PROVEEDOR",
    },
    nom_proveedor: {
      type: DataTypes.STRING(50),
      field: "NOM_PROVEEDOR",
    },
    ape_proveedor: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "APE_PROVEEDOR",
    },
    dire_proveedor: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "DIRE_PROVEEDOR",
    },
    provi_proveedor: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "PROVI_PROVEEDOR",
    },
    num_tel_proveedor: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      field: "NUM_TEL_PROVEEDOR",
    },
  },
  {
    tableName: "PROVEEDOR",
    timestamps: false,
  }
);

export default Proveedor;
