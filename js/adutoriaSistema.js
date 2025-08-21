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

// Solo declara si no existe aún
if (typeof modoOscuro === 'undefined') {
    var modoOscuro = false;
}


function cambiarColor() {
    const body = document.body;
    const header = document.querySelector('.header');
    const cards = document.querySelectorAll('.card');
    const panel = document.querySelector('.panel');
    const menu = document.querySelector('.dropdown-content');
    const contenedor_principal = document.querySelector('.contenedor-principal');
    const lista_usuarios = document.querySelector('.lista-usuarios');
    const registro_usuarios = document.querySelector('.registro-usuarios');
    const form_registro = document.querySelector('#form-registro');
    const inputs = document.querySelectorAll('input, select, textarea');
    const ths = document.querySelectorAll("th");

    if (modoOscuro) {
        // Modo claro
        body.style.backgroundColor = "#ffffff";
        body.style.color = "#000000";

        if (header) header.style.backgroundColor = "#003366";
        if (panel) panel.style.backgroundColor = "transparent";
        if (contenedor_principal) contenedor_principal.style.backgroundColor = "transparent";
        if (lista_usuarios) lista_usuarios.style.backgroundColor = "transparent";
        if (registro_usuarios) registro_usuarios.style.backgroundColor = "transparent";
        if (form_registro) form_registro.style.backgroundColor = "transparent";

        inputs.forEach(input => {
            input.style.backgroundColor = "#ffffff";
            input.style.color = "#000000";
            input.style.borderColor = "#cccccc";
        });

        cards.forEach(card => {
            card.style.backgroundColor = "#ffffff";
            card.style.color = "#000000";
        });

        if (menu) {
            menu.style.backgroundColor = "#ffffff";
            menu.style.color = "#000000";
        }

        ths.forEach(th => {
            th.style.backgroundColor = "#ffffff";
            th.style.color = "#000000";
            th.style.borderColor = "#cccccc";
        });

    } else {
        // Modo oscuro
        body.style.backgroundColor = "#121212";
        body.style.color = "#ffffff";

        if (header) header.style.backgroundColor = "#003366";
        if (panel) panel.style.color = "#ffffff";
        if (contenedor_principal) contenedor_principal.style.backgroundColor = "#1e1e1e";
        if (lista_usuarios) lista_usuarios.style.backgroundColor = "#1e1e1e";
        if (registro_usuarios) registro_usuarios.style.backgroundColor = "#1e1e1e";
        if (form_registro) form_registro.style.backgroundColor = "#1e1e1e";

        inputs.forEach(input => {
            input.style.backgroundColor = "#2c2c2c";
            input.style.color = "#ffffff";
            input.style.borderColor = "#555";
        });

        cards.forEach(card => {
            card.style.backgroundColor = "#1e1e1e";
            card.style.color = "#ffffff";
        });

        if (menu) {
            menu.style.backgroundColor = "#2c2c2c";
            menu.style.color = "#ffffff";
        }

        ths.forEach(th => {
            th.style.backgroundColor = "#2c2c2c";
            th.style.color = "#ffffff";
            th.style.borderColor = "#555";
        });
    }

    modoOscuro = !modoOscuro;
}


function cambiarTexto() {
    document.getElementById("nombre-usuario").innerText = "Admin Modificado";
    document.getElementById("rol-usuario").innerText = "Super Admin";
}


// Cierra el menú si se hace clic fuera
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
    fetch("/cgi-bin/PaginaWebLaboratorio.exe?accion=listarAu")
        .then((res) => res.text())
        .then((html) => {
            document.getElementById("tabla-usuarios").innerHTML = html;
        })
        .catch(() => {
            document.getElementById("tabla-usuarios").innerText = "Error al cargar usuarios.";
        });
}
cargarUsuarios();

