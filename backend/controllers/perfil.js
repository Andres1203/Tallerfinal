import user from "../models/userModel.js";

// Obtener perfil de usuario
export const obtenerPerfil = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "El email es requerido" });
        }

        // Buscar usuario por email
        const usuario = await user.findOne({ email }).select("-password");

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Respuesta correcta
        return res.status(200).json({
            message: "Perfil encontrado",
            usuario: {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                edad: usuario.edad,
                correo: usuario.email
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el perfil",
            error: error.message
        });
    }
};

// Actualizar perfil de usuario
export const actualizarPerfil = async (req, res) => {
    try {
        const { emailActual, emailNuevo, nombre, apellido, edad } = req.body;

        console.log("📝 Datos recibidos para actualizar:", { emailActual, emailNuevo, nombre, apellido, edad });

        // Validar campos obligatorios
        if (!emailActual) {
            return res.status(400).json({ message: "El email actual es requerido" });
        }

        if (!nombre || !apellido || !emailNuevo || edad == null) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Validar edad
        if (edad < 1 || edad > 120) {
            return res.status(400).json({ message: "La edad debe estar entre 1 y 120" });
        }

        // Buscar el usuario actual
        const usuario = await user.findOne({ email: emailActual });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Si el email cambió, verificar que el nuevo no esté en uso
        if (emailActual !== emailNuevo) {
            const emailExiste = await user.findOne({ email: emailNuevo });
            if (emailExiste) {
                return res.status(400).json({ message: "El nuevo email ya está en uso" });
            }
        }

        // Actualizar los datos
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.email = emailNuevo;
        usuario.edad = edad;

        await usuario.save();

        console.log("✅ Perfil actualizado exitosamente");

        return res.status(200).json({
            message: "Perfil actualizado exitosamente",
            usuario: {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                edad: usuario.edad,
                correo: usuario.email
            }
        });

    } catch (error) {
        console.error("❌ Error al actualizar perfil:", error);
        return res.status(500).json({
            message: "Error al actualizar el perfil",
            error: error.message
        });
    }
};