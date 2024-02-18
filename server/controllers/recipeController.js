require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/* 

GET
Home Page
*/
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber); //sorting to display latest added recipes
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const indian = await Recipe.find({ category: "Indian" }).limit(limitNumber);
    const spanish = await Recipe.find({ category: "Spanish" }).limit(
      limitNumber
    );
    const food = { latest, thai, american, indian, spanish };
    res.render("index", { title: "Cooking Blog - Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

//GET
//Categories page

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render("categories", { title: "Cooking Blog - Home", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

//GET /recipe/:id
//Recipe

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById({ _id: recipeId });
    res.render("recipe", { title: "Cooking Blog - Home", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

//GET /categoires/:id
//categories

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    let limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    console.log(categoryById);
    res.render("categories", { title: "Cooking Blog - Home", categoryById });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occured" });
  }
};

//POST /search
//search

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    }); //refer to recipe model
    res.render("search", { title: "Cooking Blog - Search", recipe });
  } catch (error) {}
};

//Get /explore-latest
//explore-latest
exports.exploreLatest = async (req, res) => {
  try {
    let limitNumber = 10;

    const latestRecipe = await Recipe.find({})
      .sort({ _id: -1 })
      .limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking Blog : Node Js",
      latestRecipe,
    });
  } catch (error) {}
};

//Get // Submit Recipe

exports.submitRecipe = async (req, res) => {
  try {
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");
    res.render("submit-recipe", {
      title: "Cooking Blog: NodeJs",
      infoErrorsObj,
      infoSubmitObj,
    });
  } catch (error) {}
};

//Post ?submit Recipe
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    if ( !req.files || Object.keys(req.files).length === 0) {
      console.log("No Files were uploaded");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();
    req.flash("infoSubmit", "Recipe has been added");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

//

// async function insertDummyCategoryData() {
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image":"thai-food.jpg"

//       },
//       {
//         "name": "American",
//         "image":"american-food.jpg"

//       },
//       {
//         "name": "Chinese",
//         "image":"chinese-food.jpg"

//       },
//       {
//         "name": "Mexican",
//         "image":"mexican-food.jpg"

//       },
//       {
//         "name": "Indian",
//         "image":"indian-food.jpg"

//       },
//       {
//         "name": "Spanish",
//         "image":"spanish-food.jpg"

//       },
//     ]

//     );
//   } catch (e) {
//     console.log(e);
//   }
// }
// insertDummyCategoryData()

// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
