import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log("🔍 Intentando conectar a MongoDB Atlas...");

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 segundos de timeout
      socketTimeoutMS: 45000,
    });
    console.log("✅ Conectado a la base de datos MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error al conectar a la base de datos");
    console.error("Tipo de error:", err.name);
    console.error("Mensaje:", err.message);
    
    if (err.message.includes('EREFUSED')) {
      console.error("\n💡 Solución: Verifica tu conexión a internet o autoriza tu IP en MongoDB Atlas");
    }
    if (err.message.includes('authentication failed')) {
      console.error("\n💡 Solución: Verifica tu usuario y contraseña en MongoDB Atlas");
    }
    
    process.exit(1); // Detiene la app si no puede conectar
  }
};

connectDB();

export default mongoose;