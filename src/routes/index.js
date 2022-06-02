const express = require("express");
const router = express.Router();
const productosRouter = require("./productos.js");
const carritoRouter = require("./carrito.js");

router.use("/productos", productosRouter);
router.use("/carrito", carritoRouter);

module.exports = router;
