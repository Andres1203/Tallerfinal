document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva"); // ✅ Consistente con mayúscula
    const contenedor = document.getElementById("user-menu-container");

    // si no existe el contenedor
    if (!contenedor) return;

    // si no hay sesión activa
    if (!sesionActiva) return;

    // obtener datos del usuario del localStorage
    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil) return;
    
    // ✅ Usar correo o email (el que esté disponible)
    const emailUsuario = perfil.correo || perfil.email;
    if (!emailUsuario) return;

    let usuario = null;
    
    try {
        const res = await fetch("https://proyectoecomerce-io.onrender.com/api/perfil/obtener", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailUsuario })
        });

        const data = await res.json();

        if (!res.ok) throw new Error("No se pudo obtener perfil");

        usuario = data.usuario;

    } catch (error) {
        console.error("Error al obtener perfil:", error);
        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;
    }
    
    // crear menú de usuario
    contenedor.innerHTML = `
        <div class="relative">
            <button id="user-menu-btn" 
                class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 transition-transform">
                <span id="user-avatar"></span>
            </button>

            <div id="user-dropdown"
                class="hidden absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 
                transition-all duration-200 ease-out overflow-hidden transform origin-top scale-95 opacity-0">

                <div class="px-4 py-3 border-b border-gray-200">
                    <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                    <p class="text-xs text-gray-500" id="user-email"></p>
                </div>

                <a href="../pages/perfil.html"
                    class="flex items-center px-4 py-3 text-sm text-gray-700 
                    hover:bg-blue-100 hover:text-blue-800 
                    active:bg-blue-200 transition-all duration-150 rounded-md cursor-pointer">
                    Mi Perfil
                </a>

                <button id="logout-btn"
                    class="flex items-center w-full px-4 py-3 text-sm text-gray-600
                    hover:bg-blue-100 hover:text-blue-800 
                    active:bg-blue-200 transition-all duration-150 rounded-md cursor-pointer">
                    Cerrar sesión
                </button>
            </div>
        </div>
    `;
    
    // INSERTAR DATOS EN EL MENÚ
    document.getElementById("user-name").textContent = `${usuario.nombre} ${usuario.apellido}`;
    document.getElementById("user-email").textContent = usuario.email || usuario.correo;

    // Iniciales del avatar
    const avatar = `${usuario.nombre[0]}${usuario.apellido[0]}`.toUpperCase();
    document.getElementById("user-avatar").textContent = avatar;

    // ANIMACIÓN ABRIR/CERRAR
    document.getElementById("user-menu-btn").addEventListener("click", () => {
        const drop = document.getElementById("user-dropdown");

        if (drop.classList.contains("hidden")) {
            drop.classList.remove("hidden");

            setTimeout(() => {
                drop.classList.remove("opacity-0", "scale-95");
                drop.classList.add("opacity-100", "scale-100");
            }, 20);

        } else {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");

            setTimeout(() => {
                drop.classList.add("hidden");
            }, 150);
        }
    });

    // CERRAR SESIÓN + TOAST
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.clear();

        const toast = document.getElementById("logout-toast");
        if (toast) {
            toast.classList.remove("hidden");
            setTimeout(() => toast.classList.add("opacity-100"), 20);

            setTimeout(() => {
                toast.classList.remove("opacity-100");
                setTimeout(() => {
                    window.location.href = "../pages/login.html";
                }, 500);
            }, 1800);
        } else {
            // Si no existe el toast, redirigir directamente
            window.location.href = "../pages/login.html";
        }
    });
});