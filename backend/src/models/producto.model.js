import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Producto = sequelize.define("PRODUCTO", {
  codi_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: "CODI_PRODUCTO"
  },
  descrip_producto: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "DESCRIP_PRODUCTO"
  },
  precio_producto: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    validate: { min: 0.01 },
    field: "PRECIO_PRODUCTO"
  },
  num_existencia: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: "NUM_EXISTENCIA"
  },
}, {
  tableName: "PRODUCTO",
  timestamps: false,
});

export default Producto;
