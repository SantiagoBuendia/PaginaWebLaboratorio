// ======= AUTENTICACIÓN Y CARGA DE USUARIO (Funciones comunes) =======
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
const idUsuario = getCookie('id'); // ID genérico para el usuario logueado

// Redirección si no hay token (se ejecuta inmediatamente)
if (!token) {
    alert("Sesión expirada o no iniciada. Redirigiendo al inicio de sesión.");
    window.location.href = 'http://localhost/PaginaWebLaboratorio/index.html';
}

// ======= FUNCIONES DE INTERFAZ GENERAL =======
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

// Cierra el menú si se hace clic fuera
window.addEventListener('click', function (event) {
    const menu = document.getElementById("opciones-menu");
    const boton = document.querySelector(".boton-menu");
    // Asegúrate de que el menú exista antes de intentar usarlo
    if (menu && boton && !menu.contains(event.target) && !boton.contains(event.target)) {
        menu.classList.add("oculto");
    }
});

let modoOscuro = false; // Variable para controlar el estado del modo oscuro

function cambiarColor() {
    const body = document.body;
    body.classList.toggle("modo-oscuro");
    modoOscuro = !modoOscuro;
    localStorage.setItem('modoOscuro', modoOscuro); // Guarda la preferencia
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


// Se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Rellenar información de usuario
    if (nombreUsuario) {
        document.getElementById('nombre-usuario').textContent = nombreUsuario;
        document.getElementById('profile-pic').src = `img/${idUsuario}.png`;
    }

    if (rolUsuario) {
        document.getElementById('rol-usuario').textContent = rolUsuario.charAt(0).toUpperCase() + rolUsuario.slice(1);
    }

    // Cargar preferencia de modo oscuro
    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
        modoOscuro = true;
    }

    // Aplicar tamaño de texto al cargar la página
    aplicarTamanoTexto();

    // Verificación de rol para la página del profesor
    if (window.location.pathname.includes('profesor.html')) {
        if (rolUsuario !== 'profesor') {
            alert("Acceso denegado. Esta página es solo para profesores.");
            window.location.href = 'index.html';
        }
    }
});