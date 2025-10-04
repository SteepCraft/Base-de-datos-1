import { Router } from "express";
import DetalleVentaController from "../controllers/detalle_venta.controller.js";

const router = Router();

router.get("/", DetalleVentaController.getAllDetalleVenta);
router.get(
  "/:venta_codigo/:codigo_producto",
  DetalleVentaController.getDetalleVentaById
);
router.post("/", DetalleVentaController.createDetalleVenta);
router.put(
  "/:venta_codigo/:codigo_producto",
  DetalleVentaController.updateDetalleVenta
);
router.delete(
  "/:venta_codigo/:codigo_producto",
  DetalleVentaController.deleteDetalleVenta
);

export default router;
