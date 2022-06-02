const express = require("express");
const { CartContainer } = require("../../controllers/cartHandler.js");
const { ContenedorProductos } = require("../../controllers/productHandler.js");
const router = express.Router();

router.post("/", async (req, res) => {
  //CREA UN CARRITO Y DEVUELVE SU ID
  const cartId = await CartContainer.saveInFile();
  res.json({
    data: cartId,
  });
});

router.delete("/:id", async (req, res) => {
  //VACIA UN CARRITO Y LO ELIMINA
  await CartContainer.deleteById(req.params.id);
  res.send(console.log("Carrito Eliminado"));
});

router.get("/:id/productos", async (req, res) => {
  //Lista DE TODOS LOS PRODUCTOS DENTRO DE ESTE CARRITO
  const cart = await CartContainer.getById(req.params.id);
  res.json({ Data: cart.productos });
});

router.post("/:id/productos", async (req, res) => {
  //INCORPORAR PRODUCTOS AL CARRITO POR EL PROD.ID
  const cart = await CartContainer.getById(req.params.id);
  const product = await ContenedorProductos.getById(req.body.id);
  console.log(product);
  cart.productos.push(product);
  await CartContainer.updateFile(cart);
  res.send(console.log(`Producto agregado al carrito ${req.params.id}`));
});

router.delete("/:id/productos/:id_prod", async (req, res) => {
  //ELIMINAR UN PRODUCTO DEL CARRITO POR SU ID DE CARRITO Y ID DE PRODUCTO
  const cart = await CartContainer.getById(req.params.id);

  let newListProducts = [];
  newListProducts = cart.productos.filter(
    (product) => product.id != req.params.id_prod
  );

  cart.productos = newListProducts;

  await CartContainer.updateFile(cart);

  res.send(console.log("Producto eliminado del carrito correctamente"));
});

module.exports = router;
