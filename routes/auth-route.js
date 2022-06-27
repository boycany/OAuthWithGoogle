const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

router.post("/signup", async (req, res) => {
  // console.log(req.body);
  // res.send("Thanks for posting");
  let { name, email, password } = req.body;
  const emailExist = await User.findOne({ email });
  if (emailExist) return res.status(400).send("Email already exist");

  const hash = await bcrypt.hash(password, 10);
  password = hash;
  let newUser = new User({ name, email, password });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "User saved.",
      savedObj: savedUser,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

module.exports = router;
