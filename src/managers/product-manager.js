// managers/product-manager.js
import fs from 'fs/promises';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async addProduct(producto) {
        const productos = await this.getProducts();
        producto.id = this._generateId(productos);
        productos.push(producto);
        await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
    }

    async deleteProduct(idProducto) {
        let productos = await this.getProducts();
        productos = productos.filter(prod => prod.id !== parseInt(idProducto));
        await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
    }

    _generateId(productos) {
        return productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    }
}

export default ProductManager;