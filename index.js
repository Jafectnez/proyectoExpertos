var express = require("express");
var bodyParser = require("body-parser");
var database = require("./modulos/database");
var carpetasRouter = require('./routers/carpetas-router');
var proyectosRouter = require('./routers/proyectos-router');
var archivosRouter = require('./routers/archivos-router');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var usuario = require("./modelos/usuario");
var mongoose = require("mongoose");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/carpetas", carpetasRouter);
app.use("/proyectos", proyectosRouter);
app.use("/archivos", archivosRouter);
app.use(cookieParser());
app.use(session({secret:"%^cliente$%", resave: true, saveUninitialized:true}));
app.use(express.static("public"))
var logeado = express.static("logeado");

app.use(
    function(req,res,next){
        if (req.session.usuario){
            logeado(req, res, next);
        }
        else{
            return next();
        }
    }
);

app.post("/login", function(req, res){
    usuario.find({usuario:req.body.usuario, contrasenia:req.body.contrasenia})
    .then(data=>{
        if (data.length==1){
            req.session.codigoUsuario = data[0]._id;
            req.session.usuario =  data[0].usuario;
            req.session.foto_perfil = data[0].foto_perfil;
            res.send({status:1,mensaje:"Usuario autenticado con éxito", usuario:data[0]});
        }else{
            res.send({status:0,mensaje:"Datos inválidos, verifique e intente nuevamente"});
        }
        
    })
    .catch(error=>{
        res.send(error);
    });
});

app.get('/logout',function(req,res){
    req.session.destroy();
    res.redirect("/");
});

app.get('/datos-usuario', function (req, res) {  
    respuesta = {
        usuario: req.session.usuario
    }
    res.send(respuesta);
});

app.post('/registrar', function (req, res) {  
    var usuarioNuevo = new usuario({
        nombre : req.body.nombreUsuario,
        apellido : req.body.apellidoUsuario,
        genero : req.body.generoUsuario,
        correo : req.body.correoUsuario,
        usuario : req.body.nickUsuario,
        contrasenia : req.body.contraseniaUsuario,
        residencia : req.body.residenciaUsuario,
        plan_activo: mongoose.Types.ObjectId("5cc24235f3850afaa3ae6dfd")
    });

    usuarioNuevo.save()
    .then(obj=>{
        respuesta={status:1,mensaje: `Se registró exitosamente, se le redireccionará al inicio de sesion en unos segundos`, objeto: obj};
        console.log(obj);
        res.send(respuesta);
    })
    .catch(error=>{
        respuesta={status:0,mensaje: `Ocurrio un error, intente nuevamente.`, objeto: error};
        res.send(respuesta);
    });
});

//Verificaciones de acceso
app.get('/seccion-principal.html', verificarAutenticacion, function (res, req, next) {  
    res.redirect('/seccion-principal.html');
});

app.get('/seccion-proyectos.html', verificarAutenticacion, function (res, req, next) {  
    res.redirect('/seccion-proyectos.html');
});

app.get('/seccion-compartida.html', verificarAutenticacion, function (res, req, next) {  
    res.redirect('/seccion-compartida.html');
});

app.get('/seccion-archivos.html', verificarAutenticacion, function (res, req, next) {  
    res.redirect('/seccion-archivos.html');
});

app.get('/editor.html', verificarAutenticacion, function (res, req, next) {  
    res.redirect('/editor.html');
});

app.get('/perfil.html', verificarAutenticacion, function (res, req, next) {  
    res.redirect('/perfil.html');
});

app.get('/ejemplo.html', verificarAutenticacion, function (res, req, next) {  
    res.redirect('/menu-principal.html');
});

function verificarAutenticacion(req, res, next) {
    if (req.session.usuario){
        return next();
    }
    else{
        res.redirect('/acceso-denegado.html');
    }
}
//Fin Verificaciones de Acceso

app.listen(3333, function(){
    console.log("Servidor levantado en el puerto 3333");
});