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

  if (emailExist) {
    req.flash("error_msg", "Email has already been registered");
    res.redirect("/auth/signup");
  } else {
    const hash = await bcrypt.hash(password, 10);
    password = hash;
    let newUser = new User({ name, email, password });
    try {
      await newUser.save();
      req.flash("success_msg", "Registration succeeds. You can login now.");
      res.redirect("/auth/login");
      // const savedUser = await newUser.save();
      // res.status(200).send({
      //   msg: "User saved.",
      //   savedObj: savedUser,
      // });
    } catch (err) {
      if (
        err.errors.name.message.substring(23) ===
        "shorter than the minimum allowed length (6)."
      ) {
        req.flash("error_msg", "使用者名稱至少需要6個字元");
      } else {
        req.flash("error_msg", err.errors.name.message);
      }
      res.redirect("/auth/signup");
    }
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

module.exports = router;
