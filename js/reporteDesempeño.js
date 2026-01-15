let datosAlumnoGlobal = null;

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const idEst = params.get('estudiante_id');

    if (!idEst) {
        console.error("ID de estudiante no proporcionado");
        return;
    }

    fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=obtenerHistorialAlumno&estudiante_id=${idEst}`)
        .then(r => r.json())
        .then(data => {
            datosAlumnoGlobal = data;
            document.getElementById('nombre-alumno-titulo').textContent = data.nombre;

            renderizarHistorial(data.intentos);
            generarGraficaEvolucion(data.intentos);
        })
        .catch(err => {
            console.error("Error al cargar datos:", err);
            document.getElementById('nombre-alumno-titulo').textContent = "Error al cargar datos";
        });
});

function renderizarHistorial(intentos) {
    const tbody = document.getElementById('historial-intentos');
    if (!intentos || intentos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No hay intentos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = intentos.map(i => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding:12px;">${i.examen}</td>
            <td>Intento #${i.n_intento}</td>
            <td style="font-weight:bold; color:${i.nota >= 7 ? '#27ae60' : '#e74c3c'}">${i.nota}/10</td>
            <td>${((i.nota / 10) * 100).toFixed(0)}%</td>
            <td class="no-export">
                <button onclick="window.location.href='verResultado.html?intento_id=${i.id_intento}'"
                        class="btn-entrar" style="padding:5px 10px; cursor:pointer;">
                    Ver Detalle
                </button>
            </td>
        </tr>
    `).join('');
}

function generarGraficaEvolucion(intentos) {
    const ctx = document.getElementById('graficaEvolucion').getContext('2d');
    const dataReverse = [...intentos].reverse();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataReverse.map(i => i.examen),
            datasets: [{
                label: 'Calificación',
                data: dataReverse.map(i => i.nota),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 10 }
            }
        }
    });
}

function mostrarConfirmacion() {
    const notif = document.getElementById('notificacion-exito');
    notif.style.display = 'block';
    setTimeout(() => notif.style.display = 'none', 4000);
}

function generarInformePDF() {
    if (!datosAlumnoGlobal) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const alumno = datosAlumnoGlobal;

    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text("INFORME DE DESEMPEÑO ACADÉMICO", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Estudiante: ${alumno.nombre}`, 20, 35);
    doc.text(`Fecha del reporte: ${new Date().toLocaleDateString()}`, 20, 42);

    const body = alumno.intentos.map(i => [
        i.examen,
        `Intento #${i.n_intento}`,
        `${i.nota}/10`,
        `${((i.nota / 10) * 100).toFixed(0)}%`
    ]);

    doc.autoTable({
        startY: 50,
        head: [['Examen', 'N° Intento', 'Calificación', '% Aciertos']],
        body: body,
        theme: 'striped',
        headStyles: { fillColor: [0, 51, 102] }
    });

    doc.save(`Informe_${alumno.nombre.replace(/ /g, "_")}.pdf`);
    mostrarConfirmacion();
}

function generarInformeExcel() {
    if (!datosAlumnoGlobal) return;

    const alumno = datosAlumnoGlobal;
    const wb = XLSX.utils.book_new();

    const ws_data = [
        ["INFORME DE DESEMPEÑO"],
        ["Estudiante:", alumno.nombre],
        ["Fecha:", new Date().toLocaleDateString()],
        [],
        ["Examen", "Número de Intento", "Calificación", "Porcentaje"]
    ];

    alumno.intentos.forEach(i => {
        ws_data.push([
            i.examen,
            i.n_intento,
            i.nota,
            `${((i.nota / 10) * 100).toFixed(0)}%`
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Historial");
    XLSX.writeFile(wb, `Reporte_${alumno.nombre.replace(/ /g, "_")}.xlsx`);
    mostrarConfirmacion();
}