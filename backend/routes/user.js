import express from "express";
import resgisterUser from "../controllers/userController.js";

const router = express.Router();


// Ruta para registrar un nuevo usuario
router.post("/register", resgisterUser);
export default router;