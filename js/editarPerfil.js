function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === nombre) return decodeURIComponent(value);
    }
    return null;
}

window.addEventListener("DOMContentLoaded", () => {
    const nombre = getCookie('usuario');
    const rol = getCookie('rol');
    const correo = getCookie('correo');
    const id = getCookie('id');
    const contrasena = getCookie('contrasena');

    if (nombre) {
        document.getElementById("nombren").value = nombre;
    }

    if (contrasena) document.getElementById("contrasenan").value = contrasena;

    if (correo) {
        document.getElementById("correo").textContent = correo;               // Para mostrarlo
    }

    if (rol) {
        document.getElementById("rol-usuario").textContent = rol.charAt(0).toUpperCase() + rol.slice(1);
    }

    if (id) {
        document.getElementById("foto-preview").src = `img/${id}.png`;
        document.getElementById("id-hidden").value = id;   
    }

    // Vista previa de imagen al seleccionar archivo
    document.getElementById("foto").addEventListener("change", function () {
        const archivo = this.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function (e) {
                document.getElementById("foto-preview").src = e.target.result;
            };
            lector.readAsDataURL(archivo);
        }
    });


    document.getElementById("btn-volver").addEventListener("click", () => {
        const origen = localStorage.getItem('origen') || "menu.html";
        window.location.href = origen;
    });

    document.getElementById("ver-contra").addEventListener("change", function () {
        const campo = document.getElementById("contrasenan");
        campo.type = this.checked ? "text" : "password";
    });

});
