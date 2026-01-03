document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const idExamen = params.get('id_examen');

    if (!idExamen) {
        alert("Error: ID de examen no encontrado.");
        window.location.href = "gestionEvaluaciones.html";
        return;
    }
    document.getElementById('examen_id').value = idExamen;

    agregarCampoOpcion();
    agregarCampoOpcion();

    document.getElementById('form-nueva-pregunta').addEventListener('submit', function (e) {
        e.preventDefault();
        guardarPreguntaCompleta();
    });
});

function agregarCampoOpcion() {
    const container = document.getElementById('contenedor-opciones');
    const index = container.children.length + 1;

    const div = document.createElement('div');
    div.className = 'opcion-row';

    div.innerHTML = `
        <input type="radio" name="radio_correcta" class="radio-custom" title="Marcar como correcta" required>
        <input type="text" class="input-moderno opcion-texto" placeholder="Opción ${index}" required>
        <button type="button" class="btn-eliminar-opcion" onclick="eliminarOpcion(this)" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    container.appendChild(div);
}

function eliminarOpcion(btn) {
    const row = btn.parentElement;
    if (document.getElementById('contenedor-opciones').children.length > 1) {
        row.remove();
    } else {
        alert("Debe haber al menos una opción.");
    }
}

async function guardarPreguntaCompleta() {
    const idExamen = document.getElementById('examen_id').value;
    const pregunta = document.getElementById('pregunta').value;
    const puntos = document.getElementById('puntos').value;
    const explicacion = document.getElementById('explicacion').value;

    const radios = document.querySelectorAll('input[name="radio_correcta"]');
    let seleccionada = false;
    radios.forEach(r => { if (r.checked) seleccionada = true; });

    if (!seleccionada) {
        alert("Por favor, marca cuál es la respuesta correcta.");
        return;
    }

    const dataPregunta = new URLSearchParams();
    dataPregunta.append('accion', 'agregarPregunta');
    dataPregunta.append('examen_id', idExamen);
    dataPregunta.append('pregunta', pregunta);
    dataPregunta.append('puntos', puntos);
    dataPregunta.append('explicacion', explicacion);

    try {
        const responsePregunta = await fetch('/cgi-bin/PaginaWebLaboratorio.exe', {
            method: 'POST', body: dataPregunta
        });
        const jsonPregunta = await responsePregunta.json();
        if (jsonPregunta.error) throw new Error(jsonPregunta.error);

        // Paso 2
        await guardarOpciones(jsonPregunta.pregunta_id);

        alert("Pregunta agregada exitosamente.");

        // Limpiar
        document.getElementById('pregunta').value = "";
        document.getElementById('explicacion').value = "";
        document.getElementById('contenedor-opciones').innerHTML = "";
        agregarCampoOpcion();
        agregarCampoOpcion();
    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
}

async function guardarOpciones(preguntaID) {
    const filas = document.querySelectorAll('.opcion-row');
    const dataOpciones = new URLSearchParams();
    dataOpciones.append('accion', 'agregarOpciones');
    dataOpciones.append('pregunta_id', preguntaID);

    filas.forEach((fila, index) => {
        const texto = fila.querySelector('.opcion-texto').value;
        const radio = fila.querySelector('input[type="radio"]');
        const esCorrecta = radio.checked ? "1" : "0";

        dataOpciones.append(`opciones[${index}][texto]`, texto);
        dataOpciones.append(`opciones[${index}][es_correcta]`, esCorrecta);
    });

    const response = await fetch('/cgi-bin/PaginaWebLaboratorio.exe', {
        method: 'POST', body: dataOpciones
    });
    const json = await response.json();
    if (!json.success) throw new Error("Error al guardar opciones.");
}