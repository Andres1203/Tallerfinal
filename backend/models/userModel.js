import mongoose from "mongoose";

const pedidoShema = new mongoose.Schema({
  precio: { type: Number, required: true },
  precioTotal: { type: Number, required: true },
  fechapedido: { type: Date, required: true }, 
  direccion: { type: String, required: true }, 
  codigopostal: { type: String, required: true }, 
  fechaPedido: { type: Date, default: Date.now },
  direccionEntrega: { type: String, required: true },
  estado: {
    type: String,
    enum: ["pendiente", "preparando", "enviado", "entregado", "cancelado"],
    default: "pendiente",
  },
  metodoPago: {
    type: String,
    enum: ["efectivo", "tarjeta", "nequi", "daviplata", "paypal"],
    required: true,
  },
});

const pedido = mongoose.model("pedido", pedidoShema, "pedido");

export default pedido;