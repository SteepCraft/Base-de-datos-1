// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function authenticate(req, res, next) {
  try {
    // 1) tomar token de cookie
    let token = req.cookies?.access_token;

    // 2) si no hay cookie, intentar header Bearer
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // verificar token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      // Attach minimal user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
      next();
    });
  } catch (err) {
    console.error("authenticate middleware error:", err);
    return res.status(500).json({ error: "Error interno de autenticación" });
  }
}

export function authorizeAdmin(req, res, next) {
  if (req.user?.id !== 1) {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
}
