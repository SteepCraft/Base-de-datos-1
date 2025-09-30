import { sequelize } from "../config/sequelize.js";
import * as modelsExports from "./models-export.js";
import applyAssociations from "./associations.js";

// modelsExports contiene getters que al importarlos ya evaluarán
const models = { ...modelsExports };

// aplicar asociaciones
applyAssociations(models);

// exportar sequelize y modelos
export { sequelize };
export default models;
