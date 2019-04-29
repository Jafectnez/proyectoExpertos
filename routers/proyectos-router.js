var express = require("express");
var router = express.Router();
var proyecto = require("../modelos/proyecto");
var mongoose = require("mongoose");

//Obtiene todas los archivos
router.get("/",function(req,res){
    proyecto.find()
    .then(data=>{
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene los archivos de un usuario
router.get("/:id",function(req,res){
    proyecto.find({
      contenedor: mongoose.Types.ObjectId(req.params.id)
    })
    .then(data=>{
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Crear un proyecto
router.post("/crear", function(req, res){
    proyecto.find({usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario)}).then(data=>{
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc24235f3850afaa3ae6dfd")){
            if(data.length < 1){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc2426df3850afaa3ae6dff")){
            if(data.length < 3){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc2426df3850afaa3ae6e00")){
            if(data.length < 8){
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
    
    var proyectoNuevo = new proyecto({
        nombre: req.body.nombreProyecto,
        descripcion: req.body.descripcionProyecto,
        usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario),
        fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`
    });

    proyectoNuevo.save()
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