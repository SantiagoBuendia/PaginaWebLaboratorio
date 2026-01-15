const showHiddenPass = (loginPass, loginEye) => {
    const input = document.getElementById(loginPass),
        iconEye = document.getElementById(loginEye);

    if (input && iconEye) {
        iconEye.addEventListener("click", () => {
            if (input.type === "password") {
                input.type = "text";
                iconEye.classList.add("ri-eye-line");
                iconEye.classList.remove("ri-eye-off-line");
            } else {
                input.type = "password";
                iconEye.classList.remove("ri-eye-line");
                iconEye.classList.add("ri-eye-off-line");
            }
        });
    }
};

showHiddenPass("contrasena", "login-eye");

const loginForm = document.getElementById('login-form');
const correoInput = document.getElementById('correo');
const recordarCheckbox = document.getElementById('recordar');

document.addEventListener("DOMContentLoaded", () => {
    const correoGuardado = localStorage.getItem('usuarioCorreo');

    if (correoGuardado) {
        correoInput.value = correoGuardado;
        recordarCheckbox.checked = true;
    }
});

loginForm.addEventListener('submit', () => {
    if (recordarCheckbox.checked) {
        localStorage.setItem('usuarioCorreo', correoInput.value);
    } else {
        localStorage.removeItem('usuarioCorreo');
    }
});