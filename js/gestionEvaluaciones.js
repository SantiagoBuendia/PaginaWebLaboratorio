function getToken() {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=', 2);
        if (key === 'token') return value;
    }
    return null;
}

const token = getToken();
if (!token) {
    alert("Sesión expirada o no iniciada. Redirigiendo al inicio de sesión.");
    window.location.href = 'http://localhost/PaginaWebLaboratorio/index.html';
}

function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=', 2);
        if (key === nombre) return decodeURIComponent(value);
    }
    return null;
}

const nombreUsuario = getCookie('usuario');
const rolUsuario = getCookie('rol');
const idProfesor = getCookie('id');
console.log("ID del profesor autenticado:", idProfesor);

if (nombreUsuario) {
    document.getElementById('nombre-usuario').textContent = nombreUsuario;

    document.getElementById('profile-pic').src = `img/${idProfesor}.png`;
}

if (rolUsuario) {
    document.getElementById('rol-usuario').textContent = rolUsuario.charAt(0).toUpperCase() + rolUsuario.slice(1);
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

window.addEventListener('click', function (event) {
    const menu = document.getElementById("opciones-menu");
    const boton = document.querySelector(".boton-menu");
    if (!menu.contains(event.target) && !boton.contains(event.target)) {
        menu.classList.add("oculto");
    }
});

function volverAlMenu() {
    window.location.href = 'http://localhost/PaginaWebLaboratorio/profesor.html';
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

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');

    if (tabId === 'mis-examenes') {
        cargarTablaExamenes();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("ID del profesor autenticado para grupos:", idProfesor);
    if (!idProfesor) {
        console.error("No se pudo obtener el ID del profesor para cargar los grupos.");
        document.getElementById('grupo_id').innerHTML = "<option value=''>Error: ID de profesor no disponible</option>";
        return;
    }

    const urlGrupos = `/cgi-bin/PaginaWebLaboratorio.exe?accion=listarGruposProfesor&id=${idProfesor}`;
    console.log("URL de consulta de grupos:", urlGrupos);

    fetch(urlGrupos)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos de grupos:", data);
            const select = document.getElementById('grupo_id');
            select.innerHTML = "<option value=''>Seleccione un grupo</option>";
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(grupo => {
                    const option = document.createElement('option');
                    option.value = grupo.id;
                    option.textContent = grupo.nombre;
                    select.appendChild(option);
                });
            } else {
                select.innerHTML = "<option value=''>No hay grupos disponibles</option>";
            }
        })
        .catch(error => {
            console.error("Error al cargar grupos:", error);
            document.getElementById('grupo_id').innerHTML = "<option value=''>Error al cargar grupos</option>";
        });

    document.getElementById('profesor_id').value = idProfesor;

    showTab('crear-examen');
});

document.addEventListener("DOMContentLoaded", () => {
    const formExamen = document.getElementById("form-examen");
    const preguntasContainer = document.getElementById("preguntas-container");
    const formPregunta = document.getElementById("form-pregunta");
    const opcionesContainer = document.getElementById("opciones-container");
    const formOpciones = document.getElementById("form-opciones");
    const opcionesLista = document.getElementById("opciones-lista");

    let examenIdActual = null;
    let preguntaIdActual = null;

    formExamen.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(formExamen);
        fetch(formExamen.action, {
            method: "POST",
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.examen_id) {
                    examenIdActual = data.examen_id;
                    document.getElementById("examen_id").value = examenIdActual;
                    preguntasContainer.classList.remove("hidden");
                    alert("Examen creado con éxito. Ahora puedes agregar preguntas.");
                    formExamen.reset();

                    preguntasContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    alert("Error al crear el examen: " + (data.error || "Mensaje desconocido"));
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                alert("Hubo un problema de conexión al crear el examen. Por favor, inténtalo de nuevo.");
            });
    });

    formPregunta.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(formPregunta);
        formData.set('examen_id', examenIdActual);

        fetch(formPregunta.action, {
            method: "POST",
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.pregunta_id) {
                    preguntaIdActual = data.pregunta_id;
                    document.getElementById("pregunta_id").value = preguntaIdActual;
                    opcionesContainer.classList.remove("hidden");
                    opcionesLista.innerHTML = "";
                    agregarOpcion();
                    alert("Pregunta agregada con éxito. Ahora agrega las opciones de respuesta.");
                    formPregunta.reset();
                    document.getElementById("examen_id").value = examenIdActual;
                    opcionesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    alert("Error al agregar la pregunta: " + (data.error || "Mensaje desconocido"));
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                alert("Hubo un problema de conexión al agregar la pregunta. Por favor, inténtalo de nuevo.");
            });
    });

    formOpciones.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('accion', 'agregarOpciones');
        formData.append('pregunta_id', preguntaIdActual);

        const opcionInputs = opcionesLista.querySelectorAll('input[type="text"]');
        const correctaCheckboxes = opcionesLista.querySelectorAll('input[type="checkbox"]');

        let hasCorrecta = false;
        opcionInputs.forEach((input, index) => {
            const isCorrecta = correctaCheckboxes[index].checked;
            formData.append(`opciones[${index}][texto]`, input.value);
            formData.append(`opciones[${index}][es_correcta]`, isCorrecta ? '1' : '0');
            if (isCorrecta) hasCorrecta = true;
        });

        if (!hasCorrecta) {
            alert("Debe seleccionar al menos una opción como correcta.");
            return;
        }

        fetch(formOpciones.action, {
            method: "POST",
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Opciones guardadas. Puedes continuar agregando más preguntas o finalizar el examen.");
                    formOpciones.reset();
                    opcionesLista.innerHTML = "";
                    opcionesContainer.classList.add("hidden");

                    formPregunta.reset();
                    document.getElementById("examen_id").value = examenIdActual;
                    preguntasContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    document.getElementById("finalizar-container").classList.remove("hidden");
                } else {
                    alert("Error al guardar opciones: " + (data.error || "Mensaje desconocido"));
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                alert("Hubo un problema de conexión al guardar las opciones. Por favor, inténtalo de nuevo.");
            });
    });

    window.agregarOpcion = function () {
        const index = opcionesLista.children.length;
        const div = document.createElement('div');
        div.classList.add('opcion-item');

        div.innerHTML = `
            <input type="text" name="opcion_texto_${index}" placeholder="Opción ${index + 1}" required>
            <label>
                <input type="checkbox" name="opcion_correcta_${index}"> Correcta
            </label>
            <button type="button" class="btn-remove-option" onclick="this.parentNode.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        opcionesLista.appendChild(div);
    };
});

async function cargarTablaExamenes() {
    const contenedor = document.getElementById('tabla-examenes');
    contenedor.innerHTML = '<p>Cargando exámenes...</p>';

    if (!idProfesor) {
        contenedor.innerHTML = '<p>Error: ID de profesor no disponible.</p>';
        return;
    }

    const url = `/cgi-bin/PaginaWebLaboratorio.exe?accion=listarExamenesPorProfesor&&idProfesor=${idProfesor}`;

    console.log("URL de profesor de grupos:", url);
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const html = await resp.text();
        contenedor.innerHTML = html;
    } catch (err) {
        console.error('Error al cargar tabla de exámenes:', err);
        contenedor.innerHTML = '<p>Error al cargar la lista de exámenes.</p>';
    }
}

async function confirmarEliminarExamen(examenId) {
    if (!confirm('¿Eliminar este examen? Esta acción no se puede deshacer.')) return false;

    try {
        const resp = await fetch('/cgi-bin/PaginaWebLaboratorio.exe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `accion=eliminarExamen&examen_id=${encodeURIComponent(examenId)}`
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (data.success) {
            alert('Examen eliminado correctamente.');
            cargarTablaExamenesHTML();
            return true;
        } else {
            alert('Error al eliminar examen: ' + (data.error || 'Desconocido'));
            return false;
        }
    } catch (err) {
        console.error('Error al eliminar examen:', err);
        alert('Error de conexión al eliminar el examen.');
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-ver-examenes');
    if (btn) btn.addEventListener('click', () => {
        document.getElementById('form-examen').style.display = 'none';
        document.getElementById('tabla-examenes').style.display = '';
        cargarTablaExamenesHTML();
    });
});
function finalizarExamen() {
    const confirmar = confirm("¿Deseas finalizar el examen?");
    if (!confirmar) return;

    document.getElementById("preguntas-container").classList.add("hidden");
    document.getElementById("finalizar-container").classList.add("hidden");

    document.getElementById("mensaje-final").classList.remove("hidden");

    alert("Examen finalizado correctamente. Puedes revisarlo en 'Mis Exámenes'.");
}