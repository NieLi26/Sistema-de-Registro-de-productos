<?php
// Configuracion de cabeceras para recibir JSON y AJAX
header('Content-Type: application/json');

// Configuracion de bd
$host = "localhost";
$port = "5432";
$dbname = "prueba_desis";
$user = "postgres";
$password = "postgres";

// Intentamos conectar
$db = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if ( !$db ) {
    echo json_encode(["status" => "error", "message" => "Error de conexión BD"]);
    exit;
}

// Obtener la accion a realizar
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Obtener datos iniciales
if ( $action == 'get_data' ) {

    $result_bodega = pg_query($db, 'SELECT * FROM "Bodega"');
    $result_moneda = pg_query($db, 'SELECT * FROM "Moneda"');

    // pg_fetch_all devuelve un array asociativo o false si está vacío
    $bodegas_fetch = pg_fetch_all($result_bodega);
    $bodegas = isset($bodegas_fetch) ? $bodegas_fetch : [];

    $monedas_fetch = pg_fetch_all($result_moneda);
    $monedas = isset($monedas_fetch) ? $monedas_fetch : [];

    echo json_encode(["bodegas" => $bodegas, "monedas" => $monedas]);
    exit;
}

// Obtener sucursales
if ( $action == 'get_sucursales' ) {

    $bodega_id = isset($_GET['bodega_id']) ? $_GET['bodega_id'] : null;

    $result = pg_query_params($db, 'SELECT * FROM "Sucursal" WHERE bodega_id = $1', [$bodega_id]);
    $fetch = pg_fetch_all($result);
    $sucursales = isset($fetch) ? $fetch : [];

    echo json_encode(["sucursales" => $sucursales]);
    exit;

}

// Guardar producto
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Recibir y limpiar datos
    $codigo = isset($_POST['codigo']) ? trim($_POST['codigo']) : '';
    $nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
    $precio = isset($_POST['precio']) ? trim($_POST['precio']) : '';
    $descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : '';
    $bodega = isset($_POST['bodega']) ? $_POST['bodega'] : null;
    $sucursal = isset($_POST['sucursal']) ? $_POST['sucursal'] : null;
    $moneda = isset($_POST['moneda']) ? $_POST['moneda'] : null;
    $materiales = isset($_POST['material']) ? implode(", ", $_POST['material']) : '';

    // Validaciones básicas de servidor
    if (!$codigo || !$nombre || !$precio || !$bodega) {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios."]);
        exit;
    }

    // Verificar duplicado
    $res_check = pg_query_params($db, 'SELECT codigo FROM "Producto" WHERE codigo = $1', [$codigo]);
    if (pg_num_rows($res_check) > 0) {
        echo json_encode(["status" => "error", "message" => "El código del producto ya existe."]);
        exit;
    }

    // Array con los valores en orden exacto
    $params = [
        $codigo, 
        $nombre, 
        $bodega, 
        $sucursal, 
        $moneda, 
        $precio, 
        $materiales, 
        $descripcion
    ];

    $query = 'INSERT INTO "Producto" (codigo, nombre, bodega_id, sucursal_id, moneda_id, precio, materiales, descripcion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

    // INSERTAR
    $result = pg_query_params($db, $query, $params);

    if ($result) {
        echo json_encode(["status" => "success", "message" => "Producto registrado correctamente."]);
    } else {
        // pg_last_error nos da el detalle del error si falla
        echo json_encode(["status" => "error", "message" => "Error al guardar: " . pg_last_error($db)]);
    }

}