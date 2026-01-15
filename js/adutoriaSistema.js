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
    window.location.href = "http://localhost/PaginaWebLaboratorio/administrador.html";
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

function filtrarAuditoria() {
    const valUsuario = document.getElementById("f-usuario").value.toLowerCase();
    const valAccion = document.getElementById("f-accion").value;
    const valFecha = document.getElementById("f-fecha").value;

    const filas = document.querySelectorAll("#tabla-usuarios table tbody tr");

    filas.forEach(fila => {
        const txtUsuario = fila.cells[1] ? fila.cells[1].textContent.toLowerCase() : "";
        const txtAccion = fila.cells[3] ? fila.cells[3].textContent : "";
        const txtFecha = fila.cells[5] ? fila.cells[5].textContent : "";

        const coincideUsuario = txtUsuario.includes(valUsuario);

        const coincideAccion = (valAccion === "todos" || txtAccion === valAccion);

        const coincideFecha = (valFecha === "" || txtFecha.startsWith(valFecha));

        if (coincideUsuario && coincideAccion && coincideFecha) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("f-usuario").addEventListener("input", filtrarAuditoria);
    document.getElementById("f-accion").addEventListener("change", filtrarAuditoria);
    document.getElementById("f-fecha").addEventListener("change", filtrarAuditoria);

    document.getElementById("btn-limpiar-filtros").addEventListener("click", () => {
        document.getElementById("f-usuario").value = "";
        document.getElementById("f-accion").value = "todos";
        document.getElementById("f-fecha").value = "";
        filtrarAuditoria();
    });
});

function cargarUsuarios() {
    fetch("/cgi-bin/PaginaWebLaboratorio.exe?accion=listarAu")
        .then((res) => res.text())
        .then((html) => {
            document.getElementById("tabla-usuarios").innerHTML = html;

            filtrarAuditoria();
        })
        .catch(() => {
            document.getElementById("tabla-usuarios").innerText = "Error al cargar auditoría.";
        });
}

function exportarCSV() {
    const filas = document.querySelectorAll("#tabla-usuarios table tr");
    let csvContent = "\uFEFF";

    filas.forEach((fila) => {
        if (fila.style.display !== "none") {
            const celdas = fila.querySelectorAll("th, td");
            const filaData = Array.from(celdas).map(celda => `"${celda.textContent.replace(/"/g, '""')}"`);
            csvContent += filaData.join(",") + "\n";
        }
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `Auditoria_Sistema_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');

        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("HISTORIAL DE AUDITORÍA DEL SISTEMA", 14, 15);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 22);

        const tabla = document.querySelector("#tabla-usuarios table");
        if (!tabla) {
            alert("No hay datos para exportar.");
            return;
        }

        const encabezados = [];
        const ths = tabla.querySelectorAll("thead th");
        ths.forEach(th => encabezados.push(th.textContent));

        const filasVisibles = [];
        const trs = tabla.querySelectorAll("tbody tr");

        trs.forEach(tr => {
            if (tr.style.display !== "none") {
                const celdas = tr.querySelectorAll("td");
                const filaData = [];
                celdas.forEach(td => filaData.push(td.textContent));
                filasVisibles.push(filaData);
            }
        });

        if (filasVisibles.length === 0) {
            alert("No hay registros visibles con los filtros actuales.");
            return;
        }

        doc.autoTable({
            head: [encabezados],
            body: filasVisibles,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [0, 51, 102], textColor: 255 },
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 30 },
                3: { cellWidth: 25 },
                5: { cellWidth: 40 }
            }
        });

        doc.save(`Auditoria_${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error("Error al generar PDF:", error);
        alert("Error crítico al generar el PDF. Revisa la consola (F12).");
    }
}