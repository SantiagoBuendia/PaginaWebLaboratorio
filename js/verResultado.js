document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const idIntento = params.get('intento_id');
    const contenedor = document.getElementById('contenedor-retroalimentacion');

    document.getElementById('nombre-usuario').textContent = getCookie('usuario') || "Estudiante";
    document.getElementById('profile-pic').src = `img/${getCookie('id')}.png`;

    if (!idIntento) {
        contenedor.innerHTML = "<p style='color:red;'>No se encontró el identificador del intento.</p>";
        return;
    }

    fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=mostrarResultadoIntento&intento_id=${idIntento}`)
        .then(r => r.text())
        .then(html => {
            contenedor.innerHTML = html.replace(/Content-type: text\/html\s+/i, "").trim();
        })
        .catch(err => {
            contenedor.innerHTML = "<p>Error al cargar la retroalimentación.</p>";
        });

    if (localStorage.getItem('modoOscuro') === 'true') document.body.classList.add('modo-oscuro');
});

function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === nombre) return decodeURIComponent(value);
    }
    return null;
}

function getToken() {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === 'token') return value;
    }
    return null;
}

function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === nombre) return decodeURIComponent(value);
    }
    return null;
}

const token = getToken();
const nombreUsuario = getCookie('usuario');
const rolUsuario = getCookie('rol');
const idUsuario = getCookie('id');

if (!token) {
    alert("Sesión expirada o no iniciada.");
    window.location.href = 'index.html';
}

const paginaActual = window.location.pathname;

if (paginaActual.includes('administrador.html')) {
    if (rolUsuario !== 'administrador') {
        alert("Acceso denegado. Se requieren permisos de administrador.");
        window.location.href = 'index.html';
    }
}

if (paginaActual.includes('profesor.html')) {
    if (rolUsuario !== 'profesor') {
        alert("Acceso denegado. Esta página es solo para profesores.");
        window.location.href = 'index.html';
    }
}

if (paginaActual.includes('estudiante.html')) {
    if (rolUsuario !== 'estudiante') {
        alert("Acceso denegado. Esta página es solo para estudiantes.");
        window.location.href = 'index.html';
    }
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

window.addEventListener('click', function (event) {
    const menu = document.getElementById("opciones-menu");
    const boton = document.querySelector(".boton-menu");
    if (!menu.contains(event.target) && !boton.contains(event.target)) {
        menu.classList.add("oculto");
    }
});

window.addEventListener('click', function (event) {
    const menu = document.getElementById("opciones-menu");
    const boton = document.querySelector(".boton-menu");

    if (menu && boton && !menu.contains(event.target) && !boton.contains(event.target)) {
        menu.classList.add("oculto");
    }
});

let modoOscuro = false;

function cambiarColor() {
    const body = document.body;
    body.classList.toggle("modo-oscuro");
    modoOscuro = !modoOscuro;
    localStorage.setItem('modoOscuro', modoOscuro);
}

const tamanosTexto = ["1rem", "1.15rem", "1.3rem"];
let indiceTamano = 0;

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

document.addEventListener("DOMContentLoaded", () => {
    if (nombreUsuario && document.getElementById('nombre-usuario')) {
        document.getElementById('nombre-usuario').textContent = nombreUsuario;
        document.getElementById('profile-pic').src = `img/${idUsuario}.png`;
    }

    if (rolUsuario && document.getElementById('rol-usuario')) {
        document.getElementById('rol-usuario').textContent = rolUsuario.charAt(0).toUpperCase() + rolUsuario.slice(1);
    }

    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
        modoOscuro = true;
    }

    aplicarTamanoTexto();

    if (window.location.pathname.includes('profesor.html')) {
        if (rolUsuario !== 'profesor') {
            alert("Acceso denegado. Esta página es solo para profesores.");
            window.location.href = 'index.html';
        }
    }
});