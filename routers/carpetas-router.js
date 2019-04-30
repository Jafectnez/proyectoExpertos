var express = require("express");
var router = express.Router();
var carpeta = require("../modelos/carpeta");
var mongoose = require("mongoose");

//Obtiene las carpetas de un usuario
router.get("/",function(req,res){
    carpeta.find(
        {
            usuario_creador:mongoose.Types.ObjectId(req.session.codigoUsuario)
        }
    )
    .then(data=>{
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene los proyectos de una carpeta
router.get("/proyectos",function(req,res){
    carpeta.aggregate([{
            $lookup:{
                from: "proyectos",
                localField: "proyectos_internos",
                foreignField: "_id",
                as: "proyectos"
            }
        },
        {
            $match:{
                usuario_creador:mongoose.Types.ObjectId(req.session.codigoUsuario)
            }
        },
        {
            $project:{"nombre":1, "proyectos":1}
        }
    ])
    .then(data=>{
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene los archivos de una carpeta
router.get("/archivos",function(req,res){
    carpeta.aggregate([{
            $lookup:{
                from: "archivos",
                localField: "archivos_internos",
                foreignField: "_id",
                as: "archivos"
            }
        },
        {
            $match:{
                usuario_creador:mongoose.Types.ObjectId(req.session.codigoUsuario)
            }
        },
        {
            $project:{"nombre":1, "archivos":1}
        }
    ])
    .then(data=>{
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Crear una carpeta
router.post("/crear", function(req, res){
    carpeta.find({usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario)}).then(data=>{
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc77af9fb6fc00ed59db713")){
            if(data.length < 2){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc77b39fb6fc00ed59db736")){
            if(data.length < 4){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc77b5bfb6fc00ed59db754")){
            if(data.length < 10){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan premium."}
                res.send(respuesta);
            }
        }
    });

});

function crear(req, res){
    fecha_actual = new Date();
    if(req.body.id)
        var idCreador = req.body.id;
    else
        var idCreador = req.session.codigoUsuario;
    
    var carpetaNueva = new carpeta({
        nombre: req.body.nombreCarpeta,
        descripcion: req.body.descripcionCarpeta,
        usuario_creador: mongoose.Types.ObjectId(idCreador),
        fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`
    });

    carpetaNueva.save()
    .then(obj=>{
        respuesta={status: 1, mensaje: `Creación exitosa`, objeto: obj};
        res.send(respuesta);
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrio un error interno`, objeto: error};
        res.send(respuesta);
    });
}

module.exports = router;