-- ===============================
-- CREACIÓN DE BASE DE DATOS
-- ===============================
CREATE DATABASE IF NOT EXISTS laboratorioquimica
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

USE laboratorioquimica;

-- ===============================
-- TABLA: usuarios
-- ===============================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  rol ENUM('profesor','estudiante','administrador') NOT NULL
);

-- ===============================
-- TABLA: grupos
-- ===============================
CREATE TABLE grupos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  profesor_id INT NOT NULL,
  FOREIGN KEY (profesor_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: grupo_estudiantes
-- ===============================
CREATE TABLE grupo_estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grupo_id INT NOT NULL,
  estudiante_id INT NOT NULL,
  UNIQUE (grupo_id, estudiante_id),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (estudiante_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: examenes
-- ===============================
CREATE TABLE examenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  grupo_id INT NOT NULL,
  profesor_id INT NOT NULL,
  instrucciones TEXT,
  intentos_permitidos INT DEFAULT 1,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (profesor_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: preguntas
-- ===============================
CREATE TABLE preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  examen_id INT NOT NULL,
  pregunta TEXT NOT NULL,
  puntos DECIMAL(5,2) DEFAULT 1.00,
  orden_pregunta INT NOT NULL,
  explicacion TEXT,
  FOREIGN KEY (examen_id) REFERENCES examenes(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: opciones_respuesta
-- ===============================
CREATE TABLE opciones_respuesta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pregunta_id INT NOT NULL,
  opcion TEXT NOT NULL,
  es_correcta TINYINT(1) DEFAULT 0,
  orden_opcion INT NOT NULL,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: intentos_examen
-- ===============================
CREATE TABLE intentos_examen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  examen_id INT NOT NULL,
  estudiante_id INT NOT NULL,
  numero_intento INT NOT NULL,
  calificacion DECIMAL(5,2) DEFAULT 0.00,
  puntos_obtenidos DECIMAL(5,2) DEFAULT 0.00,
  puntos_totales DECIMAL(5,2) DEFAULT 0.00,
  completado TINYINT(1) DEFAULT 0,
  UNIQUE (examen_id, estudiante_id, numero_intento),
  FOREIGN KEY (examen_id) REFERENCES examenes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (estudiante_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: respuestas_estudiante
-- ===============================
CREATE TABLE respuestas_estudiante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intento_id INT NOT NULL,
  pregunta_id INT NOT NULL,
  opcion_seleccionada_id INT NOT NULL,
  es_correcta TINYINT(1) DEFAULT 0,
  puntos_obtenidos DECIMAL(5,2) DEFAULT 0.00,
  FOREIGN KEY (intento_id) REFERENCES intentos_examen(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (opcion_seleccionada_id) REFERENCES opciones_respuesta(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: calificaciones
-- ===============================
CREATE TABLE calificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  examen_id INT NOT NULL,
  estudiante_id INT NOT NULL,
  mejor_intento_id INT NOT NULL,
  calificacion_final DECIMAL(5,2) NOT NULL,
  puntos_obtenidos DECIMAL(5,2) NOT NULL,
  puntos_totales DECIMAL(5,2) NOT NULL,
  porcentaje DECIMAL(5,2) NOT NULL,
  fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  comentarios TEXT,
  UNIQUE (examen_id, estudiante_id),
  FOREIGN KEY (examen_id) REFERENCES examenes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (estudiante_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (mejor_intento_id) REFERENCES intentos_examen(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: simulaciones
-- ===============================
CREATE TABLE simulaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME,
  duracion_segundos INT,
  version_simulador VARCHAR(50),
  dispositivo ENUM('PC','VR') NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: eventos_simulacion
-- ===============================
CREATE TABLE eventos_simulacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  simulacion_id INT NOT NULL,
  evento VARCHAR(255) NOT NULL,
  detalle TEXT,
  tiempo_segundos INT,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (simulacion_id) REFERENCES simulaciones(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: resultados_simulacion
-- ===============================
CREATE TABLE resultados_simulacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  simulacion_id INT NOT NULL,
  variable VARCHAR(100) NOT NULL,
  valor VARCHAR(100) NOT NULL,
  unidad VARCHAR(50),
  FOREIGN KEY (simulacion_id) REFERENCES simulaciones(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TABLA: recursos
-- ===============================
CREATE TABLE recursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255),
  descripcion TEXT,
  categoria VARCHAR(100),
  tipo VARCHAR(50),
  autor VARCHAR(100),
  palabras_clave TEXT,
  fecha DATE,
  enlace TEXT
);

-- ===============================
-- TABLA: auditoria
-- ===============================
CREATE TABLE auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  tabla_afectada VARCHAR(100),
  accion VARCHAR(50),
  descripcion TEXT,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- USUARIOS INICIALES
-- ===============================
INSERT INTO usuarios (usuario, contrasena, correo, rol) VALUES
('maria','12345','maria@colegio.com','profesor'),
('prof_carlos','12345','carlos@colegio.com','profesor'),
('alu_juan','12345','juan@colegio.com','estudiante'),
('alu_luisa','12345','luisa@colegio.com','estudiante'),
('admin24','1234','admin@colegio.com','administrador');
