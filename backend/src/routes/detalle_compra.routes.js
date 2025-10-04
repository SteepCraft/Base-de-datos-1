import { Router } from "express";
import DetalleCompraController from "../controllers/detalle_compra.controller.js";

const router = Router();

router.get("/", DetalleCompraController.getAllDetalleCompra);
router.get(
  "/:codigo_compra/:codigo_producto",
  DetalleCompraController.getDetalleCompraById
);
router.post("/", DetalleCompraController.createDetalleCompra);
router.put(
  "/:codigo_compra/:codigo_producto",
  DetalleCompraController.updateDetalleCompra
);
router.delete(
  "/:codigo_compra/:codigo_producto",
  DetalleCompraController.deleteDetalleCompra
);

export default router;
