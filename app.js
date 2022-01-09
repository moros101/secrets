require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

console.log(process.env.API_KEY);

//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
const User = new mongoose.model("user", userSchema);

app.get("/", function (req, res) {
  // console.log(1);
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/submit", function (req, res) {
  res.render("submit");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.email,
      // password: md5(req.body.password),
      password: hash,
    });

    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

  // console.log(newUser);

  // console.log(newUser);
});

app.post("/login", function (req, res) {
  const user = req.body.username;
  // const pass = md5(req.body.password);
  const pass = req.body.password;

  User.findOne({ email: user }, function (err, foundUser) {
    if (err) console.log(err);
    else {
      if (foundUser) {
        // if (foundUser.password === pass){
        //   res.render("secrets");
        // }
        bcrypt.compare(pass, foundUser.password, function (err, result) {
          // result == true
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});
// app.post("/submit",function(req,res){
//   const secret = req.body.secret;

// })
app.listen(3000, function () {
  console.log("http://localhost:3000");
});
