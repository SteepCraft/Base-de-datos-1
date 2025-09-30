import { Router } from "express";
import SuministrosController from "../controllers/suministros.controller.js";

const router = Router();

router.get("/", SuministrosController.getAllSuministros);
router.get(
  "/:id_proveedor/:codi_producto",
  SuministrosController.getSuministroById
);
router.post("/", SuministrosController.createSuministro);
router.put(
  "/:id_proveedor/:codi_producto",
  SuministrosController.updateSuministro
);
router.delete(
  "/:id_proveedor/:codi_producto",
  SuministrosController.deleteSuministro
);

export default router;
