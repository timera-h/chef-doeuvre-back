const router = new require("express").Router();
const CategoryModel = require("./../models/Category");

// lire toutes les ctagéories
router.get("/", async (req, res, next) => {
    try {
       const categories = await CategoryModel.find();
        res.json(categories)
    } catch (err) {
        next(err)
    };
});

// lire une catégorie par son id
router.get("/:id", async (req, res, next) => {
    try {
      const product = await CategoryModel.findById(req.params.id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  });
  

// créer une nouvelle catégorie
router.post("/", async (req, res, next) => {
  const category = req.body;
    try {
       const newCategory = await CategoryModel.create(category);
        res.json(newCategory)
    } catch (err) {
        next(err)
    };
});

// suprimer une catégorie
router.delete("/:id", async (req, res, next) => {
    try {
        const categories = await CategoryModel.findByIdAndDelete(req.params.id);
        res.json(categories);
    } catch(err) {
        next(err)
    };
  });


module.exports = router;