document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    
    // Si no hay sesión, redirigir al login
    if (!sesionActiva) {
        window.location.href = './login.html';
        return;
    }

    // Obtener datos del usuario desde localStorage
    const perfil = JSON.parse(localStorage.getItem("usuario"));

    if (!perfil) {
        localStorage.clear();
        window.location.href = './login.html';
        return;
    }

    // Usar correo o email (el que esté disponible)
    const emailUsuario = perfil.correo || perfil.email;
    
    if (!emailUsuario) {
        console.error("No se encontró email del usuario");
        localStorage.clear();
        window.location.href = './login.html';
        return;
    }

    let usuario = null;

    try {
        console.log("Obteniendo perfil para:", emailUsuario);

        const res = await fetch("https://proyectoecomerce-io.onrender.com/api/perfil/obtener", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailUsuario })
        });

        const data = await res.json();
        console.log("Respuesta del servidor:", data);

        if (!res.ok) {
            throw new Error(data.message || "No se pudo obtener perfil");
        }

        usuario = data.usuario;

        // ✅ VALIDAR QUE LOS ELEMENTOS EXISTAN
        const profileName = document.getElementById("profile-name");
        const profileEmail = document.getElementById("profile-email");
        const profileEdad = document.getElementById("profile-edad");
        const profileAvatar = document.getElementById("profile-avatar");

        if (!profileName || !profileEmail || !profileEdad || !profileAvatar) {
            console.error("❌ Faltan elementos en el HTML");
            throw new Error("Elementos del perfil no encontrados en el HTML");
        }

        // Mostrar datos en la página del perfil 
        const nombreCompleto = `${usuario?.nombre ?? ""} ${usuario?.apellido ?? ""}`.trim();
        profileName.textContent = nombreCompleto || "Usuario";
        profileEmail.textContent = usuario?.email || usuario?.correo || emailUsuario;
        profileEdad.textContent = usuario?.edad ? `${usuario.edad} años` : "No especificada";

        // Avatar con iniciales
        const avatar = `${usuario?.nombre?.[0] ?? ""}${usuario?.apellido?.[0] ?? ""}`.toUpperCase() || "U";
        profileAvatar.textContent = avatar;

        console.log("✅ Perfil cargado correctamente");

    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        alert("Error al cargar el perfil: " + error.message);
        return;
    }

    // Lógica del botón Cerrar Sesión
    const cerrarBtn = document.getElementById("cierra");
    if (cerrarBtn) {
        cerrarBtn.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                localStorage.clear();
                
                // Mostrar toast si existe
                const toast = document.getElementById("logout-toast");
                if (toast) {
                    toast.classList.remove("hidden");
                    toast.classList.add("flex");
                    setTimeout(() => {
                        toast.classList.remove("opacity-0");
                        toast.classList.add("opacity-100");
                    }, 10);
                }

                // Redirigir
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 1000);
            }
        });
    }

    // Lógica del botón Editar Perfil
    const editarBtn = document.getElementById("editar");
    if (editarBtn) {
        editarBtn.addEventListener("click", () => {
            window.location.href = './edicion.html';
        });
    }
});