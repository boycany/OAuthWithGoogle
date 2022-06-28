const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

/**
 * Three pieces need to be configured to use Passport for authentication:
 *
 * 1. Authentication strategies
 * 2. Application middleware
 * 3. Sessions (optional)
 */
passport.serializeUser((user, done) => {
  console.log("Serializing user now.");
  done(null, user._id);
  //_id 是 MongoDB 會為每一筆資料自動生成的 id
});

passport.deserializeUser((_id, done) => {
  console.log("Deseraializing user now.");
  User.findById({ _id }).then((user) => {
    console.log("Found User.");
    done(null, user);
  });
});

//Local 登入

passport.use(
  new LocalStrategy((username, password, done) => {
    //因為 local 登入表單的兩個 input 欄位取名為 username (其實是填入 email) 和 password
    console.log(username, password);
    User.findOne({ email: username })
      .then((user) => {
        console.log("user :>> ", user);
        if (!user) {
          return done(null, false);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            return done(null, false);
          }
          if (!result) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        });
      })
      .catch((err) => {
        return done(null, false);
      });
  })
);

//Google 登入
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback:
      // console.log(profile);
      User.findOne({ googleID: profile.id }).then((foundUser) => {
        //會檢查 MongoDB 有沒有這個 user data，沒有的話，就創建自己的一個 copy
        if (foundUser) {
          console.log("User already exist");
          done(null, foundUser);
        } else {
          new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.emails[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New User created.");
              done(null, newUser);
            });
        }
      });
    }
  )
);
