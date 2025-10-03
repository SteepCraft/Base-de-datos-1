import { randomBytes } from "crypto";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { authenticate, authorizeAdmin } from "./src/auth/auth.middleware.js";
import authRoutes from "./src/auth/auth.routes.js";
import { sequelize } from "./src/config/sequelize.js";
import applyAssociations from "./src/models/associations.js";
import models from "./src/models/index.js";
// Rutas CRUD - importa tus routers
import clienteRoutes from "./src/routes/cliente.routes.js";
import compraRoutes from "./src/routes/compra.routes.js";
import inventarioRoutes from "./src/routes/inventario.routes.js";
import productoRoutes from "./src/routes/producto.routes.js";
import proveedorRoutes from "./src/routes/proveedor.routes.js";
import suministrosRoutes from "./src/routes/suministros.routes.js";
import usuarioRoutes from "./src/routes/usuario.routes.js";
import ventasRoutes from "./src/routes/ventas.routes.js";

console.info("✅ Configuración completa cargada correctamente");

const app = express();

/**
 * Inicialización de Sequelize y modelos (idempotente).
 * - Aplica asociaciones solo si no se han aplicado antes.
 * - Autentica, hace sync() (opcional) y prueba cada modelo con findOne().
 */
(async () => {
  try {
    // Aplicar asociaciones de forma idempotente:
    // Si el objeto `models` tiene la marca __associationsApplied evitamos re-aplicar.
    if (!models.__associationsApplied) {
      applyAssociations(models);
      // marcar para evitar re-aplicaciones si este código se ejecuta otra vez
      Object.defineProperty(models, "__associationsApplied", {
        value: true,
        enumerable: false,
        configurable: false,
        writable: false,
      });
      console.log("🔗 Asociaciones aplicadas a los modelos.");
    } else {
      console.log("ℹ️ Asociaciones ya estaban aplicadas, no se re-aplicaron.");
    }

    // Probar conexión
    await sequelize.authenticate();
    console.log("🔗 Conexión con la base de datos establecida correctamente.");

    // Sincronizar modelos con la DB (comentar si no quieres que cree/alter tablas)
    // Nota: en entornos con esquema ya definido en Oracle, evita `sync({ force: true })`
    await sequelize.sync();
    console.log("🗄️ sequelize.sync() completado.");

    // Probar accesibilidad de cada modelo (findOne simple)
    const modelNames = Object.keys(models).filter(
      (k) =>
        typeof models[k] === "function" &&
        typeof models[k].findOne === "function"
    );

    for (const name of modelNames) {
      const model = models[name];
      try {
        // Ejecutar una consulta ligera para verificar conectividad y mapping
        await model.findOne({ raw: true });
        console.log(`✅ Modelo disponible: ${name}`);
      } catch (err) {
        // No detener el arranque por un modelo que falle; mostrar información útil
        console.warn(`⚠️ Modelo NO accesible: ${name} — ${err.message}`);
      }
    }
  } catch (error) {
    console.error("❌ Error al conectar o inicializar modelos:", error);
    // Si la conexión/initialization falla queremos salir para no correr el servidor en mal estado
    process.exit(1);
  }
})();

/**
 * Middlewares globales
 */

// CORS - Permitir peticiones desde el frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // Permitir cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para generar nonce único por solicitud
app.use((req, res, next) => {
  res.locals.nonce = randomBytes(16).toString("hex");
  next();
});

// Logger básico (puedes reemplazar por winston/pino más adelante)
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

app.use(cookieParser());
/* Montar rutas de autenticación */
app.use("/api/auth", authRoutes);

// Rutas protegidas
app.use("/api/cliente", authenticate, clienteRoutes);
app.use("/api/producto", authenticate, productoRoutes);
app.use("/api/proveedor", authenticate, proveedorRoutes);
app.use("/api/venta", authenticate, ventasRoutes);
app.use("/api/compra", authenticate, compraRoutes);
app.use("/api/inventario", authenticate, inventarioRoutes);
app.use("/api/suministro", authenticate, suministrosRoutes);

// Solo super admin (id=1) puede gestionar usuarios
app.use("/api/usuario", usuarioRoutes); // Ya tiene auth y authorizeAdmin internamente

// Rutas de detalles: NO son accesibles directamente
// Se manejan automáticamente al crear ventas/compras
// app.use("/api/detalle-venta", authenticate, detalleVentaRoutes);
// app.use("/api/detalle-compra", authenticate, detalleCompraRoutes);

export default app;
