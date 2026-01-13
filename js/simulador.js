// ========== FUNCIONES DE SESIÓN Y COOKIES ==========
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

// Verificar sesión inmediatamente
if (!token && !window.location.pathname.includes('index.html')) {
    window.location.href = 'index.html';
}

function verificarAcceso() {
    const paginaActual = window.location.pathname;
    if (paginaActual.includes('administrador.html') && rolUsuario !== 'administrador') {
        window.location.href = 'index.html';
    } else if (paginaActual.includes('profesor.html') && rolUsuario !== 'profesor') {
        window.location.href = 'index.html';
    } else if (paginaActual.includes('estudiante.html') && rolUsuario !== 'estudiante') {
        window.location.href = 'index.html';
    }
}
verificarAcceso();

// ========== CONFIGURACIÓN DE UI ==========

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

    // Aplicar a todos los textos principales
    const elementos = document.querySelectorAll(
        '#nombre-usuario, #rol-usuario, ' +
        'h1, h2, h3, h4, ' +
        'label, p, ' +
        '.opciones-menu button, ' +
        '.card h2, ' +
        '.card-body-seg, ' +
        '.card-footer-seg, ' +
        '.filtros-bar input, ' +
        '.filtros-bar select, ' +
        '.btn-refresh, ' +
        '#btn-volver, ' +
        '.timeline-content, ' +
        '#tabla-resultados td, ' +
        '#tabla-resultados th'
    );

    elementos.forEach(elem => {
        elem.style.fontSize = tamano;
    });

    // Ajustar tamaños específicos proporcionalmente
    const multiplicador = indiceTamano === 0 ? 1 : indiceTamano === 1 ? 1.15 : 1.3;

    const elementosEspeciales = document.querySelectorAll('.card-header-seg');
    elementosEspeciales.forEach(elem => {
        elem.style.fontSize = (1.1 * multiplicador) + 'rem';
    });

    const badges = document.querySelectorAll('.badge-vr, .badge-pc');
    badges.forEach(elem => {
        elem.style.fontSize = (0.75 * multiplicador) + 'rem';
    });
}


function cambiarTexto() {
    indiceTamano = (indiceTamano + 1) % tamanosTexto.length;
    localStorage.setItem('indiceTamano', indiceTamano);
    aplicarTamanoTexto();
}

function cerrarSesion() {
    const expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = `token=; path=/; ${expires}`;
    document.cookie = `usuario=; path=/; ${expires}`;
    document.cookie = `rol=; path=/; ${expires}`;
    document.cookie = `id=; path=/; ${expires}`;
    window.location.href = 'index.html';
}

function volverAlMenu() {
    window.location.href = localStorage.getItem('origen') || 'menu.html';
}

// ========== LÓGICA DE SEGUIMIENTO (TRACKING) ==========

async function cargarSimulaciones() {
    const contenedor = document.getElementById('lista-simulaciones');
    const inputExp = document.getElementById('filtro-experimento');
    const exp = inputExp ? inputExp.value : "";
    const est = document.getElementById('filtro-estudiante') ? document.getElementById('filtro-estudiante').value : "";

    if (contenedor) contenedor.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Cargando...</p>';

    let params = new URLSearchParams({
        accion: rolUsuario === 'estudiante' ? "obtenerSeguimientoEstudiante" : "obtenerSeguimientoCompleto",
        estudiante_id: idUsuario,
        filtro_nombre: est,
        filtro_exp: exp
    });

    try {
        const res = await fetch("/cgi-bin/PaginaWebLaboratorio.exe", { method: "POST", body: params });
        const data = await res.json();
        renderizarCards(data);
    } catch (e) {
        console.error("Error:", e);
    }
}

function renderizarCards(data) {
    const contenedor = document.getElementById('lista-simulaciones');
    if (!contenedor) return;

    if (!Array.isArray(data) || data.length === 0) {
        contenedor.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No hay resultados.</p>';
        return;
    }

    contenedor.innerHTML = data.map(s => `
        <div class="card-seguimiento" onclick="verDetalles('${s.id}', '${escaparHTML(s.experimento)}')">
            <div class="card-header-seg ${s.experimento.toLowerCase().replace(/\s+/g, '')}">
                <i class="fas ${getIcon(s.experimento)}"></i> <span>${escaparHTML(s.experimento)}</span>
            </div>
            <div class="card-body-seg">
                ${rolUsuario !== 'estudiante' ? `<p><strong>Estudiante:</strong> ${escaparHTML(s.estudiante)}</p>` : ''}
                <p><i class="far fa-calendar-alt"></i> ${s.fecha}</p>
                <p><i class="far fa-clock"></i> Duración: ${s.duracion}s</p>
                <span class="badge-${s.dispositivo.toLowerCase()}">${s.dispositivo}</span>
            </div>
            <div class="card-footer-seg">Ver reporte detallado <i class="fas fa-chevron-right"></i></div>
        </div>
    `).join('');
}

function getIcon(exp) {
    const icons = { 'fusion': 'fa-fire', 'evaporizacion': 'fa-cloud', 'solidificacion': 'fa-snowflake', 'condensacion': 'fa-tint' };
    const key = exp.toLowerCase();
    for (let k in icons) if (key.includes(k)) return icons[k];
    return 'fa-flask';
}

function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ========== MODAL DE DETALLES ==========

async function verDetalles(id, nombreExp) {
    const modal = document.getElementById('modal-detalle');
    if (!modal) return;

    // 1. Mostrar modal y bloquear scroll
    modal.classList.remove('oculto');
    document.body.style.overflow = 'hidden';

    // 2. Limpiar y poner títulos
    document.getElementById('det-titulo').innerText = "📊 Reporte: " + nombreExp;
    const tablaBody = document.querySelector('#tabla-resultados tbody');
    const timeline = document.getElementById('timeline-eventos');

    tablaBody.innerHTML = '<tr><td colspan="2" style="text-align:center;">Cargando...</td></tr>';
    timeline.innerHTML = '<p style="text-align:center;">Cargando eventos...</p>';

    try {
        const params = new URLSearchParams({ accion: "obtenerDetallesSimulacion", simulacion_id: id });
        const res = await fetch("/cgi-bin/PaginaWebLaboratorio.exe", { method: "POST", body: params });
        const data = await res.json();

        // 3. Llenar Resultados
        if (data.resultados && data.resultados.length > 0) {
            tablaBody.innerHTML = data.resultados.map(r => `
                <tr>
                    <td style="color: #aaa;">${escaparHTML(r.var)}</td>
                    <td style="text-align: right;">
                        <strong style="font-size: 1.1rem;">${escaparHTML(r.val)}</strong>
                        <span style="color: #007bff; margin-left:5px;">${escaparHTML(r.uni)}</span>
                    </td>
                </tr>`).join('');
        } else {
            tablaBody.innerHTML = '<tr><td colspan="2">No hay resultados.</td></tr>';
        }

        // 4. Llenar Eventos
        if (data.eventos && data.eventos.length > 0) {
            timeline.innerHTML = data.eventos.map(e => `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <small class="timeline-time"><i class="far fa-clock"></i> ${e.t}s</small><br>
                        <strong>${escaparHTML(e.nom)}</strong>
                        <p>${escaparHTML(e.det || '')}</p>
                    </div>
                </div>`).join('');
        } else {
            timeline.innerHTML = '<p>No hay eventos.</p>';
        }

    } catch (e) {
        console.error("Error cargando detalles:", e);
    }
}

function cerrarModal() {
    const modal = document.getElementById('modal-detalle');
    if (modal) {
        modal.classList.add('oculto');
        document.body.style.overflow = ''; // Restaurar scroll
    }
}

function cerrarModalSiClickFuera(event) {
    if (event.target.id === 'modal-detalle') {
        cerrarModal();
    }
}

// ========== INICIALIZACIÓN ==========

document.addEventListener("DOMContentLoaded", () => {
    // Info usuario
    const nombreElem = document.getElementById('nombre-usuario');
    const rolElem = document.getElementById('rol-usuario');
    const picElem = document.getElementById('profile-pic');

    if (nombreElem) nombreElem.textContent = nombreUsuario;
    if (rolElem) rolElem.textContent = rolUsuario.charAt(0).toUpperCase() + rolUsuario.slice(1);
    if (picElem && idUsuario) picElem.src = `img/${idUsuario}.png`;

    if (localStorage.getItem('modoOscuro') === 'true') document.body.classList.add('modo-oscuro');

    aplicarTamanoTexto();

    if (document.getElementById('lista-simulaciones')) {
        cargarSimulaciones();
    }

    // Eventos de cierre
    window.addEventListener('click', (e) => {
        const menu = document.getElementById("opciones-menu");
        const btn = document.querySelector(".boton-menu");
        if (menu && !menu.contains(e.target) && e.target !== btn) menu.classList.add("oculto");
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });
});