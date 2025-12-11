import express from "express";
import { obtenerPerfil, actualizarPerfil } from "../controllers/perfil.js";

const router = express.Router();

// Ruta para obtener perfil
router.post("/obtener", obtenerPerfil);

// Ruta para actualizar perfil
router.put("/actualizar", actualizarPerfil);

export default router;