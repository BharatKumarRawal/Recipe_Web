require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })); //middleware that allows to take url body data
app.use(express.static("public")); //middleware that allows to use static files //no relative path
app.use(expressLayouts); //middleware for layout

app.use(cookieParser("CookingBlogSecure"));
app.use(
  session({
    secret: "CookingBlogSeceretSession",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(fileUpload());

//ned tp set route for the layout
app.set("layout", "./layouts/main");
app.set("view engine", "ejs"); //seting up view engine

//using routes
const routes = require("./server/routes/recipeRoutes.js");
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});
