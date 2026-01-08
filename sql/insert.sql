
CREATE TABLE IF NOT EXISTS "Producto" (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(15) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    bodega_id INT NOT NULL,
    sucursal_id INT NOT NULL,
    moneda_id INT NOT NULL,  
    precio NUMERIC(10, 2) NOT NULL,
    materiales TEXT, 
    descripcion TEXT
);


CREATE TABLE IF NOT EXISTS "Bodega" (id SERIAL PRIMARY KEY, nombre VARCHAR(50));
CREATE TABLE IF NOT EXISTS "Sucursal" (id SERIAL PRIMARY KEY, bodega_id INT, nombre VARCHAR(50));
CREATE TABLE IF NOT EXISTS "Moneda" (id SERIAL PRIMARY KEY, nombre VARCHAR(20));

-- Datos de ejemplo
INSERT INTO "Bodega" (nombre) VALUES ('Bodega Central'), ('Bodega Norte');
INSERT INTO "Sucursal" (bodega_id, nombre) VALUES (1, 'Sucursal 1'), (2, 'Sucursal 2');
INSERT INTO "Moneda" (nombre) VALUES ('DÓLAR'), ('EURO'), ('CLP');