const passport = require('passport');
const usuarioModel = require('../modelos/usuario');

module.exports = function () {  
  passport.serializeUser((user, done)=>{
    var sessionData = {
      codigoUsuario: user._id,
      usuario: user.usuario,
      foto_perfil: user.foto_perfil,
      planActivo: user.plan_activo

    };
    done(null, sessionData);
  });

  passport.deserializeUser((sessionData, done)=>{
    usuarioModel.findById(sessionData.codigoUsuario, {contrasenia:0})
    .then(userEncontrado=>{
      done(null, userEncontrado);
    })
    .catch(error=>{
      done(error);
    });
  });

  require('./estrategias/local')();
}