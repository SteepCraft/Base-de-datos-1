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
<<<<<<< HEAD
      type: DataTypes.STRING(100),
=======
      type: DataTypes.STRING(200),
>>>>>>> 1842c09 (Actualizaciones en sql, controllers y modelos de sequelize)
      allowNull: false,
      field: "DESCRIPCION",
    },
    precio: {
<<<<<<< HEAD
      type: DataTypes.DECIMAL(10, 2),
=======
      type: DataTypes.DECIMAL(12, 2),
>>>>>>> 1842c09 (Actualizaciones en sql, controllers y modelos de sequelize)
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
