const express = require("express");
const router = express.Router();
const { ContenedorProductos } = require("../../controllers/productHandler.js");

let esAdmin = false;

function validateProduct(req, res, next) {
  const { title, description, price, img } = req.body;
  if (
    !title ||
    !description ||
    !price ||
    !img ||
    !title.trim() ||
    !img.trim()
  ) {
    res.json({ Error: "faltan datos del producto" });
  } else if (isNaN(price)) {
    res.json({ Error: "el precio debe ser de tipo numérico" });
  }
  req.title = title;
  req.description = description;
  req.price = price;
  req.img = img;
  next();
}

function soloParaAdmins(req, res, next) {
  if (esAdmin) {
    next();
  } else {
    res.sendStatus(403);
  }
}

router.get("/login", (req, res) => {
  esAdmin = true;
  res.status(200).json({ Usuario: "Admin" });
});

router.get("/logout", (req, res) => {
  esAdmin = false;
  res.status(200).json({ Usuario: "NoesAdmin" });
});

router.get("/", async (req, res) => {
  let products = await ContenedorProductos.getAllFile();
  res.json({
    data: products,
  });
});

router.get("/:id", async (req, res) => {
  let productById = await ContenedorProductos.getById(req.params.id);
  if (!productById) {
    res.status(404).json({
      error: "NOT FOUND!!! 404 producto no encontrado",
    });
  } else {
    res.json({
      data: productById,
    });
  }
});

router.post("/", soloParaAdmins, validateProduct, async (req, res) => {
  let addProduct = await ContenedorProductos.saveInFile(req.body);
  res.json({
    data: addProduct,
  });
});

router.put("/:id", soloParaAdmins, async (req, res) => {
  //USAR ADMIN
  let productById = await ContenedorProductos.getById(req.params.id);
  if (!productById) {
    res.status(404).json({
      error: "NOT FOUND!!! 404 producto no encontrado",
    });
  } else {
    let newValues = req.body;
    for (const element in productById) {
      for (const elem in newValues) {
        if (element == elem) {
          productById[element] = newValues[elem];
        }
      }
    }
    await ContenedorProductos.deleteById(req.params.id);
    await ContenedorProductos.updateFile(productById);
    res.json({
      msg: productById,
    });
  }
});

router.delete("/:id", soloParaAdmins, async (req, res) => {
  //USAR ADMIN
  let productById = await ContenedorProductos.getById(req.params.id);
  if (!productById) {
    res.status(404).json({
      error: "NOT FOUND!!! 404 producto no encontrado",
    });
  } else {
    await ContenedorProductos.deleteById(req.params.id);
    res.json({
      msg: "Se ha eliminado:",
      productById,
    });
  }
});

module.exports = router;
