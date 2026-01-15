document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const idExamen = params.get('id');
    const idEstudiante = getCookie('id');
    const contenedor = document.getElementById('contenedor-preguntas');

    document.getElementById('nombre-usuario').textContent = getCookie('usuario') || "Usuario";
    document.getElementById('profile-pic').src = `img/${idEstudiante}.png`;

    if (!idExamen) {
        contenedor.innerHTML = "<p style='color:red;'>Error: Examen no especificado.</p>";
        return;
    }

    fetch(`/cgi-bin/PaginaWebLaboratorio.exe?accion=prepararExamenEstudiante&examen_id=${idExamen}&estudiante_id=${idEstudiante}`)
        .then(r => r.text())
        .then(html => {
            contenedor.innerHTML = html.replace(/Content-type: text\/html\s+/i, "").trim();
        })
        .catch(err => {
            contenedor.innerHTML = "<p>Error al conectar con el servidor.</p>";
        });

    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
    }
});

function enviarExamen() {
    if (!confirm("¿Deseas finalizar el examen?")) return;

    const form = document.getElementById('formExamen');
    const formData = new FormData(form);
    const params = new URLSearchParams(window.location.search);

    let url = `/cgi-bin/PaginaWebLaboratorio.exe?accion=calificarExamen`;
    url += `&examen_id=${params.get('id')}`;
    url += `&estudiante_id=${getCookie('id')}`;

    formData.forEach((value, key) => {
        url += `&${key}=${value}`;
    });

    console.log("Enviando datos a:", url);

    fetch(url)
        .then(response => {
            return response.text().then(text => {
                console.log("Respuesta bruta del servidor:", text);
                try {
                    return JSON.parse(text);
                } catch (err) {
                    throw new Error("El servidor no envió un JSON válido: " + text);
                }
            });
        })
        .then(data => {
            console.log("JSON procesado:", data);
            if (data.status === "success") {
                alert("✅ Examen finalizado. Nota: " + data.nota);

                const destino = `verResultado.html?intento_id=${data.id_intento}`;
                console.log("Redirigiendo a:", destino);
                window.location.href = destino;
            } else {
                alert("Error en la respuesta del servidor");
            }
        })
        .catch(error => {
            console.error("Error completo:", error);
            alert("Hubo un error al procesar el examen. Revisa la consola (F12).");
        });
}

function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === nombre) return decodeURIComponent(value);
    }
    return null;
}

function toggleMenu() {
    document.getElementById("opciones-menu").classList.toggle("oculto");
}

function cerrarSesion() {
    document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = 'index.html';
}

function cambiarColor() {
    document.body.classList.toggle("modo-oscuro");
    localStorage.setItem('modoOscuro', document.body.classList.contains("modo-oscuro"));
}