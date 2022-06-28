const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { urlencoded } = require("express");
dotenv.config();

//設定 route
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");

//直接 require 就像是把 passport.js 寫的程式碼直接引用進來
require("./config/passport");

// const cookieSession = require("cookie-session");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

/*
    useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options.
    Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, 
    and useFindAndModify is false. Please remove these options from your code.
*/
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connected to mongoDB.");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware 加入 cookie-session 套件功能，讓 user 的瀏覽器可以儲存 Cookies
// app.use(
//   cookieSession({
//     keys: [process.env.SECRET],
//   })
// );

//ch31-13 message 設定: 改使用 express-session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//如果 server 有接收到任何 request 會經過這個 middleware，會去檢查其中有沒有 /auth，有的話就會進入 authRoute
app.use("/auth", authRoute);
//會去檢查 request url 其中有沒有 /profile，有的話就會進入 profileRoute
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
