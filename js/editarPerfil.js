function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === nombre) return decodeURIComponent(value);
    }
    return null;
}

window.addEventListener("DOMContentLoaded", () => {
    const nombre = getCookie('usuario');
    const rol = getCookie('rol');
    const correo = getCookie('correo');
    const id = getCookie('id');
    const contrasena = getCookie('contrasena');
    const idLogueado = getCookie('id');

    if (nombre) {
        document.getElementById("nombren").value = nombre;
    }

    if (contrasena) document.getElementById("contrasenan").value = contrasena;

    if (correo) {
        document.getElementById("correo").textContent = correo;               
    }

    if (rol) {
        document.getElementById("rol-usuario").textContent = rol.charAt(0).toUpperCase() + rol.slice(1);
        document.getElementById("rol-hidden").value = rol.toLowerCase();
    }

    if (id) {
        document.getElementById("foto-preview").src = `img/${id}.png`;
        document.getElementById("id-hidden").value = id;
        document.getElementById("auditor-hidden").value = id;
    }

    if (idLogueado) {
        document.getElementById("auditor-hidden").value = idLogueado;
    }

    document.getElementById("foto").addEventListener("change", function () {
        const archivo = this.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function (e) {
                document.getElementById("foto-preview").src = e.target.result;
            };
            lector.readAsDataURL(archivo);
        }
    });

    document.getElementById("btn-volver").addEventListener("click", () => {
        let destino = "http://localhost/PaginaWebLaboratorio/index.html";

        if (rol === "administrador") {
            destino = "http://localhost/PaginaWebLaboratorio/administrador.html";
        } else if (rol === "profesor") {
            destino = "http://localhost/PaginaWebLaboratorio/profesor.html";
        } else if (rol === "estudiante") {
            destino = "http://localhost/PaginaWebLaboratorio/estudiante.html";
        }

        window.location.href = destino;
    });

    document.getElementById("ver-contra").addEventListener("change", function () {
        const campo = document.getElementById("contrasenan");
        campo.type = this.checked ? "text" : "password";
    });
});
document.querySelector("form").addEventListener("submit", e => {
    const file = document.getElementById("foto").files[0];
    console.log("Archivo al enviar:", file);
});