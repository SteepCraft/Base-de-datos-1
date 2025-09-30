import { Router } from "express";
import {
  getAllVentas,
  getVentaById,
  createVenta,
} from "../controllers/ventas.controller.js";

const router = Router();

router.get("/", getAllVentas);
router.get("/:id", getVentaById);
router.post("/", createVenta);

export default router;
