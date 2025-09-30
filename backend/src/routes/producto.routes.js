import { Router } from "express";
import ProductoController from "../controllers/producto.controller.js";

const router = Router();

router.get("/", ProductoController.getAllProductos);
router.get("/:id", ProductoController.getProductoById);
router.post("/", ProductoController.createProducto);
router.put("/:id", ProductoController.updateProducto);
router.delete("/:id", ProductoController.deleteProducto);

export default router;
