const router = new require("express").Router();
const UserModel = require("./../models/User");
const auth = require("./../auth");


// lister tout les users
router.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find().populate();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// lire un user
router.get("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id).populate();
    res.json(user);
  } catch (err) {
    next(err);
  };
});




// filtrer user par produits
router.get("/findByProduct/:id", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    const filteredUser = users.filter((user) => user.products === req.params.id)
      res.json(filteredUser);
  } catch(err){
    next(err)
  }
});

// filtrer user par son adress
router.get("/findByAdress/:id", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    const filteredUser = users.filter((user) => user.adress === req.params.id)
      res.json(filteredUser);
  } catch(err){
    next(err)
  }
});


// supprimer un user par son id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleteUser = await UserModel.findByIdAndDelete(req.params.id);
    console.log(req.params)
    res.json(deleteUser)
  } catch (err) {
    next(err)
  };

});


// mettre à jour un produit
router.patch("/:id", auth.authenticate, async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    console.log(req.params)
    res.json(updateUser)
  } catch (err) {
    next(err);
  };
});


module.exports = router;