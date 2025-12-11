import bcrypt from "bcrypt";
import User from "../models/userModel.js";

// Iniciar sesión
export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
        }

        // Buscar usuario por email
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Validar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        return res.status(200).json({
          message: "Perfil encontrado",
          usuario: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
          },
        });


    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message,
        });
    }
};
