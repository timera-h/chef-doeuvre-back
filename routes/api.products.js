const router = new require("express").Router();
const ProductModel = require("./../models/Product");
const CategoryModel = require("./../models/Category");
const uploader = require("./../config/cloudinary");


// /api/products/
router.get("/", async (req, res, next) => {
  let query = {};
  if (req.query.cat !== "all") {
    const regex = new RegExp(req.query.cat, 'i');
    query = {
      name: {
        '$regex': regex
      }
    }
  }

  const idCat = await CategoryModel.find(query);
  // console.log("idCat");
  // console.log(idCat);
  try {
    const products = await ProductModel.find({
      category: idCat
    }).sort({
      _id: -1
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// trier par le prix ascendant et descendant
router.get("/sort-by-price", async (req, res, next) => {
  console.log(req.query);
  try {
    if (!req.query.sort) throw new Error("Missing sort query parameter")
    const products = await ProductModel.find().populate("category").sort({
      price: req.query.sort === "asc" ? 1 : -1
    });
    res.json(products)
  } catch (err) {
    next(err);
  };
});

// /api/products/un-id-mongo
router.get("/:id", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate("category");
    console.log(product)
    res.json(product);
  } catch (err) {
    next(err);
  };
});

// créer un produit
router.post("/", uploader.single("image"), async (req, res, next) => {
  const product = req.body;
  if (req.file) product.image = req.file.path;
  try {
    const newProduct = await ProductModel.create(product)
    console.log(req.body)
    res.json(newProduct)
  } catch (err) {
    console.log(err)
    next(err)
  };
});

// supprimer un produit par son id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleteProduct = await ProductModel.findByIdAndDelete(req.params.id);
    console.log(req.params)
    res.json(deleteProduct)
  } catch (err) {
    next(err)
  };

});

// mettre à jour un produit
router.patch("/:id", async (req, res, next) => {
  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    console.log(req.params)
    res.json(updateProduct)
  } catch (err) {
    next(err);
  };
});


// filtrer par categorie
router.get("/findByCategory/:id", async (req, res, next) => {
  try {
    const products = await ProductModel.find().populate();
    const filteredProducts = products.filter((product) => product.category === req.params.id)
    res.json(filteredProducts);
  } catch (err) {
    next(err)
  }
})



module.exports = router;