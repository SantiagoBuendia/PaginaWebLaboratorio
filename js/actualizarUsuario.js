function getParametroURL(nombre) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre);
}
function getToken() {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === 'token') return value;
    }
    return null;
}

const token = getToken();
console.log("Token recibido:", token);

if (!token) {
    alert("No hay token. Redirigiendo...");
    window.location.href = 'http://localhost/PaginaWebLaboratorio/index.html';
}

function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === nombre) return decodeURIComponent(value);
    }
    return null;
}

const id = getCookie('id');

if (id) {
    document.getElementById('usuario_id').value = id;
}

window.addEventListener("DOMContentLoaded", () => {
    const nombre = getParametroURL('nombre');
    const correo = getParametroURL('correo');
    const rol = getParametroURL('rol');
    const id = getParametroURL('id');
    const contrasena = getParametroURL('contrasena');

    if (nombre) document.getElementById("nombren").value = nombre;
    if (correo) document.getElementById("correo").value = correo;
    if (rol) {
        const selectRol = document.getElementById("rol");
        selectRol.value = rol.toLowerCase(); // Asegura coincidencia exacta en valor
    }

    if (id) {
        document.getElementById("foto-preview").src = `img/${id}.png`;
        document.getElementById("id-hidden").value = id;
    }

    if (contrasena) document.getElementById("contrasenan").value = contrasena;

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
        window.location.href = "http://localhost/PaginaWebLaboratorio/gestionUsuarios.html";
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