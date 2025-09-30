import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Suministros = sequelize.define(
  "SUMINISTROS",
  {
    id_proveedor: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      field: "ID_PROVEEDOR",
    },
    codigo_producto: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      field: "CODIGO_PRODUCTO",
    },
  },
  {
    tableName: "SUMINISTROS",
    timestamps: false,
  }
);

export default Suministros;
