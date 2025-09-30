import { sequelize } from "./sequelize.js";
import { Cliente, Producto, Proveedor, Ventas, DetalleVenta, Compras, DetalleCompras, Inventario, Suministros, Usuario } from "../models/index.js";
//puede llegar a fallar por el puerto si se llega a modificar (en .env)
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a Oracle exitosa (Sequelize)");
    // Probar acceso a cada modelo
    const modelos = [
      ["Cliente", Cliente],
      ["Producto", Producto],
      ["Proveedor", Proveedor],
      ["Ventas", Ventas],
      ["DetalleVenta", DetalleVenta],
      ["Compras", Compras],
      ["DetalleCompras", DetalleCompras],
      ["Inventario", Inventario],
      ["Suministros", Suministros],
      ["Usuario", Usuario],
    ];
    for (const [nombre, modelo] of modelos) {
      try {
        await modelo.findOne();
        console.log(`✅ Modelo disponible: ${nombre}`);
      } catch (err) {
        console.error(`❌ Error accediendo al modelo ${nombre}:`, err.message);
      }
    }
  } catch (error) {
    console.error("❌ Error al conectar con Oracle:", error);
  } finally {
    await sequelize.close();
  }
})();
