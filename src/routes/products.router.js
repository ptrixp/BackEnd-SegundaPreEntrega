import express from "express"; 
import ProductManager from "../managers/product-manager.js";
const manager = new ProductManager("./src/data/productos.json");
const router = express.Router();

//La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit; 
        const productos = await manager.getProducts(); 

        if(limit) {
            res.json(productos.slice(0, limit)); 
        } else {
            res.json(productos); 
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

//2) La ruta GET /:pid deberá traer sólo el producto con el id proporcionado

router.get("/:pid", async (req, res) => {
    let id = req.params.pid; 

    try {
        const productoBuscado = await manager.getProductById(parseInt(id));

        if(!productoBuscado) {
            res.send("Producto no encontrado");
        } else {
            res.json(productoBuscado); 
        }
    } catch (error) {
        res.status(500).send("Error del servidor, llovera todo el fin de semana"); 
    }
})

//3) La ruta raíz POST / deberá agregar un nuevo producto

router.post("/", async (req, res) => {
    const nuevoProducto = req.body; 

    try {
        await manager.addProduct(nuevoProducto); 
        res.status(201).send("Producto agregado exitosamente");
    } catch (error) {
        res.status(500).send("Terrible error fatal, todo esta mal"); 
    }

})

//4) Actualizar! Lo pueden practicar y lo vemos en clase cualquier duda. 
router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const productoActualizado = req.body;

    try {
        await manager.updateProduct(id, productoActualizado);
        res.send("Producto actualizado exitosamente");
    } catch (error) {
        res.status(500).send("Error al actualizar el producto");
    }
});


//5) La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 

router.delete("/:pid", async (req, res) => {
    let id = req.params.pid; 

    try {
        await manager.deleteProduct(parseInt(id)); 
        res.send("Producto eliminado")
    } catch (error) {
        res.status(500).send("Error al querer borrar un producto"); 
    }
})


export default router; 