import express from "express";
import {CrearProductos,obtenerProductos} from "../controllers/productoController.js";
const router = express.Router();
// Ruta para crear un nuevo producto
router.post("/", CrearProductos);
// ruta para obtener productos
router.get("/", obtenerProductos);
export default router;