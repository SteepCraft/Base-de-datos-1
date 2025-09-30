import { Router } from "express";
import {
  getAllSuministros,
  getSuministroById,
  createSuministro,
  updateSuministro,
  deleteSuministro,
} from "../controllers/suministros.controller.js";

const router = Router();

router.get("/", getAllSuministros);
router.get("/:id_proveedor/:codi_producto", getSuministroById);
router.post("/", createSuministro);
router.put("/:id_proveedor/:codi_producto", updateSuministro);
router.delete("/:id_proveedor/:codi_producto", deleteSuministro);

export default router;
