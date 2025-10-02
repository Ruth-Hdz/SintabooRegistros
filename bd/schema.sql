-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tiendassintaboo;
USE tiendassintaboo;

-- Crear la tabla de registros de tiendas
CREATE TABLE IF NOT EXISTS registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- Datos del dueño
  nombre_completo VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  telefono VARCHAR(50),

  -- Datos de la tienda
  nombre_tienda VARCHAR(255) NOT NULL,
  logo VARCHAR(255),                -- Guardamos la ruta/nombre del archivo
  descripcion TEXT,

  -- Ubicación y contacto
  direccion VARCHAR(255),
  ciudad_estado VARCHAR(255),
  whatsapp VARCHAR(50),
  redes JSON,                       -- Para guardar varias redes en formato JSON

  -- Plan y configuración
  plan ENUM('basico','premium') NOT NULL,  -- Solo permite esos valores
  metodos_pago JSON,                -- Checkbox → se guarda como array JSON
  envio JSON,                       -- Checkbox → se guarda como array JSON

  -- Fechas
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
