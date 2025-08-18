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

// ======= CARGAR TABLA DE RECURSOS Y ASIGNAR FILTROS =======
function cargarRecursos() {
    fetch("/cgi-bin/PaginaWebLaboratorio.exe?accion=listare")
        .then((res) => res.text())
        .then((html) => {
            document.getElementById("tabla-recursos").innerHTML = html;

            // ?? REGISTRAR EVENTOS DESPUÉS DE CARGAR LA TABLA
            const busquedaInput = document.getElementById("busqueda");
            const categoriaSelect = document.getElementById("filtro-categoria");

            busquedaInput.addEventListener("input", aplicarFiltros);
            categoriaSelect.addEventListener("change", aplicarFiltros);

            aplicarFiltros(); // Filtro inicial
        })
        .catch(() => {
            document.getElementById("tabla-recursos").innerText = "Error al cargar recursos.";
        });
}

cargarRecursos();

// ======= FUNCIÓN PARA FILTRAR =======
function aplicarFiltros() {
    const filtroTexto = document.getElementById("busqueda").value.toLowerCase();
    const filtroCategoria = document.getElementById("filtro-categoria").value.toLowerCase();

    const tabla = document.getElementById("tabla-recursos-real");
    if (!tabla) return;

    const filas = tabla.getElementsByTagName("tr");

    for (let i = 1; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName("td");

        const titulo = celdas[1]?.textContent.toLowerCase() || "";
        const descripcion = celdas[2]?.textContent.toLowerCase() || "";
        const tipo = celdas[4]?.textContent.toLowerCase() || "";
        const autor = celdas[5]?.textContent.toLowerCase() || "";
        const palabrasClave = celdas[6]?.textContent.toLowerCase() || "";

        const coincideTexto =
            titulo.includes(filtroTexto) ||
            descripcion.includes(filtroTexto) ||
            autor.includes(filtroTexto) ||
            palabrasClave.includes(filtroTexto);

        const coincideCategoria = !filtroCategoria || tipo.includes(filtroCategoria);

        filas[i].style.display = (coincideTexto && coincideCategoria) ? "" : "none";
    }
}
