document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Por favor ingrese email y contraseña");
      return;
    }

    try {
      const res = await fetch("https://proyectoecomerce-io.onrender.com/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }) 
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Error al iniciar sesión");
        return;
      }

      // ✅ IMPORTANTE: Usar los mismos nombres de clave en todos los archivos
      localStorage.setItem("sesionActiva", "true"); // Consistente con edicion.js y perfil-pagina.js
      
      // ✅ Guardar con la propiedad "correo" (igual que esperan los otros archivos)
      const usuario = {
        ...json.usuario,
        correo: json.usuario.email || json.usuario.correo, // Asegurar que tenga "correo"
        email: json.usuario.email || json.usuario.correo   // También mantener "email"
      };
      
      localStorage.setItem("usuario", JSON.stringify(usuario));

      alert(`¡Login exitoso! Bienvenido ${usuario.nombre}`);
      window.location.href = "../pages/productos.html";

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión al servidor");
    }
  });
});