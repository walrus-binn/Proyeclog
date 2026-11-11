
/* =========================================
   1. OBTENER ELEMENTOS DEL HTML
========================================= */

// Formulario principal
const loginForm = document.getElementById("loginForm");

// Campos de entrada
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Mensajes de error individuales
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

// Elementos adicionales
const togglePassword = document.getElementById("togglePassword");
const rememberEmail = document.getElementById("rememberEmail");
const formMessage = document.getElementById("formMessage");
const forgotPassword = document.getElementById("forgotPassword");
const eyeIcon = document.getElementById("eyeIcon");


/* =========================================
   2. CREDENCIALES DE DEMOSTRACIÓN
========================================= */

// IMPORTANTE:
// Estas credenciales son exclusivamente didácticas.
// La autenticación se realiza en el navegador y NO
// constituye un mecanismo seguro de autenticación.
//
// En una aplicación real se debe utilizar un servidor,
// una base de datos protegida y contraseñas cifradas.

const DEMO_EMAIL = "demo@ejemplo.com";
const DEMO_PASSWORD = "Demo1234!";


/* =========================================
   3. VALIDACIÓN DEL CORREO ELECTRÓNICO
========================================= */

// Expresión regular para comprobar el formato del correo.

function validarCorreo(correo) {

    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return patron.test(correo);

}


/* =========================================
   4. MOSTRAR MENSAJES DE ERROR
========================================= */

// Función para mostrar errores debajo de los campos.

function mostrarError(input, mensajeElemento, mensaje) {

    mensajeElemento.textContent = mensaje;

    input.parentElement.classList.add("invalid");
    input.parentElement.classList.remove("valid");

}


// Función para limpiar los errores.

function limpiarError(input, mensajeElemento) {

    mensajeElemento.textContent = "";

    input.parentElement.classList.remove("invalid");

    if (input.value.trim() !== "") {
        input.parentElement.classList.add("valid");
    } else {
        input.parentElement.classList.remove("valid");
    }

}


/* =========================================
   5. VALIDAR CORREO ELECTRÓNICO
========================================= */

function validarCampoCorreo() {

    const correo = emailInput.value.trim();

    // Comprobar que no esté vacío.

    if (correo === "") {

        mostrarError(
            emailInput,
            emailError,
            "El correo electrónico es obligatorio."
        );

        return false;

    }

    // Comprobar que tenga un formato correcto.

    if (!validarCorreo(correo)) {

        mostrarError(
            emailInput,
            emailError,
            "Ingresa un correo electrónico válido."
        );

        return false;

    }

    // Si todo está correcto, limpiar el error.

    limpiarError(emailInput, emailError);

    return true;

}


/* =========================================
   6. VALIDAR CONTRASEÑA
========================================= */

function validarCampoPassword() {

    const password = passwordInput.value;

    // Comprobar que no esté vacía.

    if (password.trim() === "") {

        mostrarError(
            passwordInput,
            passwordError,
            "La contraseña es obligatoria."
        );

        return false;

    }

    // Comprobar que tenga al menos ocho caracteres.

    if (password.length < 8) {

        mostrarError(
            passwordInput,
            passwordError,
            "La contraseña debe tener al menos 8 caracteres."
        );

        return false;

    }

    // Si todo está correcto, limpiar el error.

    limpiarError(passwordInput, passwordError);

    return true;

}


/* =========================================
   7. MOSTRAR U OCULTAR CONTRASEÑA
========================================= */

togglePassword.addEventListener("click", function() {

    // Comprobar el tipo actual del campo.

    const mostrar = passwordInput.type === "password";

    // Cambiar entre password y text.

    passwordInput.type = mostrar ? "text" : "password";

    // Actualizar la descripción accesible del botón.

    togglePassword.setAttribute(
        "aria-label",
        mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
    );

    togglePassword.setAttribute(
        "aria-pressed",
        String(mostrar)
    );

    // Cambiar el icono del ojo.

    if (mostrar) {

        eyeIcon.innerHTML = `
            <path d="M3 3L21 21"/>
            <path d="M10.5 5.2C11 5.1 11.5 5 12 5
                     C18.5 5 22 12 22 12
                     S20.5 15 18 17"/>
            <path d="M6.2 6.2C3.4 8 2 12 2 12
                     S5.5 19 12 19
                     C13.5 19 14.8 18.6 16 18"/>
        `;

    } else {

        eyeIcon.innerHTML = `
            <path d="M2 12S5.5 5 12 5
                     S22 12 22 12
                     S18.5 19 12 19
                     S2 12 2 12Z"/>
            <circle cx="12" cy="12" r="3"/>
        `;

    }

});


/* =========================================
   8. RECORDAR CORREO ELECTRÓNICO
========================================= */

// IMPORTANTE:
// Solo se almacena el correo electrónico.
// Nunca se guarda la contraseña.

const correoGuardado = localStorage.getItem("correoRecordado");

if (correoGuardado) {

    emailInput.value = correoGuardado;

    rememberEmail.checked = true;

}


/* =========================================
   9. MOSTRAR MENSAJE GENERAL
========================================= */

function mostrarMensaje(mensaje, tipo) {

    formMessage.textContent = mensaje;

    formMessage.className = "form-message " + tipo;

}


/* =========================================
   10. VALIDAR AL ESCRIBIR
========================================= */

// Limpiar mensajes cuando el usuario modifica
// el contenido de los campos.

emailInput.addEventListener("input", function() {

    limpiarError(emailInput, emailError);

    formMessage.className = "form-message";

});


passwordInput.addEventListener("input", function() {

    limpiarError(passwordInput, passwordError);

    formMessage.className = "form-message";

});


/* =========================================
   11. PROCESAR EL INICIO DE SESIÓN
========================================= */

loginForm.addEventListener("submit", function(event) {

    // Evitar el envío tradicional y la recarga.

    event.preventDefault();

    // Eliminar mensajes anteriores.

    formMessage.className = "form-message";

    // Ejecutar las validaciones.

    const correoValido = validarCampoCorreo();

    const passwordValida = validarCampoPassword();


    // Si existe algún error, detener el proceso.

    if (!correoValido || !passwordValida) {

        mostrarMensaje(
            "Por favor, corrige los errores antes de continuar.",
            "error"
        );

        if (!correoValido) {
            emailInput.focus();
        } else {
            passwordInput.focus();
        }

        return;

    }


    // Obtener los valores ingresados.

    const correo = emailInput.value.trim();

    const password = passwordInput.value;


    // Comprobar la opción de recordar correo.

    if (rememberEmail.checked) {

        localStorage.setItem("correoRecordado", correo);

    } else {

        localStorage.removeItem("correoRecordado");

    }


    /* =====================================
       12. AUTENTICACIÓN SIMULADA
    ===================================== */

    // Comparar los datos ingresados con las
    // credenciales de demostración.

    if (
        correo === DEMO_EMAIL &&
        password === DEMO_PASSWORD
    ) {

        mostrarMensaje(
            "¡Bienvenido! Has iniciado sesión correctamente.",
            "success"
        );

        console.log("Inicio de sesión exitoso.");

    } else {

        mostrarMensaje(
            "Correo electrónico o contraseña incorrectos.",
            "error"
        );

    }

});


/* =========================================
   13. ENLACE OLVIDÉ MI CONTRASEÑA
========================================= */

// Como se trata de una práctica didáctica,
// se muestra un mensaje informativo.

forgotPassword.addEventListener("click", function(event) {

    event.preventDefault();

    mostrarMensaje(
        "La recuperación de contraseña no está habilitada en esta versión de demostración.",
        "error"
    );

});
