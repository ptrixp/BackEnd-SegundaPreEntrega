const socket = io(); 
//La instancia de Socket.io del lado del cliente. 


//Lo que tengo que hacer es escuchar al Backend, que este me va a mandar los productos: 

socket.on("productos", (data) => {
    console.log(data); 
})

//Tienen que renderizar en pantalla estos productos. 
//1) Sumar un boton para eliminar productos. 
//2) Sumar un formulario para crear nuevos productos. 
//TODO ESTO SE TIENE QUE ACTUALIZAR EL TIEMPO REAL. 
// Elementos del DOM
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const tituloInput = document.getElementById("titulo");
const descripcionInput = document.getElementById("descripcion");
const precioInput = document.getElementById("precio");

// Escuchar la lista inicial de productos
socket.on("productos", (productos) => {
    renderizarProductos(productos);
});

// Escuchar actualizaciones en la lista de productos
socket.on("productosActualizados", (productos) => {
    renderizarProductos(productos);
});

// Función para renderizar productos en el DOM
function renderizarProductos(productos) {
    listaProductos.innerHTML = "";
    productos.forEach((producto) => {
        const item = document.createElement("div");
        item.classList.add("card");
        item.innerHTML = `
            <p><strong>Título:</strong> ${producto.title}</p>
            <p><strong>Descripción:</strong> ${producto.description}</p>
            <p><strong>Precio:</strong> $${producto.price}</p>
            <button data-id="${producto.id}" class="eliminar-btn">Eliminar</button>
        `;
        listaProductos.appendChild(item);
    });

    // Añadir event listeners a los botones de eliminar
    const botonesEliminar = document.querySelectorAll(".eliminar-btn");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const idProducto = boton.getAttribute("data-id");
            socket.emit("eliminarProducto", idProducto);
        });
    });
}

// Manejar el envío del formulario para crear un nuevo producto
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevoProducto = {
        title: tituloInput.value,
        description: descripcionInput.value,
        price: parseFloat(precioInput.value)
    };
    socket.emit("nuevoProducto", nuevoProducto);
    formulario.reset();
});