import pedido from "../models/pedido.js"

// Crear pedido
export const crearpedido = async (req, res) => {
    try {
        const {
            precio, 
            precioTotal, 
            fechapedido, 
            direccion, 
            codigopostal, 
            fechaPedido,
            direccionEntrega, 
            estado, 
            metodoPago 
        } = req.body;

        const newpedido = new pedido({
            precio, 
            precioTotal, 
            fechapedido, 
            direccion, 
            codigopostal, 
            fechaPedido,
            direccionEntrega, 
            estado, 
            metodoPago
        });

        await newpedido.save();
        res.status(201).json({ message: "Pedido realizado con éxito" });
    } catch (error) {
        console.error("Error al crear pedido:", error.message);
        res.status(400).json({ message: "Error al crear pedido", error: error.message });
    }
};

// Obtener pedidos
export const obtenerpedido = async (req, res) => {
    try {
        const pedidos = await pedido.find(); 
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener los pedidos", 
            error: error.message 
        });
    }
};