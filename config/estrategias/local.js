const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usuarioModel = require('../../modelos/usuario');
const bcrypt = require('bcrypt-nodejs');

module.exports = function () {  
  passport.use('local', new LocalStrategy(
   {usernameField: "usuario", 
    passwordField:"contrasenia", 
    passReqToCallback : true},
    (req, username, password, done)=>{
      usuarioModel.findOne({usuario: username}, function(err, usuarioEncontrado){
        if(err){
          return done(err);
        }
        if(!usuarioEncontrado){
          return done(null, false, message = 'Usuario desconocido.');
        }
        bcrypt.compare(password, usuarioEncontrado.contrasenia, (err, sonIguales)=>{
          if(err){
            console.log(err);
            return cb(err);
          }
          if(!sonIguales){
            return done(null, false, message = 'Contraseña Incorrecta.');
          }else{
            return done(null, usuarioEncontrado, message = 'Inicio de sesión exitoso.');
          }
        })
      });
    }
  )
)};