const router = require("express").Router();
const Post = require("../models/post-model");

//創建一個叫 authCheck 的 Middleware
const authCheck = (req, res, next) => {
  console.log("req.user in authCheck Middleware: >>", req.user);
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, async (req, res) => {
  let postFound = await Post.find({ author: req.user._id });
  res.render("profile", { user: req.user, posts: postFound });
});

router.get("/post", authCheck, (req, res) => {
  res.render("post", { user: req.user });
});

router.post("/post", authCheck, async (req, res) => {
  let { title, content } = req.body; //title 和 content 會是表單裡 使用者填入那兩個 input 的 name
  let newPost = new Post({ title, content, author: req.user._id });
  try {
    await newPost.save();
    res.status(200).redirect("/profile");
  } catch (err) {
    req.flash("error_msg", "Both title and content are required.");
    res.redirect("/profile/post");
  }
});

module.exports = router;
