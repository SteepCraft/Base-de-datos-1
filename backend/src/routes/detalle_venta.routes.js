import { Router } from "express";
import {
  getAllDetalleVenta,
  getDetalleVentaById,
  createDetalleVenta,
  updateDetalleVenta,
  deleteDetalleVenta
} from "../controllers/detalle_venta.controller.js";

const router = Router();

router.get("/", getAllDetalleVenta);
router.get("/:codi_venta/:codi_producto", getDetalleVentaById);
router.post("/", createDetalleVenta);
router.put("/:codi_venta/:codi_producto", updateDetalleVenta);
router.delete("/:codi_venta/:codi_producto", deleteDetalleVenta);

export default router;
