const BearerStrategy = require("passport-http-bearer").Strategy;
const User = require("../Models/register"); // Remplacez ceci par le chemin de votre modèle utilisateur
const passport = require("passport");

passport.use(
  new BearerStrategy(function (token, done) {
    User.findOne({ token: token })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  })
);

module.exports = BearerStrategy;
