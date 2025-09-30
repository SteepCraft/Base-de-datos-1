import { Router } from "express";
import DetalleCompraController from "../controllers/detalle_compra.controller.js";

const router = Router();

router.get("/", DetalleCompraController.getAllDetalleCompra);
router.get(
  "/:codi_compra/:codi_producto",
  DetalleCompraController.getDetalleCompraById
);
router.post("/", DetalleCompraController.createDetalleCompra);
router.put(
  "/:codi_compra/:codi_producto",
  DetalleCompraController.updateDetalleCompra
);
router.delete(
  "/:codi_compra/:codi_producto",
  DetalleCompraController.deleteDetalleCompra
);

export default router;
