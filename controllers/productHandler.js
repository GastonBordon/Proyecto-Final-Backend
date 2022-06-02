const fs = require("fs");
const path = "./dataBase/products.txt";

class ProductContainer {
  constructor(path) {
    this.path = path;
  }

  async readFile() {
    if (fs.existsSync(path)) {
      try {
        const data = await fs.promises.readFile(path, "utf-8");
        return JSON.parse(data);
      } catch (error) {
        throw new Error("Error al leer archivo");
      }
    } else {
      try {
        await fs.promises.writeFile(path, JSON.stringify([], null, 2));
        const data = await fs.promises.readFile(path, "utf-8");
        return JSON.parse(data);
      } catch (error) {
        throw new Error("Error al escribir el archivo");
      }
    }
  }

  async getAllFile() {
    try {
      const data = await this.readFile();
      return data;
    } catch (error) {
      throw new Error("Error al leer el archivo");
    }
  }
  async updateFile(product) {
    try {
      const readContent = await this.readFile();
      readContent.push(product);
      await fs.promises.writeFile(path, JSON.stringify(readContent, null, 2));
    } catch (error) {
      throw new Error("Error al escribir archivo");
    }
  }
  async saveInFile(product) {
    product.id = `${Date.now()}`;
    try {
      const readContent = await this.readFile();
      readContent.push(product);
      await fs.promises.writeFile(path, JSON.stringify(readContent, null, 2));
    } catch (error) {
      throw new Error("Error al escribir archivo");
    }
  }

  async deleteAllFile() {
    try {
      await fs.promises.writeFile(path, JSON.stringify([], null, 2));
    } catch (error) {
      throw new Error("Error al escribir archivo");
    }
  }

  async getById(id) {
    let productsArray = await this.readFile();
    const foundProduct = productsArray.find((prod) => prod.id === id);
    if (foundProduct !== undefined) {
      return foundProduct;
    } else {
      return null;
    }
  }

  async deleteById(id) {
    let productsArray = await this.readFile();
    let newProductsArray = [];
    newProductsArray = productsArray.filter((product) => product.id !== id);
    await fs.promises.writeFile(
      path,
      JSON.stringify(newProductsArray, null, 2)
    );
  }
}

const productContainer = new ProductContainer(path);

module.exports = {
  ContenedorProductos: productContainer,
};
