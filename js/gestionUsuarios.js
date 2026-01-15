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

if (!token) {
    alert("Sesión no válida. Redirigiendo...");
    window.location.href = 'http://localhost/PaginaWebLaboratorio/index.html';
}

else if (rol !== 'administrador') {
    alert("Acceso denegado: No tienes permisos de administrador.");

    if (rol === 'profesor') {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/profesor.html';
    } else if (rolSesion === 'estudiante') {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/estudiante.html';
    } else {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/index.html';
    }
}

if (nombre) {
    document.getElementById('nombre-usuario').textContent = nombre;
    const rutaImagen = `img/${id}.png`;
    document.getElementById('profile-pic').src = rutaImagen;
}

if (rol) {
    document.getElementById('rol-usuario').textContent = rol.charAt(0).toUpperCase() + rol.slice(1);
}

if (id) {
    document.getElementById('usuario_id').value = id;
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
    localStorage.setItem('modoOscuro', modoOscuro);
}

if (localStorage.getItem('modoOscuro') === 'true') {
    document.body.classList.add('modo-oscuro');
    modoOscuro = true;
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
function cargarUsuarios() {
    fetch("/cgi-bin/PaginaWebLaboratorio.exe?accion=listaru")
        .then((res) => res.text())
        .then((html) => {
            document.getElementById("tabla-usuarios").innerHTML = html;
        })
        .catch(() => {
            document.getElementById("tabla-usuarios").innerText = "Error al cargar usuarios.";
        });
}
cargarUsuarios();

function confirmarEliminar(idUsuario) {
    const usuario_id = getCookie('id');
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
        window.location.href = `/cgi-bin/PaginaWebLaboratorio.exe?accion=eliminaru&id=${idUsuario}&usuario_id=${usuario_id}`;
    }
    return false;
}

function filtrarTabla() {
    const textoBusqueda = document.getElementById("filtro-nombre").value.toLowerCase();
    const rolSeleccionado = document.getElementById("filtro-rol").value.toLowerCase();

    const filas = document.querySelectorAll("#tabla-usuarios table tbody tr");

    filas.forEach(fila => {
        const nombreCol = fila.cells[1] ? fila.cells[1].textContent.toLowerCase() : "";
        const rolCol = fila.cells[3] ? fila.cells[3].textContent.toLowerCase() : "";

        const coincideNombre = nombreCol.includes(textoBusqueda);
        const coincideRol = (rolSeleccionado === "todos" || rolCol === rolSeleccionado);

        if (coincideNombre && coincideRol) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const inputNombre = document.getElementById("filtro-nombre");
    const inputRol = document.getElementById("filtro-rol");

    if (inputNombre) inputNombre.addEventListener("input", filtrarTabla);
    if (inputRol) inputRol.addEventListener("change", filtrarTabla);
});

function cargarUsuarios() {
    fetch("/cgi-bin/PaginaWebLaboratorio.exe?accion=listaru")
        .then((res) => res.text())
        .then((html) => {
            document.getElementById("tabla-usuarios").innerHTML = html;
            // IMPORTANTE: Aplicar el filtro por si el usuario ya tenía algo escrito
            filtrarTabla();
        })
        .catch(() => {
            document.getElementById("tabla-usuarios").innerText = "Error al cargar usuarios.";
        });
}