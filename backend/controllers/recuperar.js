import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";

const transporte = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    }
})

// función de generar código de 6 dígitos
const generarCodigo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

//solicita codigo de verificación
export const solicitarCodigo = async (req, res) => {
    try {
        // ✅ CORREGIDO: Acepta tanto 'email' como 'correo'
        const { correo, email } = req.body;
        const emailUsuario = correo || email;

        if (!emailUsuario) {
            return res.status(400).json({
                message: "El correo electrónico es obligatorio"
            });
        }

        console.log('📧 Buscando usuario con email:', emailUsuario);

        // Buscar usuario por correo o email
        const usuario = await User.findOne({ 
            $or: [
                { correo: emailUsuario },
                { email: emailUsuario }
            ]
        });

        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            return res.status(404).json({
                message: "Correo electrónico no encontrado"
            });
        }
        
        console.log('✅ Usuario encontrado:', usuario.nombre);
        
        // Generar código de 6 digitos
        const codigo = generarCodigo();
        
        // Guardar código con expiración de 15 minutos
        usuario.codigoRecuperacion = codigo;
        usuario.codigoExpiracion = Date.now() + 900000; //15 minutos 
        await usuario.save();

        console.log('🔑 Código generado:', codigo);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: usuario.correo || usuario.email,
            subject: 'Código de recuperación - TechStore Pro',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #4F46E5; margin: 0;">TechStore Pro</h2>
                </div>

                <h3 style="color: #333;">Recuperación de Contraseña</h3>

                <p>Hola <strong>${usuario.nombre}</strong>,</p>

                <p>Recibimos una solicitud para restablecer tu contraseña.</p>

                <p>Tu código de verificación es:</p>

                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0;">
                    <h1 style="color: white; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">
                        ${codigo}
                    </h1>
                </div>

                <p style="color: #666; font-size: 14px;">
                    Este código expirará en <strong>15 minutos</strong>.
                </p>

                <p style="color: #666; font-size: 14px;">
                    Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá segura.
                </p>

                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

                <p style="color: #999; font-size: 12px; text-align: center;">
                    © 2025 TechStore Pro - Tu tienda de tecnología de confianza
                </p>
            </div>
            `
        };
        
        // Enviar email
        await transporte.sendMail(mailOptions);

        console.log(`✅ Código enviado a ${usuario.correo || usuario.email}: ${codigo}`);

        res.status(200).json({
            message: "Código enviado exitosamente. Revisa tu correo electrónico"
        });

    } catch(error) {
        console.error("❌ Error al enviar el código:", error);
        res.status(500).json({
            message: "Error al procesar la solicitud",
            error: error.message
        });
    }
};

// Verifica código y cambia contraseña
export const cambiarPassword = async (req, res) => {
    try {
        const { correo, codigo, nuevaPassword } = req.body;
        
        console.log('🔐 Intentando cambiar contraseña para:', correo);
        console.log('🔑 Código recibido:', codigo);
        
        // Validaciones
        if (!correo || !codigo || !nuevaPassword) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        if (nuevaPassword.length < 6) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        // Buscar usuario
        const usuario = await User.findOne({ 
            $or: [
                { correo: correo },
                { email: correo }
            ]
        });

        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            return res.status(404).json({ 
                message: "Usuario no encontrado" 
            });
        }

        console.log('✅ Usuario encontrado:', usuario.nombre);
        console.log('🔑 Código almacenado:', usuario.codigoRecuperacion);

        // Verificar código
        if (usuario.codigoRecuperacion !== codigo) {
            console.log('❌ Código inválido');
            return res.status(400).json({ 
                message: "Código inválido" 
            });
        }

        // Verificar expiración
        if (!usuario.codigoExpiracion || Date.now() > usuario.codigoExpiracion) {
            console.log('❌ Código expirado');
            return res.status(400).json({ 
                message: "El código ha expirado. Solicita uno nuevo." 
            });
        }

        console.log('✅ Código válido, actualizando contraseña...');

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

        // Actualizar contraseña y limpiar código
        usuario.password = hashedPassword;
        usuario.codigoRecuperacion = undefined;
        usuario.codigoExpiracion = undefined;
        await usuario.save();

        console.log('✅ Contraseña actualizada exitosamente');

        // Email de confirmación
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: usuario.correo || usuario.email,
            subject: 'Contraseña Actualizada - TechStore Pro',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                width: 60px;
                                height: 60px;
                                border-radius: 50%;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                margin-bottom: 20px;">
                        <span style="color: white; font-size: 30px;">✓</span>
                    </div>

                    <h2 style="color: #4F46E5; margin: 0;">Contraseña Actualizada</h2>
                </div>

                <p>Hola <strong>${usuario.nombre}</strong>,</p>

                <p>Tu contraseña ha sido actualizada exitosamente.</p>

                <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://127.0.0.1:5500/src/pages/login.html"
                        style="background: linear-gradient(to right, #4F46E5, #7C3AED);
                                color: white;
                                padding: 12px 30px;
                                text-decoration: none;
                                border-radius: 8px;
                                display: inline-block;">
                        Iniciar Sesión
                    </a>
                </div>

                <p style="color: #dc2626; font-size: 14px;">
                    ⚠ Si no realizaste este cambio, contacta a soporte inmediatamente.
                </p>

                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

                <p style="color: #999; font-size: 12px; text-align: center;">
                    © 2025 TechStore Pro - Tu tienda de tecnología de confianza
                </p>
            </div>
            `
        };

        try {
            await transporte.sendMail(mailOptions);
            console.log('📧 Email de confirmación enviado');
        } catch (emailError) {
            console.log('⚠️ Error al enviar email de confirmación:', emailError.message);
            // No fallar la operación si el email no se envía
        }
        
        res.status(200).json({
            message: "Contraseña actualizada exitosamente"
        });

    } catch (error) {
        console.error("❌ Error al cambiar contraseña:", error);
        res.status(500).json({
            message: "Error al cambiar contraseña",
            error: error.message
        });
    }
};