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
      usuarioModel.findOne({usuario: username}, {contrasenia:0}, function(err, usuarioEncontrado){
        if(err){
          return done(err);
        }
        if(!usuarioEncontrado || usuarioEncontrado === null){
          return done(null, false, message = 'Usuario desconocido.');
        }
        
        usuarioEncontrado.compararContrasenia(password, (sonIguales)=>{
          if(!sonIguales){
            return done(null, false, message = 'Contraseña Incorrecta.');
          }
          
          return done(null, usuarioEncontrado, message = 'Inicio de sesión exitoso.');
        })
    });
    }
  )
)};