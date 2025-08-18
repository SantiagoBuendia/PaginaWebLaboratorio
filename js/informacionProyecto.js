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

// Solo declara si no existe aún
if (typeof modoOscuro === 'undefined') {
    var modoOscuro = false;
}


function cambiarColor() {
    const body = document.body;
    const header = document.querySelector('.header');
    const cards = document.querySelectorAll('.card');
    const panel = document.querySelector('.panel');
    const menu = document.querySelector('.dropdown-content');
    const contenedor_principal = document.querySelector('.contenedor-principal');
    const lista_usuarios = document.querySelector('.lista-usuarios');
    const registro_usuarios = document.querySelector('.registro-usuarios');
    const form_registro = document.querySelector('#form-registro');
    const inputs = document.querySelectorAll('input, select, textarea');
    const ths = document.querySelectorAll("th");

    if (modoOscuro) {
        // Modo claro
        body.style.backgroundColor = "#ffffff";
        body.style.color = "#000000";

        if (header) header.style.backgroundColor = "#003366";
        if (panel) panel.style.backgroundColor = "transparent";
        if (contenedor_principal) contenedor_principal.style.backgroundColor = "transparent";
        if (lista_usuarios) lista_usuarios.style.backgroundColor = "transparent";
        if (registro_usuarios) registro_usuarios.style.backgroundColor = "transparent";
        if (form_registro) form_registro.style.backgroundColor = "transparent";

        inputs.forEach(input => {
            input.style.backgroundColor = "#ffffff";
            input.style.color = "#000000";
            input.style.borderColor = "#cccccc";
        });

        cards.forEach(card => {
            card.style.backgroundColor = "#ffffff";
            card.style.color = "#000000";
        });

        if (menu) {
            menu.style.backgroundColor = "#ffffff";
            menu.style.color = "#000000";
        }

        ths.forEach(th => {
            th.style.backgroundColor = "#ffffff";
            th.style.color = "#000000";
            th.style.borderColor = "#cccccc";
        });

    } else {
        // Modo oscuro
        body.style.backgroundColor = "#121212";
        body.style.color = "#ffffff";

        if (header) header.style.backgroundColor = "#003366";
        if (panel) panel.style.color = "#ffffff";
        if (contenedor_principal) contenedor_principal.style.backgroundColor = "#1e1e1e";
        if (lista_usuarios) lista_usuarios.style.backgroundColor = "#1e1e1e";
        if (registro_usuarios) registro_usuarios.style.backgroundColor = "#1e1e1e";
        if (form_registro) form_registro.style.backgroundColor = "#1e1e1e";

        inputs.forEach(input => {
            input.style.backgroundColor = "#2c2c2c";
            input.style.color = "#ffffff";
            input.style.borderColor = "#555";
        });

        cards.forEach(card => {
            card.style.backgroundColor = "#1e1e1e";
            card.style.color = "#ffffff";
        });

        if (menu) {
            menu.style.backgroundColor = "#2c2c2c";
            menu.style.color = "#ffffff";
        }

        ths.forEach(th => {
            th.style.backgroundColor = "#2c2c2c";
            th.style.color = "#ffffff";
            th.style.borderColor = "#555";
        });
    }

    modoOscuro = !modoOscuro;
}


function cambiarTexto() {
    document.getElementById("nombre-usuario").innerText = "Admin Modificado";
    document.getElementById("rol-usuario").innerText = "Super Admin";
}


// Cierra el menú si se hace clic fuera
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



//Texto de informacionProyecto

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
            <h3>Documentacion</h3>
            <p>
                La documentacion del sistema se divide en dos categorias principales: tecnica y pedagogica.
            </p>
            <p>
                <strong>Documentacion tecnica:</strong> Incluye la descripcion de la arquitectura del sistema, 
                herramientas de desarrollo empleadas, requisitos de hardware y software, diagramas de flujo, 
                modelo de base de datos, y detalles de programacion de cada modulo. Este apartado esta 
                diseñado para desarrolladores y administradores del sistema que requieran instalar, 
                mantener o ampliar las funcionalidades de la aplicacion.
            </p>
            <p>
                <strong>Documentacion pedagogica:</strong> Contiene guias para docentes y estudiantes, 
                actividades recomendadas, secuencias de aprendizaje, ejemplos de experimentos y sugerencias 
                de evaluacion. Tambien se incluyen tutoriales ilustrados y videos explicativos para facilitar 
                el uso del entorno virtual en diferentes contextos educativos.
            </p>
        `,
        textoPreguntas: `
            <h3>Preguntas Frecuentes</h3>
            <ul>
        <li>
            <strong>¿Es necesario contar con conexion a internet para utilizar el laboratorio virtual?</strong><br>
            Para el correcto funcionamiento del sistema es recomendable disponer de una conexion a internet estable.
            Esto garantiza el acceso a todos los modulos, la sincronizacion de datos, el registro de avances y la
            descarga de actualizaciones. Algunos contenidos podran ser almacenados localmente para su uso sin conexion.
        </li>
        <li>
            <strong>¿Es posible utilizar el laboratorio virtual sin visor de realidad virtual?</strong><br>
            Si. El sistema cuenta con un modo de visualizacion en pantalla que permite su uso desde un computador
            convencional empleando teclado y raton. Sin embargo, la experiencia inmersiva y la interaccion
            tridimensional se aprovechan plenamente con un visor de realidad virtual compatible.
        </li>
        <li>
            <strong>¿Existen requisitos minimos de hardware para ejecutar la aplicacion?</strong><br>
            Si. Se recomienda un computador con procesador de cuatro nucleos o superior, 16 GB de memoria RAM,
            tarjeta grafica dedicada con al menos 4 GB de VRAM y sistema operativo Windows 10 o superior.
            Para modo VR, es necesario un visor compatible con la plataforma SteamVR.
        </li>
        <li>
            <strong>¿Los experimentos estan limitados por tiempo?</strong><br>
            No existe un limite de tiempo obligatorio para completar los experimentos. Sin embargo, algunos escenarios
            incluyen tiempos sugeridos o cronometros para simular condiciones reales de laboratorio y fomentar la
            gestion eficiente del tiempo.
        </li>
        <li>
            <strong>¿El sistema incluye material de apoyo y guias didacticas?</strong><br>
            Si. El laboratorio virtual dispone de un repositorio de guias practicas, fichas tecnicas y material
            complementario en formato PDF que pueden ser descargados para consulta offline.
        </li>
        <li>
            <strong>¿Recibire actualizaciones de nuevos experimentos o mejoras?</strong><br>
            Si. El sistema se actualiza periodicamente para incluir nuevos experimentos, optimizar el rendimiento,
            mejorar la interfaz de usuario y ampliar las funcionalidades. Las actualizaciones se descargan
            automaticamente al iniciar sesion.
        </li>
        <li>
            <strong>¿Puedo compartir mis resultados y avances con otras personas?</strong><br>
            Si. El sistema permite exportar reportes en PDF y compartir resultados con docentes o compañeros a traves
            de la plataforma interna de mensajeria.
        </li>
        <li>
            <strong>¿El laboratorio virtual es util solo para estudiantes de bachillerato?</strong><br>
            No. Aunque el diseño inicial se enfoca en estudiantes de educacion media, los contenidos y experimentos
            pueden ser aprovechados en programas de educacion tecnica, tecnologica y en capacitaciones de nivel basico
            en ciencias naturales.
        </li>
    </ul>
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

