import { Router } from "express";
import {
  getAllDetalleCompras,
  getDetalleComprasById,
  createDetalleCompras,
  updateDetalleCompras,
  deleteDetalleCompras
} from "../controllers/detalle_compras.controller.js";

const router = Router();

router.get("/", getAllDetalleCompras);
router.get("/:codi_compra/:codi_producto", getDetalleComprasById);
router.post("/", createDetalleCompras);
router.put("/:codi_compra/:codi_producto", updateDetalleCompras);
router.delete("/:codi_compra/:codi_producto", deleteDetalleCompras);

export default router;
