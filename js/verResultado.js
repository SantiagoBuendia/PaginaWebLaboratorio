document.addEventListener("DOMContentLoaded", function () {
    const token = getToken();
    const nombreUsuario = getCookie('usuario');
    const rolUsuario = getCookie('rol');
    const idUsuario = getCookie('id');

    if (!token) {
        alert("Sesión expirada o no iniciada.");
        window.location.href = 'index.html';
        return;
    }

    if (nombreUsuario && document.getElementById('nombre-usuario')) {
        document.getElementById('nombre-usuario').textContent = nombreUsuario;
        document.getElementById('profile-pic').src = `img/${idUsuario}.png`;
    }

    if (rolUsuario && document.getElementById('rol-usuario')) {
        document.getElementById('rol-usuario').textContent =
            rolUsuario.charAt(0).toUpperCase() + rolUsuario.slice(1);
    }

    const paginaActual = window.location.pathname;

    if (paginaActual.includes('administrador.html') && rolUsuario !== 'administrador') {
        alert("Acceso denegado.");
        window.location.href = 'index.html';
    }

    if (paginaActual.includes('profesor.html') && rolUsuario !== 'profesor') {
        alert("Acceso denegado. Solo profesores.");
        window.location.href = 'index.html';
    }

    if (paginaActual.includes('estudiante.html') && rolUsuario !== 'estudiante') {
        alert("Acceso denegado. Solo estudiantes.");
        window.location.href = 'index.html';
    }

    const params = new URLSearchParams(window.location.search);
    const idIntento = params.get('intento_id');
    const contenedor = document.getElementById('contenedor-retroalimentacion');

    if (!idIntento) {
        contenedor.innerHTML =
            "<p style='color:red;'>No se encontró el identificador del intento.</p>";
        return;
    }

    fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=mostrarResultadoIntento&intento_id=${idIntento}`)
        .then(r => r.text())
        .then(html => {
            contenedor.innerHTML =
                html.replace(/Content-type: text\/html\s+/i, "").trim();
        })
        .catch(() => {
            contenedor.innerHTML =
                "<p>Error al cargar la retroalimentación.</p>";
        });

    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
        modoOscuro = true;
    }

    const btnVolver = document.getElementById('btn-volver');

    if (btnVolver) {
        btnVolver.addEventListener('click', function () {
            if (rolUsuario === 'profesor') {
                window.location.href = 'seguimiento.html';
            } else if (rolUsuario === 'estudiante') {
                window.location.href = 'evaluaciones.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    aplicarTamanoTexto();
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
    return getCookie('token');
}

function cerrarSesion() {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "usuario=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "rol=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = '/PaginaWebLaboratorio/index.html';
}

function toggleMenu() {
    const menu = document.getElementById("opciones-menu");
    menu.classList.toggle("oculto");
}

window.addEventListener('click', function (event) {
    const menu = document.getElementById("opciones-menu");
    const boton = document.querySelector(".boton-menu");

    if (menu && boton &&
        !menu.contains(event.target) &&
        !boton.contains(event.target)) {
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

/* =========================
   TAMAÑO TEXTO
=========================*/

const tamanosTexto = ["1rem", "1.15rem", "1.3rem"];
let indiceTamano = 0;

function cambiarTexto() {
    indiceTamano = (indiceTamano + 1) % tamanosTexto.length;
    aplicarTamanoTexto();
}

function aplicarTamanoTexto() {
    const tamano = tamanosTexto[indiceTamano];

    const elementosAfectados = document.querySelectorAll(
        "#nombre-usuario, #rol-usuario, h1, h2, h3, h4, label, .tab-button, .examen-card h4, .examen-card p, .opciones-menu button"
    );

    elementosAfectados.forEach(elem => {
        elem.style.fontSize = tamano;
    });
}