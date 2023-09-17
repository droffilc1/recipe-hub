const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const recipeController = require("../controllers/recipe");
const { ensureAuth } = require("../middleware/auth");

//Main Routes
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, recipeController.getProfile);
router.get("/feed", ensureAuth, recipeController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.get("/my-recipes", ensureAuth, recipeController.getRecipes);
router.get("/favourites", ensureAuth, recipeController.getFavourites);
router.post("/signup", authController.postSignup);

module.exports = router;