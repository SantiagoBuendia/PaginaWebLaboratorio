// ======= AUTENTICACIÓN Y CARGA DE USUARIO =======
function getToken() {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === 'token') return value;
    }
    return null;
}

const token = getToken();
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

const nombre = getCookie('usuario');
const rol = getCookie('rol');
const id = getCookie('id');

if (nombre) {
    document.getElementById('nombre-usuario').textContent = nombre;
    document.getElementById('profile-pic').src = `img/${id}.png`;
}

if (rol) {
    document.getElementById('rol-usuario').textContent = rol.charAt(0).toUpperCase() + rol.slice(1);
}

// ======= FUNCIONES DE INTERFAZ =======
function cerrarSesion() {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "usuario=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "rol=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = 'http://localhost/PaginaWebLaboratorio/index.html';
}

function toggleMenu() {
    const menu = document.getElementById("opciones-menu");
    menu.classList.toggle("oculto");
}

window.addEventListener('click', function (event) {
    const menu = document.getElementById("opciones-menu");
    const boton = document.querySelector(".boton-menu");
    if (!menu.contains(event.target) && !boton.contains(event.target)) {
        menu.classList.add("oculto");
    }
});

function volverAlMenu() {
    const origen = localStorage.getItem('origen') || 'menu.html';
    window.location.href = origen;
}

let modoOscuro = false;

function cambiarColor() {
    const body = document.body;
    body.classList.toggle("modo-oscuro");
    modoOscuro = !modoOscuro;
}

const tamanosTexto = ["1rem", "1.25rem", "1.5rem"];
let indiceTamano = 0;

function cambiarTexto() {
    const tamano = tamanosTexto[indiceTamano];
    document.getElementById("nombre-usuario").style.fontSize = tamano;
    document.getElementById("rol-usuario").style.fontSize = tamano;

    const encabezados = document.querySelectorAll("h1, h2");
    encabezados.forEach(elem => elem.style.fontSize = tamano);

    indiceTamano = (indiceTamano + 1) % tamanosTexto.length;
}

document.getElementById("tipo").addEventListener("change", function () {
    const grupoEnlace = document.getElementById("grupo-enlace");
    const enlaceInput = document.getElementById("enlace");

    if (this.value === "") {
        // Si no ha seleccionado nada, ocultar campo
        grupoEnlace.style.display = "none";
        enlaceInput.value = "";
        enlaceInput.removeAttribute("accept");
    }
    else if (this.value === "guias") {
        // Mostrar campo como archivo
        grupoEnlace.style.display = "block";
        enlaceInput.type = "file";
        enlaceInput.removeAttribute("placeholder");
        enlaceInput.setAttribute("accept", ".pdf,.doc,.docx");
    }
    else {
        // Mostrar campo como enlace
        grupoEnlace.style.display = "block";
        enlaceInput.type = "url";
        enlaceInput.setAttribute("placeholder", "Pegue el enlace aquí");
        enlaceInput.removeAttribute("accept");
    }
});

document.getElementById("btn-volver").addEventListener("click", () => {
    window.location.href = "http://localhost/PaginaWebLaboratorio/contenidoEducativo.html";
});
