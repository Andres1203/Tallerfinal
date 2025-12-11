import express from 'express';
import { solicitarCodigo, cambiarPassword } from '../controllers/recuperar.js';

const router = express.Router();

// Solicitar código de recuperación
router.post('/solicitar-codigo', solicitarCodigo);

// Cambiar contraseña con código
router.post('/cambiar-password', cambiarPassword);

export default router;