import { Router } from "express";
import CompraController from "../controllers/compras.controller.js";

const router = Router();

router.get("/", CompraController.getAllCompra);
router.get("/:id", CompraController.getCompraById);
router.post("/", CompraController.createCompra);
router.put("/:id", CompraController.updateCompra);
router.delete("/:id", CompraController.deleteCompra);

export default router;
