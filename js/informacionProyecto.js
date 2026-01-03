function getToken() {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === 'token') return value;
    }
    return null;
}

const token = getToken();
console.log("Token recibido:", token);

if (!token) {
    alert("No hay token. Redirigiendo...");
    window.location.href = 'http://localhost/PaginaWebLaboratorio/index.html';
}

function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
        const [key, value] = c.split('=');
        if (key === nombre) return decodeURIComponent(value);
    }
    return null;
}

const nombre = getCookie('usuario');
const rol = getCookie('rol');
const id = getCookie('id');

if (nombre) {
    document.getElementById('nombre-usuario').textContent = nombre;
    const rutaImagen = `img/${id}.png`;
    document.getElementById('profile-pic').src = rutaImagen;
}

if (rol) {
    document.getElementById('rol-usuario').textContent = rol.charAt(0).toUpperCase() + rol.slice(1);
}

if (rol !== 'administrador') {
    const btnDoc = document.getElementById('btn-documentacion');
    if (btnDoc) {
        btnDoc.style.display = 'none';
    }
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

window.addEventListener('click', function (event) {
    const menu = document.getElementById("opciones-menu");
    const boton = document.querySelector(".boton-menu");
    if (!menu.contains(event.target) && !boton.contains(event.target)) {
        menu.classList.add("oculto");
    }
});

function volverAlMenu() {
    if (rol === 'administrador') {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/administrador.html';
    }
    else if (rol === 'profesor') {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/profesor.html';
    }
    else if (rol === 'estudiante') {
        window.location.href = 'http://localhost/PaginaWebLaboratorio/estudiante.html';
    }
    else {
        window.location.href = 'index.html';
    }
}

function mostrarTexto(id) {
    const textos = {
        textoDescripcion: `
            <h3>Descripcion general del sistema</h3>
            <p>
                El <em>Entorno de Realidad Virtual para la Exploracion de los Estados de la Materia</em>
                es una aplicacion educativa inmersiva diseñada para que estudiantes de bachillerato
                comprendan, de forma visual e interactiva, los cambios de estado y las propiedades
                fundamentales de la materia. A traves de un laboratorio virtual en primera persona,
                el sistema permite observar fenomenos tanto a nivel macroscopico como microscopico,
                manipulando variables como la temperatura y la presion en tiempo real, mientras se
                reciben explicaciones y retroalimentacion contextualizada.
            </p>
            <p>
                Este sistema integra modulos que van desde la navegacion inicial y el acceso a contenidos
                teoricos, hasta la experimentacion practica y la evaluacion formativa. Entre sus beneficios
                destacan el aumento de la motivacion y la participacion estudiantil gracias a la inmersion
                virtual, la reduccion de barreras logisticas y de seguridad propias de laboratorios fisicos,
                y la conexion fluida con materiales teoricos, guias y tutoriales que fortalecen el aprendizaje
                antes, durante y despues de las practicas. Asimismo, la plataforma almacena el progreso y
                resultados de cada estudiante, lo que facilita a los docentes el seguimiento y la evaluacion
                personalizada del desempeño academico.
            </p>
            <p>
                La arquitectura del sistema esta basada en Unity 2021.3 LTS, utilizando C# y C++ para
                la logica y optimizacion de las simulaciones moleculares. Funciona con hardware de
                realidad virtual como HTC Vive Pro 2, permitiendo interaccion con controladores hapticos
                para manipular objetos, ajustar variables y experimentar con condiciones fisicas diversas.
                El backend utiliza MySQL para almacenar perfiles de usuario, historial de actividades y
                resultados de evaluaciones, garantizando un seguimiento continuo y seguro del aprendizaje.
            </p>
        `,
        textoObjetivosAlcances: `
            <h3>Objetivos y Alcances</h3>
            <p>
                <strong>Objetivo general:</strong> Diseñar un entorno de realidad virtual orientado a la
                exploracion de los estados de la materia para estudiantes de bachillerato, facilitando
                la comprension de conceptos cientificos complejos mediante la interaccion directa con
                simulaciones moleculares.
            </p>
            <p>
                <strong>Objetivos especificos:</strong>
                <ul>
                    <li>Realizar una revision de literatura sobre entornos virtuales educativos y sus aplicaciones en la enseñanza de ciencias.</li>
                    <li>Diseñar el modelo conceptual del sistema, incluyendo la estructura de modulos y funcionalidades clave.</li>
                    <li>Desarrollar un prototipo funcional que implemente simulaciones interactivas de cambios de estado.</li>
                    <li>Validar la aceptacion del sistema mediante encuestas basadas en el modelo TAM, evaluando utilidad y usabilidad.</li>
                </ul>
            </p>
            <p>
                <strong>Alcances:</strong> El proyecto contempla el desarrollo de una aplicacion educativa
                compatible con dispositivos de realidad virtual, con modulos para exploracion teorica,
                experimentacion virtual, evaluacion formativa, y acceso a material complementario.
                No se limita a la simulacion de un unico material, sino que incluye opciones para
                trabajar con agua, hielo seco, gases y otros compuestos, permitiendo el analisis
                de su comportamiento bajo condiciones controladas.
            </p>
        `,
        textoDocumentacion: `
            <div class="doc-tecnica">
                <div class="doc-header">
                    <h3><i class="fas fa-file-code"></i> Documentación Técnica del Sistema</h3>
                    <button class="btn-pdf" onclick="descargarPDF()"><i class="fas fa-file-pdf"></i> Descargar PDF</button>
                </div>

                <p class="doc-intro">Esta sección es de acceso exclusivo para administradores. Contiene las especificaciones del núcleo del sistema para mantenimiento y escalabilidad.</p>

                <section class="doc-section">
                    <h4>1. Arquitectura del Sistema</h4>
                    <p>El sistema sigue un modelo de arquitectura <strong>Cliente-Servidor</strong> basado en la Web. El procesamiento lógico se realiza mediante ejecutables CGI (C++) que interactúan con una base de datos relacional.</p>
                </section>

                <section class="doc-section">
                    <h4>2. Tecnologías Utilizadas (Stack)</h4>
                    <ul>
                        <li><strong>Frontend:</strong> HTML5, CSS3 (Flexbox/Grid), JavaScript Vanilla.</li>
                        <li><strong>Backend:</strong> C++ (CGI Standard) para procesamiento de alta velocidad.</li>
                        <li><strong>Base de Datos:</strong> MySQL 8.0 para persistencia de datos.</li>
                        <li><strong>Simulación:</strong> Unity 2021.3 LTS / C# (Para el entorno VR).</li>
                    </ul>
                </section>

                <section class="doc-section">
                    <h4>3. Estructura de Base de Datos</h4>
                    <p>El esquema principal incluye las siguientes tablas fundamentales:</p>
                    <table class="doc-table">
                        <tr><th>Tabla</th><th>Descripción</th></tr>
                        <tr><td>usuarios</td><td>ID, Nombre, Usuario, Password (Hash), Rol, Fecha_Registro.</td></tr>
                        <tr><td>recursos</td><td>ID, Titulo, Descripcion, Categoria, Ruta_Archivo, Autor.</td></tr>
                        <tr><td>auditoria</td><td>ID, ID_Usuario, Accion, Modulo, Timestamp.</td></tr>
                    </table>
                </section>

                <section class="doc-section">
                    <h4>4. Endpoints de API (CGI)</h4>
                    <p>Comunicación mediante parámetros URL hacia el ejecutable principal:</p>
                    <code>/cgi-bin/PaginaWebLaboratorio.exe?accion=[nombre_accion]</code>
                    <ul>
                        <li><code>listare</code>: Obtiene la lista de recursos educativos.</li>
                        <li><code>login</code>: Valida credenciales y genera token de sesión.</li>
                        <li><code>audit</code>: Registra eventos en el log del sistema.</li>
                    </ul>
                </section>

                <section class="doc-section">
                    <h4>5. Seguridad</h4>
                    <ul>
                        <li><strong>Autenticación:</strong> Gestión mediante Cookies seguras y Tokens.</li>
                        <li><strong>Autorización:</strong> Control de acceso basado en roles (RBAC) verificado en cada carga de página.</li>
                        <li><strong>Integridad:</strong> Validación de datos en el servidor para prevenir Inyección SQL.</li>
                    </ul>
                </section>
            </div>
        `,
        textoPreguntas: `
            <h3>Preguntas Frecuentes</h3>
            <p style="margin-bottom: 20px; color: gray;">Haz clic sobre una pregunta para ver la respuesta.</p>

            <div class="faq-list">
                <!-- Pregunta 1 -->
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>¿Es necesario contar con conexión a internet para utilizar el laboratorio?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Para el correcto funcionamiento del sistema es recomendable disponer de una conexión a internet estable. Esto garantiza el acceso a todos los módulos, la sincronización de datos, el registro de avances y la descarga de actualizaciones.</p>
                    </div>
                </div>

                <!-- Pregunta 2 -->
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>¿Es posible utilizar el laboratorio virtual sin visor de realidad virtual?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Sí. El sistema cuenta con un modo de visualización en pantalla que permite su uso desde un computador convencional empleando teclado y ratón. Sin embargo, la experiencia inmersiva se aprovecha plenamente con un visor compatible.</p>
                    </div>
                </div>

                <!-- Pregunta 3 -->
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>¿Existen requisitos mínimos de hardware para ejecutar la aplicación?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Se recomienda un computador con procesador de cuatro núcleos o superior, 16 GB de memoria RAM, tarjeta gráfica dedicada con al menos 4 GB de VRAM y sistema operativo Windows 10 o superior.</p>
                    </div>
                </div>

                <!-- Pregunta 4 -->
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>¿Los experimentos están limitados por tiempo?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>No existe un límite de tiempo obligatorio. Sin embargo, algunos escenarios incluyen tiempos sugeridos o cronómetros para simular condiciones reales de laboratorio y fomentar la gestión eficiente del tiempo.</p>
                    </div>
                </div>

                <!-- Pregunta 5 -->
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>¿El sistema incluye material de apoyo y guías didácticas?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Sí. El laboratorio virtual dispone de un repositorio de guías prácticas, fichas técnicas y material complementario en formato PDF que pueden ser descargados para consulta offline.</p>
                    </div>
                </div>

                <!-- Pregunta 6 -->
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>¿Recibiré actualizaciones de nuevos experimentos o mejoras?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Sí. El sistema se actualiza periódicamente para incluir nuevos experimentos, optimizar el rendimiento y ampliar las funcionalidades. Las actualizaciones se descargan automáticamente al iniciar sesión.</p>
                    </div>
                </div>

                <!-- Pregunta 7 -->
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>¿Puedo compartir mis resultados y avances con otras personas?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Sí. El sistema permite exportar reportes en PDF y compartir resultados con docentes o compañeros a través de la plataforma interna de mensajería.</p>
                    </div>
                </div>

                <!-- Pregunta 8 -->
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>¿El laboratorio virtual es útil solo para estudiantes de bachillerato?</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>No. Aunque el diseño inicial se enfoca en bachillerato, los contenidos pueden ser aprovechados en programas de educación técnica, tecnológica y en capacitaciones de nivel básico en ciencias naturales.</p>
                    </div>
                </div>
            </div>
        `,
        textoCreditos: `
            <h3>Creditos</h3>
            <p>
                Proyecto desarrollado como parte del trabajo de grado del programa Tecnologia en Sistematizacion
                de Datos de la Universidad Distrital Francisco Jose de Caldas.
            </p>
            <p>
                <strong>Equipo de desarrollo:</strong>
                <ul>
                    <li>Kevin Nicolas Bautista Torres </li>
                    <li>Santiago Felipe Buendia Castelblanco </li>
                </ul>
            </p>
            <p>
                <strong>Agradecimientos:</strong>
                <ul>
                    <li>Docentes asesores del proyecto</li>
                    <li>Instituciones educativas colaboradoras en la fase de pruebas</li>
                    <li>Comunidad de Innovacion Educativa Virtual por el apoyo pedagogico</li>
                </ul>
            </p>
        `
    };
    document.getElementById("contenido").innerHTML = textos[id] || "";
}

function toggleFaq(elemento) {
    const faqItem = elemento.parentElement;

    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) item.classList.remove('active');
    });

    faqItem.classList.toggle('active');
}

async function descargarPDF() {
    const rutaArchivo = 'docs/documentacion_tecnica.pdf';

    try {
        const respuesta = await fetch(rutaArchivo, { method: 'HEAD' });

        if (respuesta.ok) {
            const link = document.createElement('a');
            link.href = rutaArchivo;
            link.download = 'Documentacion_Tecnica_V1.pdf';
            link.click();
        } else {
            lanzarError("El archivo de documentación no se encuentra disponible en el servidor en este momento.");
        }
    } catch (error) {
        lanzarError("Error de conexión: No se pudo verificar la disponibilidad del archivo.");
    }
}

function lanzarError(mensaje) {
    const contenedor = document.getElementById("contenido");

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-notificacion";
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${mensaje}`;

    contenedor.prepend(errorDiv);

    setTimeout(() => errorDiv.remove(), 5000);
}