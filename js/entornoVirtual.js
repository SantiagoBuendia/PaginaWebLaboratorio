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

if (!token && !window.location.pathname.includes('index.html')) {
    alert("Sesión expirada o no iniciada.");
    window.location.href = 'index.html';
}

const paginaActual = window.location.pathname;

function verificarAcceso() {
    if (paginaActual.includes('administrador.html') && rolUsuario !== 'administrador') {
        window.location.href = 'index.html';
    } else if (paginaActual.includes('profesor.html') && rolUsuario !== 'profesor') {
        window.location.href = 'index.html';
    } else if (paginaActual.includes('estudiante.html') && rolUsuario !== 'estudiante') {
        window.location.href = 'index.html';
    }
}
verificarAcceso();

const STORAGE_KEY_FAV = `favs_${idUsuario}`;
const STORAGE_KEY_REC = `recientes_${idUsuario}`;

function getFavoritos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_FAV)) || [];
}

function getRecientes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_REC)) || [];
}

function registrarAcceso(id, nombre, icono, url) {
    let recientes = getRecientes();

    recientes = recientes.filter(m => m.id !== id);
    recientes.unshift({ id, nombre, icono, url });

    recientes = recientes.slice(0, 5);
    localStorage.setItem(STORAGE_KEY_REC, JSON.stringify(recientes));
    localStorage.setItem('origen', window.location.href);
}

function toggleFavorito(id, nombre, icono, url) {
    let favoritos = getFavoritos();
    const index = favoritos.findIndex(m => m.id === id);

    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push({ id, nombre, icono, url });
    }

    localStorage.setItem(STORAGE_KEY_FAV, JSON.stringify(favoritos));
    renderAccesoRapido();
    actualizarIconosEstrella();
}

function renderAccesoRapido() {
    const contenedor = document.getElementById('contenedor-rapido');
    if (!contenedor) return;

    const favoritos = getFavoritos();
    const recientes = getRecientes();

    const favoritosIds = new Set(favoritos.map(f => f.id));
    const combinados = [...favoritos, ...recientes.filter(r => !favoritosIds.has(r.id))];

    const mostrar = combinados.slice(0, 5);

    if (mostrar.length === 0) {
        contenedor.innerHTML = "<p style='color:gray; font-size:0.9rem; padding-left:20px;'>No hay actividad reciente.</p>";
        return;
    }

    contenedor.innerHTML = mostrar.map(m => `
        <a href="${m.url}" class="card-mini" onclick="registrarAcceso('${m.id}', '${m.nombre}', '${m.icono}', '${m.url}')">
            <i class="${m.icono}"></i>
            <span>${m.nombre}</span>
        </a>
    `).join('');
}

function actualizarIconosEstrella() {
    const favoritos = getFavoritos();
    const idsFavoritos = favoritos.map(f => f.id);

    const todasLasEstrellas = document.querySelectorAll('[id^="star-"]');

    todasLasEstrellas.forEach(star => {
        const moduloId = star.id.replace('star-', '');
        if (idsFavoritos.includes(moduloId)) {
            star.className = "fas fa-star";
            star.style.color = "#f1c40f";
        } else {
            star.className = "far fa-star";
            star.style.color = "inherit";
        }
    });
}

function cerrarSesion() {
    const expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = `token=; path=/; ${expires}`;
    document.cookie = `usuario=; path=/; ${expires}`;
    document.cookie = `rol=; path=/; ${expires}`;
    document.cookie = `id=; path=/; ${expires}`;
    window.location.href = 'index.html';
}

function toggleMenu() {
    const menu = document.getElementById("opciones-menu");
    if (menu) menu.classList.toggle("oculto");
}

function cambiarColor() {
    const body = document.body;
    body.classList.toggle("modo-oscuro");
    localStorage.setItem('modoOscuro', body.classList.contains("modo-oscuro"));
}

const tamanosTexto = ["1rem", "1.15rem", "1.3rem"];
let indiceTamano = parseInt(localStorage.getItem('indiceTamano')) || 0;

function aplicarTamanoTexto() {
    const tamano = tamanosTexto[indiceTamano];
    const elementos = document.querySelectorAll(
        "#nombre-usuario, #rol-usuario, h1, h2, h3, h4, label, .opciones-menu button, .card h2"
    );
    elementos.forEach(elem => elem.style.fontSize = tamano);
}

function cambiarTexto() {
    indiceTamano = (indiceTamano + 1) % tamanosTexto.length;
    localStorage.setItem('indiceTamano', indiceTamano);
    aplicarTamanoTexto();
}

document.addEventListener("DOMContentLoaded", () => {
    const nombreElem = document.getElementById('nombre-usuario');
    const rolElem = document.getElementById('rol-usuario');
    const picElem = document.getElementById('profile-pic');

    if (nombreElem && nombreUsuario) nombreElem.textContent = nombreUsuario;
    if (rolElem && rolUsuario) rolElem.textContent = rolUsuario.charAt(0).toUpperCase() + rolUsuario.slice(1);
    if (picElem && idUsuario) picElem.src = `img/${idUsuario}.png`;

    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
    }

    aplicarTamanoTexto();

    if (idUsuario) {
        renderAccesoRapido();
        actualizarIconosEstrella();
    }

    window.addEventListener('click', (event) => {
        const menu = document.getElementById("opciones-menu");
        const boton = document.querySelector(".boton-menu");
        if (menu && boton && !menu.contains(event.target) && !boton.contains(event.target)) {
            menu.classList.add("oculto");
        }
    });
});

function abrirSimuladorVR(tipo) {
    console.log("Intentando abrir simulación de:", tipo, "para usuario:", idUsuario);

    if (!idUsuario || idUsuario === "0") {
        alert("Error: No hay un ID de usuario válido.");
        return;
    }

    fetch("/cgi-bin/PaginaWebLaboratorio.exe", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            accion: "abrirSimulador",
            usuario_id: idUsuario,
            experimento: tipo
        })
    })
        .then(response => {
            if (!response.ok) throw new Error("Error en la red o CGI no encontrado");
            return response.json();
        })
        .then(data => {
            console.log("Respuesta del servidor para " + tipo + ":", data);

            msg.style = "position:fixed; top:20px; right:20px; background:green; color:white; padding:10px; border-radius:5px; z-index:1000;";
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 3000);
        })
        .catch(err => {
            console.error("Error crítico:", err);
            alert("No se pudo iniciar el simulador. Revisa la consola.");
        });
}

function volverAlMenu() {
    const origen = localStorage.getItem('origen') || 'menu.html';
    window.location.href = origen;
}