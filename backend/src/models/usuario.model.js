import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Usuario = sequelize.define("USUARIO", {
  id_usuario: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
    field: "ID_USUARIO"
  },
  nom_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "NOM_USUARIO"
  },
  ape_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "APE_USUARIO"
  },
  email_usuario: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: "EMAIL_USUARIO"
  },
  num_tel_usuario: {
    type: DataTypes.STRING(10),
    unique: true,
    field: "NUM_TEL_USUARIO"
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "FECHA_REGISTRO"
  },
  foto_perfil: {
    type: DataTypes.STRING(255),
    field: "FOTO_PERFIL"
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: "ACTIVO",
    validate: {
      isIn: [["ACTIVO", "INACTIVO", "SUSPENDIDO"]]
    },
    field: "ESTADO"
  }
}, {
  tableName: "USUARIO",
  timestamps: false,
});

export default Usuario;
