const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user-model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback:
      console.log(profile);
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
