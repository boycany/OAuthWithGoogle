const router = require("express").Router();

//創建一個叫 authCheck 的 Middleware
const authCheck = (req, res, next) => {
  console.log("req.user in authCheck Middleware: >>", req.user);
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  res.render("profile", { user: req.user });
});

module.exports = router;
