import { sequelize } from "./sequelize.js";
import models from "../models/index.js";

const MODELOS_NOMBRES = [
  "Cliente",
  "Producto",
  "Proveedor",
  "Ventas",
  "DetalleVenta",
  "Compra",
  "DetalleCompra",
  "Inventario",
  "Suministros",
  "Usuario",
];

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a Oracle exitosa (Sequelize).");

    for (const nombre of MODELOS_NOMBRES) {
      const modelo = models[nombre];
      if (!modelo) {
        console.warn(`⚠️ Modelo no definido/exportado: ${nombre}`);
        continue;
      }

      try {
        await modelo.findOne({ raw: true });
        console.log(`✅ Modelo disponible: ${nombre}`);
      } catch (err) {
        console.error(
          `❌ Error accediendo al modelo ${nombre}: ${err.message}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error al conectar con Oracle:", error.message);
  } finally {
    await sequelize.close();
    console.log("🔒 Conexión cerrada.");
  }
})();
