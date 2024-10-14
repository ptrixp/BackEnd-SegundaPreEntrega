import express from "express"; 
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";


//PUERTOS
const app = express(); 
const PUERTO = 8080;

//Middleware: 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios
//Le decimos al servidor que vamos a trabajar con JSON.
app.use(express.static("./src/public"));

//Configuramos Express-Handlebars
app.engine("handlebars", engine()); 
app.set("view engine", "handlebars"); 
app.set("views", "./src/views"); 

//Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`); 
})

//Creamos la instancia de Socket.io del lado del backend. 
const io = new Server(httpServer); 

//Debo traer el array de productos: 
import ProductManager from "./managers/product-manager.js";
const manager = new ProductManager("./src/data/productos.json");

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    // Enviar la lista inicial de productos al cliente
    socket.emit("productos", await manager.getProducts());

    // Escuchar cuando un cliente agrega un producto
    socket.on("nuevoProducto", async (producto) => {
        await manager.addProduct(producto);
        const productosActualizados = await manager.getProducts();
        io.emit("productosActualizados", productosActualizados);
    });

    // Escuchar cuando un cliente elimina un producto
    socket.on("eliminarProducto", async (idProducto) => {
        await manager.deleteProduct(idProducto);
        const productosActualizados = await manager.getProducts();
        io.emit("productosActualizados", productosActualizados);
    });
});