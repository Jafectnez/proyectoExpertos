const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const usuarioModel = require('../../modelos/usuario');

module.exports = function () {  
  passport.use('facebook', new FacebookStrategy({
      clientID: '829750264072274',
      clientSecret: 'b224eaeae16938680cbc949f8ab30612',
      callbackURL: "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      usuarioModel.find({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ))
};