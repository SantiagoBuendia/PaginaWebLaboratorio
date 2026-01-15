function getParametroURL(nombre) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre);
}
function getToken() {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === 'token') return value;
    }
    return null;
}

window.addEventListener("DOMContentLoaded", () => {
    const token = getToken();
    console.log("Token recibido:", token);

    if (!token) {
        alert("No hay token. Redirigiendo...");
        window.location.href = 'http://localhost/PaginaWebLaboratorio/index.html';
        return;
    }

    function getCookie(nombre) {
        const cookies = document.cookie.split('; ');
        for (const c of cookies) {
            const [key, value] = c.split('=');
            if (key === nombre) return decodeURIComponent(value);
        }
        return null;
    }

    const nombre = getParametroURL('nombre');
    const id = getParametroURL('id');
    const cookieId = getCookie('id');

    console.log("Valor de nombre en URL:", nombre);
    console.log("Elemento inputNombre:", document.getElementById("nombren"));

    if (nombre && document.getElementById("nombren")) {
        document.getElementById("nombren").value = nombre;
    }
    if (id && document.getElementById("id-hidden")) {
        document.getElementById("id-hidden").value = id;
    }
    if (cookieId && document.getElementById('usuario_id')) {
        document.getElementById('usuario_id').value = cookieId;
    }

    document.getElementById("btn-volver").addEventListener("click", () => {
        window.location.href = "http://localhost/PaginaWebLaboratorio/gestionUsuarios.html";
    });
});

window.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById('grupo_id');
    if (!select) {
        console.error("No existe el elemento select#grupo_id en el DOM.");
        return;
    }

    const url = '/cgi-bin/PaginaWebLaboratorio.exe?accion=listarGrupos';
    console.log("Fetch grupos ->", url);

    fetch(url)
        .then(response => {
            console.log("Respuesta fetch grupos:", response.status, response.statusText, response.headers.get('content-type'));

            return response.text().then(text => ({ ok: response.ok, status: response.status, text }));
        })
        .then(({ ok, status, text }) => {
            console.log("Respuesta cruda de listarGrupos:", text);
            if (!ok) {
                throw new Error(`Petición fallida. status=${status}`);
            }
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error("JSON inválido: " + err.message);
            }

            select.innerHTML = "";
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
            select.innerHTML = "<option value=''>Error al cargar grupos</option>";
        });
});