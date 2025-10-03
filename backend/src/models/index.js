import applyAssociations from "./associations.js";
import * as modelsExports from "./models-export.js";

// modelsExports contiene getters que al importarlos ya evaluarán
const models = { ...modelsExports };

// aplicar asociaciones
applyAssociations(models);

// exportar modelos
export default models;
