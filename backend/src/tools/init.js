import { sequelize } from "../config/sequelize.js";
import models from "../models/index.js";
import bcrypt from "bcrypt";

// Definición de credenciales de administrador por defecto
const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "admin123",
  nombres: "Admin",
  apellidos: "User",
};

/**
 * Función que verifica si el usuario administrador existe y lo crea si no.
 * @async
 * @throws {Error} Si falla la operación de base de datos o el hasheo.
 */
async function initializeAdminUser() {
  // Ahora que 'models' es el objeto importado, lo desestructuramos.
  const { Usuario } = models;

  if (!Usuario) {
    throw new Error(
      "El modelo 'Usuario' no está disponible. Asegúrate de que el archivo 'src/models/index.js' lo cargue y exporte correctamente."
    );
  }

  try {
    // 1. Buscar usuario
    const admin = await Usuario.findOne({
      where: { email: DEFAULT_ADMIN.email },
    });

    if (!admin) {
      // 2. Hashear la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        DEFAULT_ADMIN.password,
        saltRounds
      ); // 3. Crear el usuario

      await Usuario.create({
        email: DEFAULT_ADMIN.email,
        contrasena: hashedPassword,
        nombres: DEFAULT_ADMIN.nombres,
        apellidos: DEFAULT_ADMIN.apellidos,
      });
      console.log("✅ Usuario administrador creado con éxito.");
    } else {
      console.log("ℹ️ Usuario administrador ya existe.");
    }
  } catch (error) {
    console.error("❌ Error al crear el usuario administrador:", error.message);
    // DEBUG: Recomendación para el error NJS-016 de Oracle
    if (error.message.includes("NJS-016")) {
      console.error(
        "⚠️ SUGERENCIA: El error NJS-016 (buffer too small) es un problema del driver de Oracle."
      );
      console.error(
        "⚠️ Esto se soluciona configurando un tamaño de buffer mayor en la instancia de 'oracledb' en tu archivo de conexión ('../config/sequelize.js')."
      );
    }

    throw error; // Relanzar para ser capturado por la función init
  }
}

/**
 * Función principal asíncrona para iniciar todas las tareas de configuración.
 */
async function init() {
  console.log("========================================");
  console.log("  INICIO: CONFIGURACIÓN INICIAL Y ADMIN ");
  console.log("========================================");

  try {
    // 1. Autenticar la conexión (verifica credenciales)
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida.");

    // 2. Sincronizar modelos (crea/actualiza tablas si no existen)
    console.log("⏳ Sincronizando modelos con la base de datos...");
    await sequelize.sync();
    console.log("✅ Modelos sincronizados correctamente.");

    // 3. Inicializar el usuario administrador por defecto
    console.log("⏳ Verificando/creando usuario administrador...");
    await initializeAdminUser();

    console.log("========================================");
    console.log(" ✅ PROCESO DE INICIALIZACIÓN COMPLETADO ");
    console.log("========================================");

    // Finaliza el proceso correctamente
    process.exit(0);
  } catch (error) {
    console.error("❌ ERROR CRÍTICO DURANTE LA INICIALIZACIÓN:", error.message);
    process.exit(1);
  }
}

// Ejecutar la función principal.
init();
