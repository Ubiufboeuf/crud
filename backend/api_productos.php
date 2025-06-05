<?php
require "./controlador/productos.php"; // Importar el controlador que maneja la lógica de negocio para productos

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($rq == 'OPTIONS') {
	http_response_code(200);
	exit();
}


// Obtener el método de la solicitud HTTP (GET, POST, PUT, DELETE)
$rq = $_SERVER["REQUEST_METHOD"]; // no tengo ganas de escribir requestMethod 80 veces, mejor rq
// $ru = $_SERVER['REQUEST_URI'];
// $parts = explode('/', trim($ru, '/'));

if ($rq == "GET") {
	if (isset($_GET['id'])) {
		mostrarProducto($_GET['id']); // Mostrar un producto específico
	} else {
		listarProductos(); // Listar todos los productos
	}
} elseif ($rq == "POST") {
	$data = json_decode(file_get_contents("php://input"), true);
	agregarProducto($data['nombre'], $data['descripcion'], $data['precio']);
} elseif ($rq == "PUT") {
	$data = json_decode(file_get_contents("php://input"), true);
	modificarProducto($data['id'], $data['nombre'], $data['descripcion'], $data['precio']);
} elseif ($rq == "DELETE") {
	if (isset($_GET['id'])) {
		eliminarProducto($_GET['id']);
	} else {
		echo json_encode(["error" => "Falta el parámetro id para eliminar"]);
	}
} else {
	echo json_encode(["error" => "Método no permitido"]);
}
