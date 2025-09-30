import { Router } from "express";
import {
  getAllInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
} from "../controllers/inventario.controller.js";

const router = Router();

router.get("/", getAllInventario);
router.get("/:id", getInventarioById);
router.post("/", createInventario);
router.put("/:id", updateInventario);
router.delete("/:id", deleteInventario);

export default router;
