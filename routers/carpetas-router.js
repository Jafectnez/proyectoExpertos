var express = require("express");
var router = express.Router();
var carpeta = require("../modelos/carpeta");
var mongoose = require("mongoose");

//Obtiene las carpetas de un usuario
router.get("/",function(req,res){
    console.log(req.session.codigoUsuario);
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

//Crea una carpeta
router.post("/crear", function(req, res){
    fecha_actual = new Date();
    var carpetaNueva = new carpeta({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        usuario_creador: mongoose.Types.ObjectId(req.body.id),
        fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`
    });

    carpetaNueva.save()
    .then(obj=>{
        respuesta={status: 1, mensaje: `Creación exitosa`, objeto: obj};
        res.send(respuesta);
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrio un error`, objeto: error};
        res.send(respuesta);
    });

});

module.exports = router;