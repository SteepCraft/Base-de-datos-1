import { Router } from "express";
import InventarioController from "../controllers/inventario.controller.js";

const router = Router();

router.get("/", InventarioController.getAllInventario);
router.get("/:id", InventarioController.getInventarioById);
router.post("/", InventarioController.createInventario);
router.put("/:id", InventarioController.updateInventario);
router.delete("/:id", InventarioController.deleteInventario);

export default router;
