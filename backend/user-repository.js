import { z } from "zod";

const userSchema = z.object({
  email: z.email(),
  contrasena: z.string().min(8).max(100),
  nombres: z.string().min(2).max(100),
  apellidos: z.string().min(2).max(100),
  telefono: z.string().min(10).max(10).optional(),
  foto_perfil: z.url({ protocol: /^https$/ }).optional(),
  estado: z.enum(["ACTIVO", "INACTIVO", "SUSPENDIDO"]).optional(),
});

export class UserRepository {
  constructor() {
    this.users = new Map();
  }

  createUser(data) {
    const user = userSchema.parse(data);
    this.users.set(user.id_usuario, user);
    return user;
  }

  getUserById(id) {
    return this.users.get(id) || null;
  }

  updateUser(id, data) {
    if (!this.users.has(id)) {
      throw new Error("User not found");
    }
    const existingUser = this.users.get(id);
    const updatedUser = userSchema.parse({ ...existingUser, ...data });
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id) {
    return this.users.delete(id);
  }

  listUsers() {
    return Array.from(this.users.values());
  }
}
