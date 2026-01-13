function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === nombre) return decodeURIComponent(value);
    }
    return null;
}

const token = getCookie('token');
const nombreUsuario = getCookie('usuario');
const rolUsuario = getCookie('rol');
const idUsuario = getCookie('id');

if (!token) {
    alert("Sesión expirada o no iniciada.");
    window.location.href = 'index.html';
}

function cerrarSesion() {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "usuario=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "rol=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = 'index.html';
}

function toggleMenu() {
    const menu = document.getElementById("opciones-menu");
    if (menu) menu.classList.toggle("oculto");
}

function volverAlMenu() {
    if (rolUsuario === 'administrador') {
        window.location.href = 'administrador.html';
    }
    else if (rolUsuario === 'profesor') {
        window.location.href = 'profesor.html';
    }
    else if (rolUsuario === 'estudiante') {
        window.location.href = 'estudiante.html';
    }
    else {
        window.location.href = 'index.html';
    }
}

function comenzarExamen(idExamen) {
    window.location.href = `resolverExamen.html?id=${idExamen}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const lblNombre = document.getElementById('nombre-usuario');
    const lblRol = document.getElementById('rol-usuario');
    const imgPerfil = document.getElementById('profile-pic');

    if (nombreUsuario && lblNombre) lblNombre.textContent = nombreUsuario;
    if (rolUsuario && lblRol) lblRol.textContent = rolUsuario.charAt(0).toUpperCase() + rolUsuario.slice(1);
    if (idUsuario && imgPerfil) imgPerfil.src = `img/${idUsuario}.png`;

    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
    }

    const contenedorExamenes = document.getElementById('contenedor-lista-examenes');
    if (contenedorExamenes && idUsuario) {
        fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=listarExamenesEstudiante&estudiante_id=${idUsuario}`)
            .then(r => r.text())
            .then(html => {
                contenedorExamenes.innerHTML = html;
            })
            .catch(err => {
                console.error("Error:", err);
                contenedorExamenes.innerHTML = "<p>Error al cargar la lista.</p>";
            });
    }
});

const tamanosTexto = ["1rem", "1.15rem", "1.3rem"];
let indiceTamano = parseInt(localStorage.getItem('indiceTamano')) || 0;

function aplicarPreferencias() {
    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
    } else {
        document.body.classList.remove('modo-oscuro');
    }
    aplicarTamanoTexto();
}

function cambiarColor() {
    const esOscuro = document.body.classList.toggle("modo-oscuro");
    localStorage.setItem('modoOscuro', esOscuro);
}

function cambiarTexto() {
    indiceTamano = (indiceTamano + 1) % tamanosTexto.length;
    localStorage.setItem('indiceTamano', indiceTamano);
    aplicarTamanoTexto();
}

function aplicarTamanoTexto() {
    const tamano = tamanosTexto[indiceTamano];
    const elementosAfectados = document.querySelectorAll(
        "#nombre-usuario, #rol-usuario, h1, h2, h3, .exam-title, .opciones-menu button, #btn-volver"
    );
    elementosAfectados.forEach(elem => {
        elem.style.fontSize = tamano;
    });
}

function toggleMenu() {
    const menu = document.getElementById("opciones-menu");
    if (menu) menu.classList.toggle("oculto");
}

window.addEventListener('click', (e) => {
    const menu = document.getElementById("opciones-menu");
    const btn = document.querySelector(".boton-menu");
    if (menu && !menu.contains(e.target) && e.target !== btn) {
        menu.classList.add("oculto");
    }
});