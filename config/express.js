const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
const passport = require("passport");
const carpetasRouter = require('../routers/carpetas-router');
const proyectosRouter = require('../routers/proyectos-router');
const archivosRouter = require('../routers/archivos-router');
const usuario = require("../modelos/usuario");

module.exports = function () {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));

  app.use(session({secret :"%^zaden$%",
                  resave: true,
                  saveUninitialized: true,
                  store: new MongoStore({
                      url: "mongodb://zaden:zaden_Z9@ds115971.mlab.com:15971/heroku_d2srm201",
                      autoReconnect: true
                  })
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static("public"));
  const logeado = express.static("logeado");
  
  app.use("/carpetas", carpetasRouter);
  app.use("/proyectos", proyectosRouter);
  app.use("/archivos", archivosRouter);

  app.use(
      function(req, res, next){
          if (req.user){
              logeado(req, res, next);
          }
          else{
              return next();
          }
      }
  );

  app.get('/', (req, res)=>{
      res.redirect('/index.html');
  })

  app.get('/usuarioInfo', (req, res)=>{
      res.json(req.user);
  })

  /*Acciones del usuario*/
  app.post('/registrar', function (req, res) {  
      var usuarioNuevo = new usuario({
          nombre : req.body.nombreUsuario,
          apellido : req.body.apellidoUsuario,
          genero : req.body.generoUsuario,
          correo : req.body.correoUsuario,
          usuario : req.body.nickUsuario,
          amigos: [],
          contrasenia : req.body.contraseniaUsuario,
          foto_perfil: "img/Logo-GEPO-page.svg",
          residencia : req.body.residenciaUsuario,
          plan_activo: mongoose.Types.ObjectId("5cc77af9fb6fc00ed59db713"),
          proveedor: "local"
      });

      usuario.findOne({correo: req.body.correoUsuario}, (err, usuarioEncontrado)=>{
          if(usuarioEncontrado){
              res.send({status:0,mensaje:'El correo ya está registrado.'});
          }else{
              usuario.findOne({usuario: req.body.nickUsuario}, (err, usuarioEncontrado)=>{
                  if(usuarioEncontrado){
                      res.send({status:0,mensaje:'El usuario ya está en uso.'});
                  }else{
                      usuarioNuevo.save()
                      .then(obj=>{
                          respuesta={status:1,mensaje: `Se registró exitosamente, se le redireccionará al inicio de sesion en unos segundos`, objeto: obj};
                          res.send(respuesta);
                      })
                      .catch(error=>{
                          respuesta={status:0,mensaje: `Ocurrio un error, intente nuevamente.`, objeto: error};
                          res.send(respuesta);
                      });
                  }
              })
          }
      });
  });

  app.post("/login", function (req, res, next) {
    passport.authenticate('local', {passReqToCallback: true}, function (err, user, mensaje) { 
        var respuesta = {};
        if(err){
            respuesta = {status:0, mensaje: 'Ocurrió un error interno', objeto: err};
            res.send(respuesta);
        }
        else if(!user){
            respuesta = {status:0, mensaje: mensaje, objeto: user};
            res.send(respuesta);
        }
        else{
            req.logIn(user, function (err) {  
                if(err){
                    respuesta = {status:0, mensaje: 'Ocurrió un error al iniciar la sesión.', objeto: err};
                    res.send(respuesta);
                }
                else{
                    respuesta = {status:1, mensaje: 'Inicio de sesión exitoso.', objeto: user};
                    res.send(respuesta);
                }
            });
        }
        })(req, res, next);
  });

  app.get('/logout', function(req,res){
      req.logOut();
      res.redirect("/login.html");
  });

  app.get('/datos-usuario', autenticacion, function (req, res) {  
      respuesta = {
          usuario: req.user.usuario,
          foto_perfil: req.user.foto_perfil
      }
      res.send(respuesta);
  });

  app.get("/perfil-usuario", autenticacion, function (req, res) {
      usuario.find({
          _id: mongoose.Types.ObjectId(req.user._id)
      })
      .then(data=>{
          respuesta={status:1, mensaje: `Datos del usuario`, datos: data};
          res.send(respuesta);
      })
      .catch(error=>{
          respuesta={status:0, mensaje: `Ocurrió un error interno, intente nuevamente.`, objeto: error};
          res.send(respuesta);
      });
  });

  app.post("/actualizar-perfil", autenticacion, function (req, res) {  
      usuario.findOne({
          _id: mongoose.Types.ObjectId(req.user._id)
      })
      .then(user=>{
          user.usuario = req.body.usuario;
          user.contrasenia = req.body.contrasenia;
          user.correo = req.body.correo;
          user.nombre = req.body.nombre;
          user.apellido = req.body.apellido;
          user.residencia = req.body.residencia;
          user.genero = req.body.genero;
          user.save()
          .then(()=>{
              respuesta = {status:1, mensaje: "Cambios guardados", datos:user};
              res.send(respuesta);
          })
          .catch(error=>{
              respuesta = {status:0, mensaje: "Ocurrió un error interno"};
              res.send(respuesta);
          });
      })
      .catch(error=>{
          respuesta = {status:0, mensaje: "Ocurrió un error interno"};
          res.send(respuesta);
      });
  });

  app.get("/cambiar-plan/:idPlan", autenticacion, function (req, res) {  
      usuario.findOne({
          _id: mongoose.Types.ObjectId(req.user._id)
      })
      .then(user=>{
          user.plan_activo = mongoose.Types.ObjectId(req.params.idPlan)
          user.save()
          .then(()=>{
              respuesta = {status:1, mensaje: "Plan actualizado", datos:user};
              res.send(respuesta);
          })
          .catch(error=>{
              respuesta = {status:0, mensaje: "Ocurrió un error interno"};
              res.send(respuesta);
          });
      })
      .catch(error=>{
          respuesta = {status:0, mensaje: "Ocurrió un error interno"};
          res.send(respuesta);
      });
  });
  /*Fin acciones del Usuario*/

  /*Acciones entre Usuarios*/
  app.get("/amigos", autenticacion, function (req, res) {
      usuario.aggregate([
          {
              $lookup:{
                  from: "usuarios",
                  localField: "amigos",
                  foreignField: "_id",
                  as: "amigos"
              }
          },
          {
              $match:{
                  _id: mongoose.Types.ObjectId(req.user._id)
              }
          },
          {
              $project:{"amigos":{
                          "_id":1, 
                          "nombre":1, 
                          "apellido":1,
                          "correo":1,
                          "usuario":1,
                          "foto_perfil":1,
                      }}
          }
      ])
      .then(data=>{
          respuesta = {status:1, mensaje: "Listado de amigos", datos:data};
          res.send(respuesta);
      })
      .catch(error=>{
          respuesta = {status:0, mensaje: "Ocurrió un error interno"};
          res.send(respuesta);
      });
  });

  app.get("/amigos/buscar/:cadena", autenticacion, function (req, res) {  
      usuario.find({
          usuario: {$regex: req.params.cadena}
      })
      .then(data=>{
          respuesta = {status:1, mensaje: "Listado de usuarios", datos:data};
          res.send(respuesta);
      })
      .catch(error=>{
          respuesta = {status:0, mensaje: "Ocurrió un error interno"};
          res.send(respuesta);
      });
  });

  app.get("/amigos/:idUsuario/agregar", autenticacion, function (req, res) {  
      usuario.findOneAndUpdate(
          {
              _id: mongoose.Types.ObjectId(req.user._id)
          },
          {
              $push:{
                  amigos: mongoose.Types.ObjectId(req.params.idUsuario)
              }
          }
      )
      .then(data=>{
          usuario.findOneAndUpdate(
              {
                  _id: mongoose.Types.ObjectId(req.params.idUsuario)
              },
              {
                  $push:{
                      amigos: mongoose.Types.ObjectId(req.user._id)
                  } 
              }
          )
          .then(data=>{
              respuesta = {status:1, mensaje: "Amigo agregado", datos:data};
              res.send(respuesta); 
          })
          .catch(error=>{
              respuesta = {status:0, mensaje: "Ocurrió un error interno"};
              res.send(respuesta);
          });
      })
      .catch(error=>{
          respuesta = {status:0, mensaje: "Ocurrió un error interno"};
          res.send(respuesta);
      });
  });

  app.get("/amigos/:idAmigo/eliminar", autenticacion, function (req, res) {
      usuario.find(
          {
              _id: mongoose.Types.ObjectId(req.user._id)
          }
      )
      .then(data=>{
          data[0].amigos.pull(mongoose.Types.ObjectId(req.params.idAmigo));

          data[0].save()
          .then(data1=>{
              usuario.find(
                  {
                      _id: mongoose.Types.ObjectId(req.params.idAmigo)
                  }
              )
              .then(data2=>{
                  data2[0].amigos.pull(mongoose.Types.ObjectId(req.user._id));
          
                  data2[0].save()
                  .then(amigoEliminado=>{
                      respuesta = {status:1, mensaje: "Amigo eliminado", datos:amigoEliminado};
                      res.send(respuesta);
                  })
                  .catch(error=>{
                      respuesta = {status:0, mensaje: "Ocurrió un error interno"};
                      res.send(respuesta);
                  });
              })
              .catch(error=>{
                  respuesta = {status:0, mensaje: "Ocurrió un error interno"};
                  res.send(respuesta);
              });
          })
          .catch(error=>{
              respuesta = {status:0, mensaje: "Ocurrió un error interno"};
              res.send(respuesta);
          });
      })
      .catch(error=>{
          respuesta = {status:0, mensaje: "Ocurrió un error interno"};
          res.send(respuesta);
      });
  });
  /*Fin acciones entre Usuarios*/

  /*Verificaciones de acceso*/
  app.get('/seccion-principal.html', autenticacion, function (res, req, next) {  
      res.redirect('/seccion-principal.html');
  });

  app.get('/seccion-proyectos.html', autenticacion, function (res, req, next) {  
      res.redirect('/seccion-proyectos.html');
  });

  app.get('/seccion-compartida.html', autenticacion, function (res, req, next) {  
      res.redirect('/seccion-compartida.html');
  });

  app.get('/seccion-archivos.html', autenticacion, function (res, req, next) {  
      res.redirect('/seccion-archivos.html');
  });

  app.get('/editor.html', autenticacion, function (res, req, next) {  
      res.redirect('/editor.html');
  });

  app.get('/perfil.html', autenticacion, function (res, req, next) {  
      res.redirect('/perfil.html');
  });

  app.get('/amigos.html', autenticacion, function (res, req, next) {  
      res.redirect('/menu-principal.html');
  });

  function autenticacion(req, res, next) {
      if(req.user){
          return next();
      }else{
          res.redirect("/acceso-denegado.html");
      }
  }
  /*Fin Verificaciones de Acceso*/

  app.use(function (req, res) {
      res.statusCode = 404;
      res.redirect('/no-encontrado.html');
  });

  return app;
}