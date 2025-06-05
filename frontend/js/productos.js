const API_URL = 'http://localhost/backend_crud/api_productos.php'
const PRODUCTION = 'producción' // así no muestra información de más para el usuario común
const DEVELOPMENT = 'desarrollo' // así muestra más información

const state = PRODUCTION

const $form = document.querySelector('#formAgregarProducto')
const $submit = document.querySelector('#submit')
const $clear = document.querySelector('#clear')

const $nombre = document.querySelector('#nombreProducto')
const $descripcion = document.querySelector('#descripcionProducto')
const $precio = document.querySelector('#precioProducto')
const $msg = document.querySelector('#msg')
const $tbody = document.querySelector('#tbody')

listarProductos()

$form.addEventListener('submit', (e) => {
  e.preventDefault()

  if ($submit.textContent === 'Modificar') {
    const nombre = $nombre.value
    const descripcion = $descripcion.value
    const precio = $precio.value
    const fila = $tbody.querySelector(`tr[data-nombre="${nombre}"`)
    const id = fila.querySelector('td[data-type="id"]')
    
    modificarProducto({ id: id.textContent, nombre, descripcion, precio })
    return
  } else {
    agregarProductoDesdeFormulario()
  }

  listarProductos()
})

$clear.addEventListener('click', () => {
  $nombre.value = ''
  $descripcion.value = ''
  $precio.value = ''
  $submit.textContent = 'Agregar'
})

function showError(msg, e) {
  if (state === PRODUCTION) console.error(msg)
  else console.error(msg, e)

  return e
}

$nombre.addEventListener('input', (e) => {
  const { value } = e.currentTarget
  const nombres = $tbody.querySelectorAll('td[data-type="nombre"]')
  let producto
  ;[...nombres].forEach(p => (p.textContent === value) && (producto = p))
  
  if (producto) $submit.textContent = 'Modificar'
  else $submit.textContent = 'Agregar'
})

// Obtener todos los productos (GET)
function listarProductos() {
  fetch(API_URL)
    .catch(err => showError('Error consiguiendo los productos', err))
    .then(res => res.json())
    .then(data => {
      if (!data || !data.length) return
      mostrarProductos(data)
    })
    .catch(err => showError('Error al mostrar los productos', err))
}

function mostrarProductos(productos) {
  console.log('Productos:', productos)

  if (!Array.isArray(productos) || productos.length === 0) {
    $msg.textContent = 'No hay productos para mostrar'
    return
  }

  $msg.textContent = ''
  $tbody.innerHTML = ''

  productos.forEach(p => {
    const fila = document.createElement('tr')
    const id = document.createElement('td')
    const nombre = document.createElement('td')
    const descripcion = document.createElement('td')
    const precio = document.createElement('td')
    const acciones = document.createElement('td')
    const btnEdit = document.createElement('button')
    const btnDelete = document.createElement('button')

    id.textContent = p.id
    nombre.textContent = p.nombre
    descripcion.textContent = p.descripcion
    precio.textContent = p.precio
    btnEdit.textContent = 'Editar'
    btnDelete.textContent = 'Borrar'

    fila.dataset.nombre = p.nombre
    id.dataset.type = 'id'
    nombre.dataset.type = 'nombre'

    btnEdit.addEventListener('click', () => obtenerProducto(p.id))
    btnDelete.addEventListener('click', () => eliminarProducto(p.id))

    acciones.append(btnEdit, btnDelete)
    fila.append(id, nombre, descripcion, precio, acciones)
    $tbody.append(fila)
  })
}

// Obtener un producto (GET)
function obtenerProducto(id) {
  fetch(`${API_URL}?id=${id}`)
    .catch(err => showError('Error al conseguir el producto', err))
    .then(res => res.json())
    .then(data => {
      if (!data?.nombre || !data?.descripcion || !data?.precio) return
      console.log(data)
      actualizarInputs(data)
    })
    .catch(err => showError('Error mostrando el producto', err))
}

function actualizarInputs({ nombre, descripcion, precio }) {
  $nombre.value = nombre || ''
  $descripcion.value = descripcion || ''
  $precio.value = precio || ''

  const nombres = $tbody.querySelectorAll('td[data-type="nombre"]')
  let producto
  ;[...nombres].forEach(p => (p.textContent === $nombre.value) && (producto = p))
  
  console.log(producto)
  if (producto) $submit.textContent = 'Modificar'
  else $submit.textContent = 'Agregar'
}

// Agregar un producto (POST)
async function agregarProducto(nombre, descripcion, precio) {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion, precio })
  })
    .catch(err => showError('Error agregando el producto', err))
    .then(res => res.json())
    .then(data => console.log('Producto agregado:', data))
    .catch(err => showError('Error al agregar producto', err))
}

// Modificar un producto (PUT)
function modificarProducto({ id, nombre, descripcion, precio }) {
  console.log({ id, nombre, descripcion, precio })
  fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, nombre, descripcion, precio })
  })
    .catch(err => showError('Error al intentar modificar el producto', err))
    .then(res => res.json()) // Convierte la respuesta a JSON
    .then(data => {
      console.log('Producto modificado:', data)
      listarProductos()
    }) // Muestra el resultado en consola
    .catch(err => showError('Error al modificar producto:', err))
}

// Eliminar un producto (DELETE)
function eliminarProducto(id) {
  if (!confirm(`Seguro quieres eliminar el elemento con id ${id}?`)) return
  
  fetch(`${API_URL}?id=${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      console.log('Producto eliminado:', data)
      listarProductos()
    })
    .catch(err => showError('Error al eliminar producto:', err))
}

// Ejemplos de uso
// listarProductos()
// mostrarProducto(1)
// agregarProducto('Producto X', 'Descripción X', 99.99)
// modificarProducto(1, 'Nuevo nombre', 'Nueva descripción', 123.45)
// eliminarProducto(1)

// Función para agregar producto desde el formulario
async function agregarProductoDesdeFormulario () {
  await agregarProducto($nombre.value, $descripcion.value, Number($precio.value))

  $nombre.value = ''
  $descripcion.value = ''
  $precio.value = ''

  listarProductos()
}