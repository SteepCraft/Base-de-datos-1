import { Router } from "express";
import ClienteController from "../controllers/cliente.controller.js";

const router = Router();

router.get("/", ClienteController.getAllClientes);
router.get("/:id", ClienteController.getClienteById);
router.post("/", ClienteController.createCliente);
router.put("/:id", ClienteController.updateCliente);
router.delete("/:id", ClienteController.deleteCliente);

export default router;
