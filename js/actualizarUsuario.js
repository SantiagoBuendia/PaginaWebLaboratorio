function getParametroURL(nombre) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre);
}

window.addEventListener("DOMContentLoaded", () => {
    const nombre = getParametroURL('nombre');
    const correo = getParametroURL('correo');
    const rol = getParametroURL('rol');
    const id = getParametroURL('id');
    const contrasena = getParametroURL('contrasena');

    if (nombre) document.getElementById("nombren").value = nombre;
    if (correo) document.getElementById("correo").value = correo;
    if (rol) {
        const selectRol = document.getElementById("rol");
        selectRol.value = rol.toLowerCase(); // Asegura coincidencia exacta en valor
    }

    if (id) {
        document.getElementById("foto-preview").src = `img/${id}.png`;
        document.getElementById("id-hidden").value = id;
    }

    if (contrasena) document.getElementById("contrasenan").value = contrasena;

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
        window.location.href = "http://localhost/PaginaWebLaboratorio/gestionUsuarios.html";
    });

    document.getElementById("ver-contra").addEventListener("change", function () {
        const campo = document.getElementById("contrasenan");
        campo.type = this.checked ? "text" : "password";
    });
});
