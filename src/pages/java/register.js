document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar_contraseña").value;

    // Validar contraseñas
    if (password !== confirmar) {
  Swal.fire({
    icon: "error",
    title: "Contraseñas no coinciden",
    html: "<b>Por favor verifica que ambas contraseñas sean iguales</b>",
    background: "#1e293b",
    color: "#fff",
    confirmButtonColor: "#10b981",
  });
  return;


    }

    const data = {
      userID: crypto.randomUUID(),
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      edad: parseInt(document.getElementById("edad").value),
      email: document.getElementById("email").value,
      password: password,
    };

    try {
      const res = await fetch("https://proyectoecomerce-io.onrender.com/api/usuario/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al registrar usuario");
      }

      const json = await res.json();
      console.log("Respuesta del servidor:", json);

    
      Swal.fire({
        icon: "success",
        title: " ¡Si sale esto todo bien!",
        text: "Ahora se puede iniciar sesión espere 9 segundos.",
        timer:9000,
        timerProgressBar:true,
        showConfirmButton: false,
        confirmButtonColor: "#10b981",
        showClass: {
          popup: "animate__animated animate__zoomIn"
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut"
        }
      }).then(() => {
        window.location.href = "login.html";
      });

      form.reset();

    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  });
});
