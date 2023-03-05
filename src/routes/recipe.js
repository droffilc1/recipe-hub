const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const recipeController = require("../controllers/recipe");
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, recipeController.getRecipe);

router.post("/createRecipe", upload.single("file"), recipeController.createRecipe);

router.put("/likeRecipe/:id", recipeController.likeRecipe);

router.put("/favouriteRecipe/:id", recipeController.favouriteRecipe)

router.delete("/deleteRecipe/:id", recipeController.deleteRecipe);

module.exports = router;