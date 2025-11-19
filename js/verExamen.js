// --- LÓGICA DE CARGA DEL EXAMEN ---
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const idExamen = params.get('id');
    const contenedor = document.getElementById('contenedor-preguntas');

    if (!idExamen) {
        contenedor.innerHTML = "<p style='color:red; text-align:center;'>Error: ID de examen no especificado.</p>";
        return;
    }

    // URL al ejecutable C++ (AJUSTA LA RUTA SI ES NECESARIO)
    const urlCGI = `/cgi-bin/PaginaWebLaboratorio.exe?accion=mostrarExamen&examen_id=${idExamen}`;

    fetch(urlCGI)
        .then(response => {
            if (!response.ok) throw new Error("Error de conexión");
            return response.text();
        })
        .then(html => {
            // Limpiamos la cabecera Content-type si C++ la envía
            const htmlLimpio = html.replace(/Content-type: text\/html\s+/i, "").trim();
            contenedor.innerHTML = htmlLimpio;
        })
        .catch(error => {
            console.error(error);
            contenedor.innerHTML = "<p style='color:red; text-align:center;'>Error al cargar las preguntas.</p>";
        });
});


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

const nombre = getCookie('usuario');
const rol = getCookie('rol');
const id = getCookie('id');

if (nombre) {
    document.getElementById('nombre-usuario').textContent = nombre;
    const rutaImagen = `img/${id}.png`;
    document.getElementById('profile-pic').src = rutaImagen;
}


if (rol) {
    document.getElementById('rol-usuario').textContent = rol.charAt(0).toUpperCase() + rol.slice(1);
}


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

let modoOscuro = false;
function cambiarColor() {
    const body = document.body;
    body.classList.toggle("modo-oscuro");
    modoOscuro = !modoOscuro;
    localStorage.setItem('modoOscuro', modoOscuro); // Guarda la preferencia
}

// Cargar preferencia de modo oscuro al iniciar
if (localStorage.getItem('modoOscuro') === 'true') {
    document.body.classList.add('modo-oscuro');
    modoOscuro = true;
}


const tamanosTexto = ["1rem", "1.15rem", "1.3rem"]; // Ajusta tamaños base
let indiceTamano = 0; // Se reseteará al recargar, podrías guardarlo en localStorage

function cambiarTexto() {
    indiceTamano = (indiceTamano + 1) % tamanosTexto.length;
    const tamano = tamanosTexto[indiceTamano];

    const elementosAfectados = document.querySelectorAll(
        "#nombre-usuario, #rol-usuario, h1, h2, h3, h4, label, .tab-button, .examen-card h4, .examen-card p, .opciones-menu button"
    );

    elementosAfectados.forEach(elem => {
        elem.style.fontSize = tamano;
    });
}

// Cierra el menú si se hace clic fuera
window.addEventListener('click', function (event) {
    const menu = document.getElementById("opciones-menu");
    const boton = document.querySelector(".boton-menu");
    if (!menu.contains(event.target) && !boton.contains(event.target)) {
        menu.classList.add("oculto");
    }
});

document.getElementById("btn-volver").addEventListener("click", () => {
    window.location.href = "http://localhost/PaginaWebLaboratorio/gestionEvaluaciones.html";
});