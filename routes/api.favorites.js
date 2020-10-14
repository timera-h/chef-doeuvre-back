const router = new require("express").Router();
const FavoriteModel = require("../models/Favorite");

// lire tout les favorites
router.get("/", async (req, res, next) => {
    try {
        const favorites = await FavoriteModel.find()
        res.json(favorites)
    } catch (err) {
        next(err);
    };
});

// voir un favorite par son id
router.get("/:id", async (req, res, next) => {
  try {
    const favorite = await FavoriteModel.findById(req.params.id);
    res.json(favorite);
  } catch (err) {
    next(err);
  };
});

// créer un favorites
router.post("/", async (req, res, next) => {
    try {
      const newFavorite = await FavoriteModel.create(req.body)
      console.log(req.body)
      res.json(newFavorite)
    } catch (err) {
      next(err)
    };
  });

// delete favorites
router.delete("/:id", async (req, res, next) => {
    try {
      const deleteFavorite = await FavoriteModel.findByIdAndDelete(req.params.id);
      console.log(req.params)
      res.json(deleteFavorite)
    } catch (err) {
      next(err)
    };
  
  });

  // mettre a jours les favoris
  router.patch("/:id", async (req, res, next) => {
    try {
      const updateFavorite = await FavoriteModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      console.log(req.params)
      res.json(updateFavorite)
    } catch (err) {
      next(err);
    };
  });

// filtrer par product

// filtrer par user

module.exports = router;