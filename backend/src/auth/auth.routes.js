// src/routes/auth.routes.js
import express from "express";
import AuthController from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";

const router = express.Router();

// Login: retorna cookie HttpOnly (access_token) y también el JWT en body opcionalmente
router.post("/login", AuthController.login);

// Logout: borra cookie
router.post("/logout", authenticate, AuthController.logout);

// Obtener info del usuario autenticado
router.get("/me", authenticate, AuthController.me);

export default router;
