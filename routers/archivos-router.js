var express = require("express");
var router = express.Router();
var archivo = require("../modelos/archivo");
var carpeta = require("../modelos/carpeta");
var mongoose = require("mongoose");

//Obtiene todas los archivos
router.get("/",function(req,res){
    archivo.find()
    .then(data=>{
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene los archivos de un usuario
router.get("/:id",function(req,res){
    archivo.find({
      contenedor: mongoose.Types.ObjectId(req.params.id)
    })
    .then(data=>{
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Crear un archivo
router.post("/:idCarpeta/crear", function(req, res){
    archivo.find({usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario)}).then(data=>{
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc24235f3850afaa3ae6dfd")){
            if(data.length < 4){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc2426df3850afaa3ae6dff")){
            if(data.length < 8){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc2426df3850afaa3ae6e00")){
            if(data.length < 20){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan premium."}
                res.send(respuesta);
            }
        }
    });

});

//Crea los archivos de un nuevo proyecto
router.get("/archivos-proyecto", function (req, res) {  
    fecha_actual = new Date();

    var archivoHTML = new archivo({
        nombre: `index`,
        extension: `html`,
        usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario),
        fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`
    });

    var archivoJS = new archivo({
        nombre: `main`,
        extension: `js`,
        usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario),
        fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`
    });

    var archivoCSS = new archivo({
        nombre: `estilos`,
        extension: `css`,
        usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario),
        fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`
    });

    archivoHTML.save();
    archivoJS.save();
    archivoCSS.save();
});

function crear(req, res){
    fecha_actual = new Date();

    var idArchivo = mongoose.Types.ObjectId();
    
    var archivoNuevo = new archivo({
        _id: idArchivo,
        nombre: req.body.nombreArchivo,
        extension: req.body.extensionArchivo,
        usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario),
        fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`
    });

    archivoNuevo.save()
    .then(obj=>{
        carpeta.update([{
                _id: mongoose.Types.ObjectId(req.params.idCarpeta)
            },
            {
                $push:{
                    archivos_internos: mongoose.Types.ObjectId(idArchivo)
                }
            }
        ]);

        respuesta={status: 1, mensaje: `Creación exitosa`, objeto: obj};
        res.send(respuesta);
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrio un error interno`, objeto: error};
        res.send(respuesta);
    });
}

module.exports = router;