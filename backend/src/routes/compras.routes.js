import { Router } from "express";
import {
  getAllCompras,
  getCompraById,
  createCompra,
  updateCompra,
  deleteCompra,
} from "../controllers/compras.controller.js";

const router = Router();

router.get("/", getAllCompras);
router.get("/:id", getCompraById);
router.post("/", createCompra);
router.put("/:id", updateCompra);
router.delete("/:id", deleteCompra);

export default router;
