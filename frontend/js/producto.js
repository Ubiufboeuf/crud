// URL base del endpoint
const API_URL = "http://localhost/backend_crud/api_productos.php"; // Cambia esta URL según corresponda

// listarProductos()

// Obtener todos los productos (GET)
function listarProductos() {
  fetch(API_URL)
    .then(res => res.json()) // Convierte la respuesta a JSON
    .then(data => {
      console.log("Productos:", data); // Muestra los productos en consola
      mostrarProductos(data); // Llama a la función para mostrar la tabla en el HTML
    })
    .catch(err => console.error("Error al obtener productos:", err));
}

// Función para mostrar la tabla de productos en el div 'productosContainer'
function mostrarProductos(productos) {
  const container = document.getElementById('productosContainer');
  if (!Array.isArray(productos) || productos.length === 0) {
    container.innerHTML = '<p>No hay productos para mostrar.</p>';
    return;
  }
  let html = '<table border="1" cellpadding="5"><thead><tr>';
  html += '<th>ID</th><th>Nombre</th><th>Descripción</th><th>Precio</th></tr></thead><tbody>';
  productos.forEach(p => {
    html += `<tr><td>${p.id}</td><td>${p.nombre}</td><td>${p.descripcion}</td><td>${p.precio}</td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

// Obtener un producto por ID (GET)
function obtenerProducto(id) {
  fetch(`${API_URL}/id/${id}`)
    .then(res => res.json()) // Convierte la respuesta a JSON
    .then(data => console.log("Producto:", data)) // Muestra el producto en consola
    .catch(err => console.error("Error al obtener producto:", err));
}

// Agregar un producto nuevo (POST)
function agregarProducto(nombre, descripcion, precio) {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, descripcion, precio })
  })
    .then(res => res.json()) // Convierte la respuesta a JSON
    .then(data => console.log("Producto agregado:", data)) // Muestra el resultado en consola
    .catch(err => console.error("Error al agregar producto:", err));
}

// Modificar un producto (PUT)
function modificarProducto(id, nombre, descripcion, precio) {
  fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, nombre, descripcion, precio })
  })
    .then(res => res.json()) // Convierte la respuesta a JSON
    .then(data => console.log("Producto modificado:", data)) // Muestra el resultado en consola
    .catch(err => console.error("Error al modificar producto:", err));
}

// Eliminar un producto (DELETE)
function eliminarProducto(id) {
  fetch(`${API_URL}/id/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json()) // Convierte la respuesta a JSON
    .then(data => console.log("Producto eliminado:", data)) // Muestra el resultado en consola
    .catch(err => console.error("Error al eliminar producto:", err));
}

// Ejemplos de uso
// listarProductos();
// mostrarProducto(1);
// agregarProducto("Producto X", "Descripción X", 99.99);
// modificarProducto(1, "Nuevo nombre", "Nueva descripción", 123.45);
// eliminarProducto(1);

// Función para agregar producto desde el formulario
function agregarProductoDesdeFormulario () {
  let nombre = document.getElementById('nombreProducto').value;
  let descripcion = document.getElementById('descripcionProducto').value;
  let precio = parseFloat(document.getElementById('precioProducto').value);
  agregarProducto(nombre, descripcion, precio);
}