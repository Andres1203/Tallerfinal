import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';

// Función para registrar un nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { userID, nombre, apellido, edad, email, password } = req.body;

    // Validar campos obligatorios
    if (!userID || !nombre || !apellido || !email || !password || edad == null) {
      return res.status(400).json({ message: "ponga Todos los campos son obligatorios mk" });
    }

    // Validar longitud de la contraseña ANTES de encriptar
    if (password.length < 10) {
      return res.status(400).json({ message: "La contraseña debe tener mínimo 10 caracteres" });
    }

    // Validar si el email ya está registrado
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "El email ya está en uso"
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const newUser = new userModel({
      userID,
      nombre,
      apellido,
      edad,
      email,
      password: hashedPassword
    });

    await newUser.save();
    return res.status(201).json({ message: "Usuario registrado con éxito" });

  } catch (error) {
    return res.status(400).json({ message: "Error al registrar el usuario", error: error.message });
  }
};
export default registerUser;