import applyAssociations from "./associations.js";
import * as modelsExports from "./models-export.js";
import { sequelize } from "../config/sequelize.js";

// modelsExports contiene getters que al importarlos ya evaluarán
const models = { ...modelsExports, sequelize };

// aplicar asociaciones
applyAssociations(models);

// exportar modelos
export default models;
