document.addEventListener("DOMContentLoaded", function () {
    cargarGruposProfesor();
    cargarDatosSeguimiento();
});

function cargarGruposProfesor() {
    const idProfesor = getCookie('id');
    fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=listarGruposProfesorJSON&id=${idProfesor}`)
        .then(r => r.json())
        .then(grupos => {
            const select = document.getElementById('filtro-grupo');
            grupos.forEach(g => {
                select.innerHTML += `<option value="${g.id}">${g.nombre}</option>`;
            });
        });
}

function cargarDatosSeguimiento() {
    const idProfesor = getCookie('id');
    const idGrupo = document.getElementById('filtro-grupo').value;

    fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=obtenerSeguimientoProfesor&id_profesor=${idProfesor}&id_grupo=${idGrupo}`)
        .then(r => r.json())
        .then(data => {
            document.getElementById('promedio-grupal').textContent = data.promedio_general.toFixed(2);
            document.getElementById('total-evaluaciones').textContent = data.total_intentos;

            renderizarTabla(data.detalles);
            actualizarGrafica(data.detalles);
        });
}

function renderizarTabla(lista) {
    const tbody = document.getElementById('cuerpo-tabla');
    tbody.innerHTML = "";
    lista.forEach(est => {
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 12px;">${est.nombre}</td>
                <td>${est.grupo}</td>
                <td>${est.total_evals}</td>
                <td style="font-weight:bold; color:${est.promedio >= 7 ? 'green' : 'red'}">${est.promedio.toFixed(2)}%</td>
                <td>${est.ultima_fecha}</td>
                <td><button onclick="verDetalleIndividual(${est.id})" class="btn-entrar" style="padding:5px 10px; font-size:0.8em;">Ver Perfil</button></td>
            </tr>
        `;
    });
}

function exportarExcel() {
    try {
        const table = document.getElementById("tabla-seguimiento");
        const nombreGrupo = document.getElementById('filtro-grupo').selectedOptions[0].text;

        const wb = XLSX.utils.table_to_book(table, { sheet: "Reporte" });

        XLSX.writeFile(wb, `Reporte_Desempeño_${nombreGrupo}.xlsx`);

        alert("✅ Informe Excel generado con éxito");
    } catch (error) {
        alert("❌ Error al generar Excel: " + error.message);
    }
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const nombreGrupo = document.getElementById('filtro-grupo').selectedOptions[0].text;
    const fechaActual = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text("LABORATORIO DE QUÍMICA - INFORME DE DESEMPEÑO", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Grupo: ${nombreGrupo}`, 14, 30);
    doc.text(`Fecha de generación: ${fechaActual}`, 14, 37);
    doc.text(`Docente: ${getCookie('usuario')}`, 14, 44);

    const prom = document.getElementById('promedio-grupal').textContent;
    const total = document.getElementById('total-evaluaciones').textContent;
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Resumen Grupal: Promedio ${prom}% | Total Evaluaciones: ${total}`, 14, 55);

    doc.autoTable({
        startY: 60,
        head: [['Estudiante', 'Grupo', 'Eval. Presentadas', 'Promedio Aciertos', 'Última Actividad']],
        body: datosEstudiantes.map(est => [
            est.nombre,
            est.grupo,
            est.total_evals,
            est.promedio.toFixed(2) + "%",
            "Reciente"
        ]),
        headStyles: { fillColor: [0, 51, 102] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`Informe_Desempeño_${nombreGrupo}.pdf`);
    alert("✅ Informe PDF generado con éxito");
}
let miGrafica;
function actualizarGrafica(datos) {
    const ctx = document.getElementById('graficaRendimiento').getContext('2d');
    const nombres = datos.map(d => d.nombre);
    const promedios = datos.map(d => d.promedio);

    if (miGrafica) miGrafica.destroy();
    miGrafica = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [{
                label: 'Promedio de Aciertos (%)',
                data: promedios,
                backgroundColor: 'rgba(0, 51, 102, 0.6)',
                borderColor: '#003366',
                borderWidth: 1
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
    });
}

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
if (rol !== 'profesor') {
    alert("⚠️ Acceso denegado. Esta página es exclusiva para docentes.");

    if (rol === 'estudiante') {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/estudiante.html';
    } else {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/index.html';
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
    if (rol === 'administrador') {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/administrador.html';
    }
    else if (rol === 'profesor') {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/profesor.html';
    }
    else if (rol === 'estudiante') {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/estudiante.html';
    }
    else {
        window.location.href = 'index.html';
    }
}

function verDetalleIndividual(idEstudiante) {
    window.location.href = `perfilEstudiante.html?estudiante_id=${idEstudiante}`;
}

let datosEstudiantes = [];

function cargarDatosSeguimiento() {
    const idProfesor = getCookie('id');
    const idGrupo = document.getElementById('filtro-grupo').value;

    fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=obtenerSeguimientoProfesor&id_profesor=${idProfesor}&id_grupo=${idGrupo}`)
        .then(r => r.json())
        .then(data => {
            datosEstudiantes = data.detalles;

            document.getElementById('promedio-grupal').textContent = data.promedio_general.toFixed(2);
            document.getElementById('total-evaluaciones').textContent = data.total_intentos;

            renderizarTabla(datosEstudiantes);
            actualizarGrafica(datosEstudiantes);
        });
}

function filtrarEstudiantes() {
    const texto = document.getElementById('filtro-nombre').value.toLowerCase();

    const filtrados = datosEstudiantes.filter(est =>
        est.nombre.toLowerCase().includes(texto) ||
        est.grupo.toLowerCase().includes(texto)
    );

    renderizarTabla(filtrados);
}

function renderizarTabla(lista) {
    const tbody = document.getElementById('cuerpo-tabla');
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding:20px;'>No se encontraron resultados</td></tr>";
        return;
    }

    lista.forEach(est => {
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 12px;">${est.nombre}</td>
                <td>${est.grupo}</td>
                <td style="text-align:center;">${est.total_evals}</td>
                <td style="font-weight:bold; color:${est.promedio >= 7 ? '#28a745' : '#dc3545'}">${est.promedio.toFixed(2)}</td>
                <td>Reciente</td>
                <td style="display: flex; gap: 5px; padding: 12px;">
                    <button onclick="verDetalleIndividual(${est.id})" class="btn-entrar" style="padding:5px 8px; font-size:0.75em;">
                        <i class="fas fa-user"></i> Perfil
                    </button>
                    <button onclick="abrirModalSimulaciones(${est.id})" class="btn-simulacion" style="background-color: #17a2b8; color: white; border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 0.75em;">
                        <i class="fas fa-flask"></i> Simulaciones
                    </button>
                </td>
            </tr>
        `;
    });
}

function abrirModalSimulaciones(idEstudiante) {
    abrirModal('modal-simulaciones');

    const modal = document.getElementById('modal-simulaciones');
    const tbody = document.getElementById('cuerpo-tabla-simulaciones');

    tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Cargando historial...</td></tr>";
    modal.classList.remove('oculto');

    fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=obtenerSeguimientoEstudiante&estudiante_id=${idEstudiante}`)
        .then(r => r.json())
        .then(data => {
            tbody.innerHTML = "";
            if (!data || data.length === 0) {
                tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No hay simulaciones registradas.</td></tr>";
                return;
            }

            data.forEach(sim => {
                const mins = Math.floor(sim.duracion / 60);
                const segs = sim.duracion % 60;
                tbody.innerHTML += `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px;">${sim.experimento}</td>
                        <td>${sim.fecha}</td>
                        <td>${mins}m ${segs}s</td>
                        <td><span class="badge-puntos" style="background:#6c757d; font-size:0.7em;">${sim.dispositivo}</span></td>
                        <td>
                            <button onclick="abrirDetalleSimulacion(${sim.id})" class="btn-entrar" style="padding:3px 8px; font-size:0.8em;">
                                <i class="fas fa-eye"></i> Detalle
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => {
            console.error(err);
            tbody.innerHTML = "<tr><td colspan='5' style='color:red; text-align:center;'>Error al conectar con el servidor</td></tr>";
        });
}

function abrirDetalleSimulacion(idSimulacion) {
    abrirModal('modal-detalle-simulacion');

    const modal = document.getElementById('modal-detalle-simulacion');
    const listaRes = document.getElementById('lista-resultados');
    const listaEve = document.getElementById('lista-eventos');

    modal.classList.remove('oculto');
    listaRes.innerHTML = "<li>Cargando...</li>";
    listaEve.innerHTML = "<li>Cargando...</li>";

    fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=obtenerDetallesSimulacion&simulacion_id=${idSimulacion}`)
        .then(r => r.json())
        .then(data => {
            listaRes.innerHTML = data.resultados.length > 0
                ? data.resultados.map(r => `<li><strong>${r.var}:</strong> ${r.val} ${r.uni}</li>`).join('')
                : "<li>Sin resultados numéricos</li>";

            listaEve.innerHTML = data.eventos.length > 0
                ? data.eventos.map(e => `<li><small style="color:#007bff">[${e.t}s]</small> ${e.nom}</li>`).join('')
                : "<li>Sin eventos registrados</li>";
        });
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('oculto');
    }

    const modalesVisibles = document.querySelectorAll('.modal-personalizado:not(.oculto)');
    if (modalesVisibles.length === 0) {
        document.body.classList.remove('modal-abierto');
    }
}

function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('oculto');
        document.body.classList.add('modal-abierto');
    } else {
        console.error("No se encontró el modal con ID: " + id);
    }
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal-personalizado')) {
        cerrarModal(event.target.id);
    }
}