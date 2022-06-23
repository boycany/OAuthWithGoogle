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

//如果 server 有接收到任何 request 會經過這個 middleware，會去檢查其中有沒有 /auth，有的話就會進入 authRoute
app.use("/auth", authRoute);

app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
