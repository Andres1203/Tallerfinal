import productosModel from '../models/producto.js';

// Crear producto
export const CrearProductos = async (req, res) => {
  try {
    const { productID, nombre, descripcion, precio, image } = req.body;

    const newProduct = new productosModel({
      productID,
      nombre,
      descripcion,
      precio,
      image,
    });

    await newProduct.save();
    res.status(201).json({ message: "Producto guardado con éxito" });

  } catch (error) {
    console.error("Error al guardar el producto:", error.message);
    res.status(400).json({ message: "Error al ingresar el producto", error: error.message });
  }
};

// Obtener productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await productosModel.find();
    res.json(productos);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error: error.message });
  }
};
