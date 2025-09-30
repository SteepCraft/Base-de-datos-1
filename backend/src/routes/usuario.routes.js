import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";

const router = Router();

router.get("/", UsuarioController.getAllUsuarios);
router.get("/:id", UsuarioController.getUsuarioById);
router.post("/", UsuarioController.createUsuario);
router.put("/:id", UsuarioController.updateUsuario);
router.delete("/:id", UsuarioController.deleteUsuario);

export default router;
