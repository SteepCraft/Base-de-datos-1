import { Router } from "express";
import VentasController from "../controllers/ventas.controller.js";

const router = Router();

router.get("/", VentasController.getAllVentas);
router.get("/:id", VentasController.getVentaById);
router.post("/", VentasController.createVenta);

export default router;
