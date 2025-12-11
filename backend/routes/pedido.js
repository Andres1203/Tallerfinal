import express from "express";
import { crearpedido, obtenerpedido } from "../controllers/pedido.js"; 

const router = express.Router();

router.post("/", crearpedido);
router.get("/", obtenerpedido);

export default router;