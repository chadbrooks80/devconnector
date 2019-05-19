const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
// this come from the module.exports = User = mongoose.model('users', UserSchema); from the USER.js
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
    // KEEP THIS CONSOLE.LOG FOR LATER TO LEARN WHAT IS GOING ON HERE
    // console.log(jwt_payload);
    User.findById(jwt_payload.id)
      .then(user => {
        if (user) {
          return done(null, user);

        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  }));
}
