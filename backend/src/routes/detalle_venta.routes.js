import { Router } from "express";
import DetalleVentaController from "../controllers/detalle_venta.controller.js";

const router = Router();

router.get("/", DetalleVentaController.getAllDetalleVenta);
router.get(
  "/:codi_venta/:codi_producto",
  DetalleVentaController.getDetalleVentaById
);
router.post("/", DetalleVentaController.createDetalleVenta);
router.put(
  "/:codi_venta/:codi_producto",
  DetalleVentaController.updateDetalleVenta
);
router.delete(
  "/:codi_venta/:codi_producto",
  DetalleVentaController.deleteDetalleVenta
);

export default router;
