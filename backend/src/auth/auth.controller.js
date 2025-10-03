import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import models from "../models/index.js";

dotenv.config();

const { JWT_SECRET } = process.env;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true" || false;
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? undefined;

// Validar configuracion mínima
if (!JWT_SECRET) {
  console.error(
    "🚨 JWT_SECRET no definido en .env - el login no funcionará hasta definirlo."
  );
  // No hacemos throw aquí para no romper imports; pero signToken comprobará.
}

function parseDurationToMs(v) {
  if (!v) return undefined;
  if (typeof v !== "string") return undefined;
  if (v.endsWith("h")) return parseInt(v.slice(0, -1), 10) * 3600 * 1000;
  if (v.endsWith("m")) return parseInt(v.slice(0, -1), 10) * 60 * 1000;
  if (v.endsWith("d")) return parseInt(v.slice(0, -1), 10) * 24 * 3600 * 1000;
  if (/^\d+$/.test(v)) return parseInt(v, 10) * 1000; // segundos
  return undefined;
}

function signToken(payload) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET no configurado");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function cookieOptions() {
  const options = {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SECURE ? "none" : "lax",
    maxAge: parseDurationToMs(JWT_EXPIRES_IN) ?? 60 * 60 * 1000, // fallback 1h
    path: "/", // Asegurar que la cookie esté disponible en todas las rutas
  };

  // Solo agregar domain si está definido y no vacío
  if (COOKIE_DOMAIN && COOKIE_DOMAIN.trim() !== "") {
    options.domain = COOKIE_DOMAIN;
  }

  return options;
}

class AuthController {
  static async login(req, res) {
    try {
      // body parser debe estar aplicado en app.js
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña requeridos" });
      }

      // Extraer Usuario desde models (asegúrate que models exporta Usuario)
      const Usuario = models?.Usuario;
      if (!Usuario) {
        console.error(
          "models.Usuario no disponible:",
          Object.keys(models || {})
        );
        return res
          .status(500)
          .json({ error: "Error interno: modelos no disponibles" });
      }

      // Buscar usuario; pedir explícitamente la columna de contraseña
      // (algunas configuraciones de modelos pueden marcar contrasena como excluded)
      const user = await Usuario.findOne({
        where: { email },
        attributes: {
          include: ["nombres", "apellidos", "telefono", "email"],
        },
      });

      if (!user) {
        // no decir "usuario no existe" para no filtrar información
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // Obtener hash de contraseña de forma segura (soportar varios nombres)
      // `user` es instancia Sequelize; usar get() es más seguro
      const d =
        typeof user.get === "function" ? user.get({ plain: true }) : user;
      const hash = d.contrasena;
      if (!hash) {
        console.error("Usuario encontrado pero sin hash de contraseña:", {
          id: d.id,
          email: d.email,
        });
        return res
          .status(500)
          .json({ error: "Error interno de autenticación" });
      }

      // Comparar
      const match = await bcrypt.compare(password, hash);
      if (!match) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // Payload mínimo
      const payload = { id: d.id, email: d.email };

      // Firmar token (capturará si falta JWT_SECRET)
      let token;
      try {
        token = signToken(payload);
      } catch (err) {
        console.error("Error firmando token:", err.message);
        return res
          .status(500)
          .json({ error: "Error interno de autenticación" });
      }

      // Primero limpiar cualquier cookie antigua (eliminar firmas viejas)
      res.clearCookie("access_token", {
        httpOnly: true,
        path: "/",
      });

      // Enviar cookie NUEVA
      const options = cookieOptions();
      console.log(
        "🍪 Configurando cookie con opciones:",
        JSON.stringify(options, null, 2)
      );
      console.log(
        "🔑 JWT_SECRET actual:",
        JWT_SECRET ? `${JWT_SECRET.substring(0, 20)}...` : "NO DEFINIDO"
      );
      console.log(
        "📝 Token generado (primeros 50 chars):",
        `${token.substring(0, 50)}...`
      );

      res.cookie("access_token", token, options);

      const safeUser = {
        id: d.id,
        email: d.email,
        nombres: d.nombres,
        apellidos: d.apellidos,
        telefono: d.telefono,
        foto_perfil: d.foto_perfil,
        estado: d.estado,
      };

      return res.json({
        message: "Login exitoso",
        user: safeUser,
      });
    } catch (err) {
      console.error("Auth.login error:", err);
      return res.status(500).json({ error: "Error interno de autenticación" });
    }
  }

  static async logout(req, res) {
    try {
      const clearOptions = {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SECURE ? "none" : "lax",
        path: "/",
      };

      if (COOKIE_DOMAIN && COOKIE_DOMAIN.trim() !== "") {
        clearOptions.domain = COOKIE_DOMAIN;
      }

      res.clearCookie("access_token", clearOptions);
      return res.json({ message: "Logout exitoso" });
    } catch (err) {
      console.error("Auth.logout error:", err);
      return res.status(500).json({ error: "Error interno" });
    }
  }

  static async me(req, res) {
    try {
      if (!req.user) return res.status(401).json({ error: "No autenticado" });

      const Usuario = models?.Usuario;
      if (!Usuario) return res.status(500).json({ error: "Error interno" });

      const user = await Usuario.findByPk(req.user.id, {
        attributes: [
          "id",
          "email",
          "nombres",
          "apellidos",
          "telefono",
          "foto_perfil",
          "estado",
        ],
      });

      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });

      return res.json({ user: user.get({ plain: true }) });
    } catch (err) {
      console.error("Auth.me error:", err);
      return res.status(500).json({ error: "Error interno" });
    }
  }
}

export default AuthController;
