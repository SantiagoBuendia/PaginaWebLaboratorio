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
    fetch('/cgi-bin/PaginaWebLaboratorio.exe?accion=listarGrupos')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('grupo_id');
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
            document.getElementById('grupo_id').innerHTML = "<option value=''>Error al cargar grupos</option>";
        });
});