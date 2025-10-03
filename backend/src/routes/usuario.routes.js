import { Router } from "express";
import { authenticate, authorizeAdmin } from "../auth/auth.middleware.js";
import UsuarioController from "../controllers/usuario.controller.js";

const router = Router();

// Todas las rutas de usuarios requieren autenticación
router.use(authenticate);

// Solo el super admin (id=1) puede gestionar usuarios
router.get("/", authorizeAdmin, UsuarioController.getAllUsuarios);
router.get("/:id", authorizeAdmin, UsuarioController.getUsuarioById);
router.post("/", authorizeAdmin, UsuarioController.createUsuario);
router.put("/:id", authorizeAdmin, UsuarioController.updateUsuario);
router.delete("/:id", authorizeAdmin, UsuarioController.deleteUsuario);

export default router;
