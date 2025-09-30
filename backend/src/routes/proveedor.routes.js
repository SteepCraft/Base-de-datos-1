import { Router } from "express";
import ProveedorController from "../controllers/proveedor.controller.js";

const router = Router();

router.get("/", ProveedorController.getAllProveedores);
router.get("/:id", ProveedorController.getProveedorById);
router.post("/", ProveedorController.createProveedor);
router.put("/:id", ProveedorController.updateProveedor);
router.delete("/:id", ProveedorController.deleteProveedor);

export default router;
