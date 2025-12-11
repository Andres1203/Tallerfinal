// pages/recuperar-password.js
// Lógica para solicitar código de recuperación

const API_URL = 'https://proyectoecomerce-io.onrender.com/api/recuperar';

document.addEventListener('DOMContentLoaded', () => {
    const btnEnviarCodigo = document.getElementById('enviar-code');
    const inputEmail = document.getElementById('input-email');

    // Verificar que los elementos existen
    if (!btnEnviarCodigo || !inputEmail) {
        console.error('❌ No se encontraron los elementos del DOM');
        return;
    }

    console.log('✅ Script cargado correctamente');

    btnEnviarCodigo.addEventListener('click', async () => {
        console.log('🔵 Click en botón enviar código');
        
        const email = inputEmail.value.trim();
        console.log('📧 Email ingresado:', email);

        // Validación
        if (!email) {
            mostrarNotificacion('Por favor ingresa un email electrónico', 'error');
            return;
        }

        if (!validarEmail(email)) {
            mostrarNotificacion('Por favor ingresa un email válido', 'error');
            return;
        }

        // Deshabilitar botón mientras se procesa
        btnEnviarCodigo.disabled = true;
        btnEnviarCodigo.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
        `;

        try {
            console.log('🌐 Enviando petición a:', `${API_URL}/solicitar-codigo`);
            console.log('📤 Datos:', { email: email });

            const response = await fetch(`${API_URL}/solicitar-codigo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            console.log('📥 Respuesta recibida - Status:', response.status);

            const data = await response.json();
            console.log('📦 Datos recibidos:', data);

            if (response.ok) {
                // Guardar email en localStorage para usarlo en la siguiente página
                localStorage.setItem('emailRecuperacion', email);
                
                mostrarNotificacion('Código enviado. Revisa tu email electrónico', 'success');
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = './verificar-code.html';
                }, 2000);
            } else {
                console.error('❌ Error del servidor:', data.message);
                mostrarNotificacion(data.message || 'Error al enviar el código', 'error');
                restaurarBoton(btnEnviarCodigo);
            }
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            console.error('Detalles del error:', {
                message: error.message,
                stack: error.stack
            });
            mostrarNotificacion('Error de conexión. Verifica que el servidor esté corriendo en puerto 8081', 'error');
            restaurarBoton(btnEnviarCodigo);
        }
    });

    // Permitir enviar con Enter
    inputEmail.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnEnviarCodigo.click();
        }
    });
});

// Función para restaurar el botón
function restaurarBoton(boton) {
    boton.disabled = false;
    boton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.3" stroke="currentColor" class="w-6 h-6 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
        Enviar código
    `;
}

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    console.log(`🔔 Notificación [${tipo}]:`, mensaje);
    
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl text-white font-semibold z-50 flex items-center gap-3 transition-all duration-500 ${
        tipo === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    
    notificacion.innerHTML = `
        ${tipo === 'success' ? `
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
        ` : `
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
        `}
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateY(0)';
    }, 10);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateY(-20px)';
        setTimeout(() => notificacion.remove(), 500);
    }, 5000);
}