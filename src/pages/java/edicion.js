document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Iniciando carga de edición de perfil...");
    
    const sesionActiva = localStorage.getItem("sesionActiva");
    
    if (!sesionActiva) {
        console.log("❌ No hay sesión activa");
        window.location.href = './login.html';
        return;
    }

    const perfil = JSON.parse(localStorage.getItem("usuario"));

    if (!perfil) {
        console.log("❌ No hay datos de usuario en localStorage");
        localStorage.clear();
        window.location.href = './login.html';
        return;
    }

    const emailUsuario = perfil.email || perfil.correo;

    if (!emailUsuario) {
        console.error("❌ No se encontró email del usuario");
        localStorage.clear();
        window.location.href = './login.html';
        return;
    }

    console.log("✅ Usuario encontrado:", emailUsuario);

    let usuario = null;

    // Cargar datos actuales del usuario desde el backend
    try {
        console.log("📡 Obteniendo perfil desde el servidor...");
        
        const res = await fetch("https://proyectoecomerce-io.onrender.com/api/perfil/obtener", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailUsuario })
        });

        const data = await res.json();
        console.log("📦 Datos recibidos del servidor:", data);

        if (!res.ok) {
            throw new Error(data.message || "No se pudo obtener perfil");
        }

        usuario = data.usuario;

        // Rellenar el formulario con los datos del usuario
        const emailInput = document.querySelector('input[type="email"]');
        const nombreInput = document.querySelector('input[placeholder*="nombre"], input[value*="andres"]');
        const apellidoInput = document.querySelector('input[placeholder*="apellido"], input[value*="martinez"]');
        const edadInput = document.querySelector('input[type="number"]');

        console.log("🔍 Elementos encontrados:");
        console.log("- Email input:", emailInput);
        console.log("- Nombre input:", nombreInput);
        console.log("- Apellido input:", apellidoInput);
        console.log("- Edad input:", edadInput);

        if (emailInput) emailInput.value = usuario.email || usuario.correo || "";
        if (nombreInput) nombreInput.value = usuario.nombre || "";
        if (apellidoInput) apellidoInput.value = usuario.apellido || "";
        if (edadInput) edadInput.value = usuario.edad || "";

        // Actualizar avatar
        const avatarElement = document.querySelector('.rounded-full.bg-blue-600, .rounded-full.text-white, [class*="purple"]');
        if (avatarElement) {
            const avatar = `${usuario.nombre?.[0] || ""}${usuario.apellido?.[0] || ""}`.toUpperCase() || "U";
            avatarElement.textContent = avatar;
            console.log("✅ Avatar actualizado:", avatar);
        }

        console.log("✅ Formulario cargado correctamente");

    } catch (error) {
        console.error("❌ Error al obtener el perfil:", error);
        alert("Error al cargar los datos: " + error.message);
        return;
    }

    // Manejar el botón "Guardar Cambios"
    const guardarBtn = document.querySelector('button:has(.icon-check), button[type="submit"]');
    
    if (guardarBtn) {
        console.log("✅ Botón 'Guardar' encontrado");
        
        guardarBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            console.log("💾 Guardando cambios...");

            // Obtener valores del formulario
            const emailInput = document.querySelector('input[type="email"]');
            const nombreInput = document.querySelectorAll('input[type="text"]')[0];
            const apellidoInput = document.querySelectorAll('input[type="text"]')[1];
            const edadInput = document.querySelector('input[type="number"]');

            const correo = emailInput?.value.trim();
            const nombre = nombreInput?.value.trim();
            const apellido = apellidoInput?.value.trim();
            const edad = parseInt(edadInput?.value);

            console.log("📝 Datos a guardar:", { correo, nombre, apellido, edad });

            // Validaciones
            if (!correo || !correo.includes("@")) {
                alert("Debes ingresar un correo válido");
                return;
            }

            if (!nombre || !apellido) {
                alert("El nombre y apellido son obligatorios");
                return;
            }

            if (isNaN(edad) || edad < 1 || edad > 120) {
                alert("La edad debe ser un número válido entre 1 y 120");
                return;
            }

            try {
                const res = await fetch("http://localhost:8081/api/perfil/actualizar", {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        emailActual: emailUsuario,
                        emailNuevo: correo,
                        nombre,
                        apellido,
                        edad
                    })
                });

                const data = await res.json();
                console.log("✅ Respuesta del servidor:", data);

                if (!res.ok) {
                    throw new Error(data.message || "Error al actualizar perfil");
                }

                // Actualizar localStorage con el nuevo email
                const usuarioActualizado = {
                    email: correo,
                    correo: correo,
                    nombre,
                    apellido,
                    edad
                };

                localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

                // Si el email cambió, mostrar mensaje especial
                if (emailUsuario !== correo) {
                    alert("¡Perfil actualizado correctamente!\n\n⚠️ IMPORTANTE: Tu correo ha cambiado.\nAhora debes iniciar sesión con: " + correo);
                    
                    // Cerrar sesión automáticamente para que inicie con el nuevo correo
                    localStorage.clear();
                    
                    setTimeout(() => {
                        window.location.href = './login.html';
                    }, 2000);
                } else {
                    alert("¡Perfil actualizado correctamente!");
                    
                    // Redirigir al perfil
                    setTimeout(() => {
                        window.location.href = './perfil.html';
                    }, 1000);
                }

            } catch (error) {
                console.error("❌ Error al actualizar perfil:", error);
                alert("Error al actualizar el perfil: " + error.message);
            }
        });
    }

    // Manejar botón "Cancelar"
    const cancelarBtn = document.querySelector('button:has(.icon-x), button[onclick*="Cancelar"]');
    if (cancelarBtn) {
        console.log("✅ Botón 'Cancelar' encontrado");
        cancelarBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("¿Deseas cancelar los cambios?")) {
                window.location.href = './perfil.html';
            }
        });
    }

    // Manejar botón "Eliminar cuenta"
    const eliminarBtn = document.querySelector('button:has(.icon-trash), button[class*="bg-red"], button[class*="bg-gray"]');
    if (eliminarBtn && eliminarBtn.textContent.includes("Eliminar")) {
        console.log("✅ Botón 'Eliminar' encontrado");
        eliminarBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("⚠️ ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción NO se puede deshacer.")) {
                alert("Funcionalidad de eliminación de cuenta pendiente de implementar");
                // TODO: Implementar eliminación de cuenta
            }
        });
    }

    // Actualizar avatar en tiempo real cuando cambien nombre o apellido
    const inputs = document.querySelectorAll('input[type="text"]');
    if (inputs.length >= 2) {
        const actualizarAvatar = () => {
            const nombre = inputs[0].value.trim();
            const apellido = inputs[1].value.trim();
            const avatar = `${nombre[0] || ""}${apellido[0] || ""}`.toUpperCase() || "U";
            
            const avatarElement = document.querySelector('.rounded-full.bg-blue-600, .rounded-full.text-white, [class*="purple"]');
            if (avatarElement) {
                avatarElement.textContent = avatar;
            }
        };

        inputs[0].addEventListener("input", actualizarAvatar);
        inputs[1].addEventListener("input", actualizarAvatar);
    }

    console.log("✅ Todos los event listeners configurados");
});