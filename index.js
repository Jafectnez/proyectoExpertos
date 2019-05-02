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
app.use(cookieParser());
app.use(session({secret:"%^cliente$%", resave: true, saveUninitialized:true}));
app.use("/carpetas", carpetasRouter);
app.use("/proyectos", proyectosRouter);
app.use("/archivos", archivosRouter);
app.use(express.static("public"))
var logeado = express.static("logeado");

app.use(
    function(req,res,next){
        if (req.session.codigoUsuario){
            logeado(req, res, next);
        }
        else{
            return next();
        }
    }
);

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
        plan_activo: mongoose.Types.ObjectId("5cc77af9fb6fc00ed59db713")
    });

    usuarioNuevo.save()
    .then(obj=>{
        respuesta={status:1,mensaje: `Se registró exitosamente, se le redireccionará al inicio de sesion en unos segundos`, objeto: obj};
        res.send(respuesta);
    })
    .catch(error=>{
        respuesta={status:0,mensaje: `Ocurrio un error, intente nuevamente.`, objeto: error};
        res.send(respuesta);
    });
});

app.post("/login", function(req, res){
    usuario.find({usuario:req.body.usuario, contrasenia:req.body.contrasenia})
    .then(data=>{
        if (data.length==1){
            req.session.codigoUsuario = data[0]._id;
            req.session.usuario = data[0].usuario;
            req.session.foto_perfil = data[0].foto_perfil;
            req.session.planActivo = data[0].plan_activo;

            res.cookie("codigoUsuario", data[0]._id);
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
    res.redirect("/login.html");
});

app.get('/datos-usuario', function (req, res) {  
    respuesta = {
        usuario: req.session.usuario,
        foto_perfil: req.session.foto_perfil
    }
    res.send(respuesta);
});

app.get("/perfil-usuario", function (req, res) {
    usuario.find({
        _id: mongoose.Types.ObjectId(req.session.codigoUsuario)
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

app.post("/actualizar-perfil", function (req, res) {  
    usuario.findOne({
        _id: mongoose.Types.ObjectId(req.session.codigoUsuario)
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

app.get("/cambiar-plan/:idPlan", function (req, res) {  
    usuario.findOne({
        _id: mongoose.Types.ObjectId(req.session.codigoUsuario)
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
app.get("/amigos", function (req, res) {
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
                _id: mongoose.Types.ObjectId(req.cookies.codigoUsuario)
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

app.get("/amigos/buscar/:cadena", function (req, res) {  
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

app.get("/amigos/:idUsuario/agregar", function (req, res) {  
    usuario.findOneAndUpdate(
        {
            _id: mongoose.Types.ObjectId(req.session.codigoUsuario)
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
                    amigos: mongoose.Types.ObjectId(req.session.codigoUsuario)
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

app.get("/amigos/:idAmigo/eliminar", function (req, res) {
    usuario.find(
        {
            _id: mongoose.Types.ObjectId(req.session.codigoUsuario)
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
                data2[0].amigos.pull(mongoose.Types.ObjectId(req.session.codigoUsuario));
        
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

app.get('/amigos.html', verificarAutenticacion, function (res, req, next) {  
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
/*Fin Verificaciones de Acceso*/

app.listen(process.env.PORT || 3333, function(){
    console.log("Servidor levantado");
});

app.use(function (req, res) {
    res.statusCode = 404;
    res.redirect('/no-encontrado.html');
})