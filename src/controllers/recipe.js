const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const User = require("../models/User")

module.exports = {
  getProfile: async (req, res) => {
    try {
      const recipes = await Recipe.find({ user: req.user.id });
      res.render("profile.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.find({ user: req.user.id });
      res.render("my-recipes.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFavourites: async (req, res) => {
    try {
      const recipes = await Recipe.find({ user: req.user.id });
      res.render("favourites.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req,res)=>{
    try{
      const recipes = await Recipe.find()
      .sort({ createdAt: 'desc' })
      .lean()
      var users = []
      for(i in recipes){
        var user = await User.findById(recipes[i].user)
        users.push(user.userName)
    }
      res.render('feed.ejs', {recipes: recipes, userName: users,user: req.user})
    }catch(err){
      console.log(err)
    }
  },
  getRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      res.render("recipe.ejs", { recipe: recipe, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Recipe.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients.trim().split('\n'),
        directions: req.body.directions.trim().split('\n'),
        likes: 0,
        user: req.user.id,
      });
      console.log("Recipe has been added!");
      res.redirect("/my-recipes");
    } catch (err) {
      console.log(err);
    }
  },
  likeRecipe: async (req, res)=>{
    let liked = false
    try{
      const recipe = await Recipe.findById({_id:req.params.id})
      liked = (recipe.likes.includes(req.user.id))
    } catch(err){
    }

    if(liked){
      try{
        await Recipe.findOneAndUpdate({_id:req.params.id},
          {
            $pull : {'likes' : req.user.id}
          })

          console.log('Removed user from likes array')
          res.redirect('back')
        }catch(err){
          console.log(err)
        }
      }
      else{
        try{
          await Recipe.findOneAndUpdate({_id:req.params.id},
            {
              $addToSet : {'likes' : req.user.id}
            })
            console.log('Added user to likes array')
            res.redirect(`back`)
        }catch(err){
            console.log(err)
        }
      }
    },
    favouriteRecipe: async (req, res)=>{
      let bookmarked = false
      try{
        const recipe = await Recipe.findById({_id:req.params.id})
        bookmarked = (recipe.bookmarks.includes(req.user.id))
      } catch(err){
      }
      if(bookmarked){
        try{
          await Recipe.findOneAndUpdate({_id:req.params.id},
            {
              $pull : {'favourites' : req.user.id}
            })
            console.log('Removed user from favourites array')
            res.redirect('back')
          }catch(err){
            console.log(err)
          }
        }
        else{
          try{
            await Recipe.findOneAndUpdate({_id:req.params.id},
              {
                $addToSet : {'favourites' : req.user.id}
              })
              console.log('Added user to favourites array')
              res.redirect(`back`)
          }catch(err){
              console.log(err)
          }
        }
      },
  deleteRecipe: async (req, res) => {
    try {
      let recipe = await Recipe.findById({ _id: req.params.id });

      await cloudinary.uploader.destroy(recipe.cloudinaryId);

      await Recipe.remove({ _id: req.params.id });
      console.log("Deleted Recipe");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};