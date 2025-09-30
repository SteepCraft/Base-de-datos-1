import { randomBytes } from "crypto";
import express from "express";
import { rateLimit } from "express-rate-limit";

import { sequelize } from "./src/config/sequelize.js";
import models from "./src/models/index.js";
import applyAssociations from "./src/models/associations.js";

console.log("✅ Configuración completa cargada correctamente");

const app = express();

/**
 * Inicialización de Sequelize
 */
(async () => {
  try {
    // Cargar asociaciones
    applyAssociations(models);

    // Probar conexión
    await sequelize.authenticate();
    console.log("🔗 Conexión con la base de datos establecida correctamente.");

    // Si quieres sincronizar los modelos con la DB
    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    process.exit(1);
  }
})();

/**
 * Middlewares globales
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para generar nonce único por solicitud
app.use((req, res, next) => {
  res.locals.nonce = randomBytes(16).toString("hex");
  next();
});

// Logger básico
app.use((req, res, next) => {
  console.log(`Solicitud entrante: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    userId: req.user?.id || "anonymous",
  });
  next();
});

// Rate limiting
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
 * Rutas básicas
 */
app.get("/", (req, res) => {
  res.send("¡API de Ges2l funcionando correctamente!");
});

app.post("/login", (req, res) => {
  res.json({ user: "demo" });
});

app.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

app.get("/admin", (req, res) => {
  res.send("Admin area");
});

/**
 * Rutas CRUD
 */
import clienteRoutes from "./src/routes/cliente.routes.js";
import productoRoutes from "./src/routes/producto.routes.js";
import proveedorRoutes from "./src/routes/proveedor.routes.js";
import ventasRoutes from "./src/routes/ventas.routes.js";
import detalleVentaRoutes from "./src/routes/detalle_venta.routes.js";
import comprasRoutes from "./src/routes/compras.routes.js";
import detalleComprasRoutes from "./src/routes/detalle_compras.routes.js";
import inventarioRoutes from "./src/routes/inventario.routes.js";
import suministrosRoutes from "./src/routes/suministros.routes.js";
import usuarioRoutes from "./src/routes/usuario.routes.js";

app.use("/api/clientes", clienteRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/detalle-venta", detalleVentaRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/detalle-compras", detalleComprasRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/suministros", suministrosRoutes);
app.use("/api/usuarios", usuarioRoutes);

export default app;
