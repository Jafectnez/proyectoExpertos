var express = require("express");
var router = express.Router();
var carpeta = require("../modelos/carpeta");
var mongoose = require("mongoose");

//Obtiene las carpetas de un usuario
router.get("/",function(req,res){
    carpeta.aggregate([
        {
            $lookup:{
                from:"proyectos",
                localField:"_id",
                foreignField:"contenedor",
                as:"proyectos"
            }
        },
        {
            $match:{
                usuario_creador:mongoose.Types.ObjectId(req.session.codigoUsuario)
            }
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
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc24235f3850afaa3ae6dfd")){
            if(data.length < 2){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc2426df3850afaa3ae6dff")){
            if(data.length < 4){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc2426df3850afaa3ae6e00")){
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