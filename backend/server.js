import express from 'express';
import cors from 'cors';
import "./db/db.js";
import productosroute from "./routes/producto.js";
import userroute from "./routes/user.js";
import { loginUsuario } from './controllers/login.js';
import obtenerPerfil from './routes/perfil.js';
import recuperarRoute from './routes/recuperar.js'; 
import pedidoRoute from './routes/pedido.js'; 

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send('Bienvenido al curso de node express');
});

app.use("/api/productos", productosroute);
app.use("/api/usuario", userroute);
app.post("/api/usuario/login", loginUsuario);
app.use("/api/perfil", obtenerPerfil);
app.use("/api/recuperar", recuperarRoute);
app.use("/api/pedido", pedidoRoute); // 

app.listen(8081, () => {
    console.log('✅ Servidor corriendo en http://localhost:8081');
    
});