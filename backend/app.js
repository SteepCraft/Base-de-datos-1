import { randomBytes } from "crypto";

import express from "express";
import { rateLimit } from "express-rate-limit";


console.log("✅ Configuración completa cargada correctamente");

const app = express();

// --- Middleware para generar nonce único por solicitud ---
app.use((req, res, next) => {
  res.locals.nonce = randomBytes(16).toString("hex");
  next();
});

app.use((req, res, next) => {
  console.log(`Solicitud entrante: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    userId: req.user?.id || "anonymous",
  });
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message:
    "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo después de 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

/**
 * Middlewares para parsear el cuerpo de las solicitudes
 */
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Rutas CRUD para cada modelo
import clienteRoutes from "./src/routes/cliente.routes.js";
import productoRoutes from "./src/routes/producto.routes.js";
import proveedorRoutes from "./src/routes/proveedor.routes.js";
import ventasRoutes from "./src/routes/ventas.routes.js";
import detalleVentaRoutes from "./src/routes/detalle_venta.routes.js";
import comprasRoutes from "./src/routes/compras.routes.js";
import detalleComprasRoutes from "./src/routes/detalle_compras.routes.js";
import inventarioRoutes from "./src/routes/inventario.routes.js";
import suministrosRoutes from "./src/routes/suministros.routes.js";

app.use("/api/clientes", clienteRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/detalle-venta", detalleVentaRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/detalle-compras", detalleComprasRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/suministros", suministrosRoutes);

export default app;
