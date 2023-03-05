const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },  
  ingredients: {
    type: [String],
    require: true,
  },
  directions: {
    type: [String],
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  likes: {
    type: Array,
    required: true,
  },
  favourites: {
    type: Array,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);