import { createUsuario } from "../controllers/usuario.controller.js";
import models from "../models/index.js";
import bcrypt from "bcrypt";

const { Usuario } = models;

const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "admin123",
};
export async function initializeAdminUser() {
  try {
    const admin = await Usuario.findOne({
      where: { email: DEFAULT_ADMIN.email },
    });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      await createUsuario({
        email: DEFAULT_ADMIN.email,
        contrasena: hashedPassword,
        nombres: "Admin",
        apellidos: "User",
      });
      console.log("✅ Usuario administrador creado con éxito");
    } else {
      console.log("ℹ️ Usuario administrador ya existe");
    }
  } catch (error) {
    console.error("❌ Error al crear el usuario administrador:", error);
  }
}

// Llamar a esta función en el arranque de la app
await initializeAdminUser();
