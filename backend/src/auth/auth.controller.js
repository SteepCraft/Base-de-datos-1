import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import { Usuario } from "../models/index.js"; // ajusta la importación según tu index

configDotenv();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true" || false;
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? undefined;

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    domain: COOKIE_DOMAIN,
    maxAge: (() => {
      // intentar parsear expresiones básicas como "1h", "15m", o usar seconds
      const v = JWT_EXPIRES_IN;
      if (!v) return undefined;
      if (v.endsWith("h")) return parseInt(v.slice(0, -1), 10) * 3600 * 1000;
      if (v.endsWith("m")) return parseInt(v.slice(0, -1), 10) * 60 * 1000;
      if (v.endsWith("d"))
        return parseInt(v.slice(0, -1), 10) * 24 * 3600 * 1000;
      return undefined;
    })(),
  };
}

export const AuthController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña requeridos" });
      }

      // Buscar usuario por email
      const user = await Usuario.findOne({ where: { email } });
      if (!user)
        return res.status(401).json({ error: "Credenciales inválidas" });

      // Comparar contraseña (asume bcrypt)
      const match = await bcrypt.compare(
        password,
        user.contrasena || user.password || ""
      );
      if (!match)
        return res.status(401).json({ error: "Credenciales inválidas" });

      // Construir payload seguro para el token (no incluir contrasena)
      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = signToken(payload);

      // Set cookie HttpOnly
      res.cookie("access_token", token, cookieOptions());

      // Responder con datos seguros del usuario (no enviar contrasena)
      const safeUser = {
        id: user.id,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        telefono: user.telefono,
      };

      return res.json({
        message: "Login exitoso",
        user: safeUser,
        accessToken: token,
      });
    } catch (err) {
      console.error("Auth.login error:", err);
      return res.status(500).json({ error: "Error interno de autenticación" });
    }
  },

  async logout(req, res) {
    try {
      // Clear cookie
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: COOKIE_SECURE,
        domain: COOKIE_DOMAIN,
        sameSite: "lax",
      });
      return res.json({ message: "Logout exitoso" });
    } catch (err) {
      console.error("Auth.logout error:", err);
      return res.status(500).json({ error: "Error interno" });
    }
  },

  async me(req, res) {
    try {
      // authenticate middleware llenará req.user
      if (!req.user) return res.status(401).json({ error: "No autenticado" });

      // Puedes recargar usuario desde DB si quieres datos frescos
      const user = await Usuario.findByPk(req.user.id);
      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });

      const safeUser = {
        id: user.id,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        telefono: user.telefono,
      };

      return res.json({ user: safeUser });
    } catch (err) {
      console.error("Auth.me error:", err);
      return res.status(500).json({ error: "Error interno" });
    }
  },
};
