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
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc77af9fb6fc00ed59db713")){
            if(data.length < 4){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc77b39fb6fc00ed59db736")){
            if(data.length < 8){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc77b5bfb6fc00ed59db754")){
            if(data.length < 20){
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
    var idArchivo = mongoose.Types.ObjectId();
    
    carpeta.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.idCarpeta)
    },
    {
        $push:{
            archivos_internos: mongoose.Types.ObjectId(idArchivo)
        }
    })
    .then(carpetaPadre=>{      
        var archivoNuevo = new archivo({
            _id: idArchivo,
            nombre: req.body.nombreArchivo,
            extension: req.body.extensionArchivo,
            contenido: req.body.contenidoArchivo,
            eliminado: false,
            fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`,
            modificaciones: [{
                mensaje: `Creación del archivo`,
                fecha: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`
            }]
        });
    
        archivoNuevo.save()
        .then(obj=>{
            respuesta={status: 1, mensaje: `Creación exitosa`, objeto: obj};
            res.send(respuesta);
        })
        .catch(error=>{
            respuesta={status: 0, mensaje: `Ocurrio un error interno`, objeto: error};
            res.send(respuesta);
        });
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrio un error interno`, objeto: error};
        res.send(respuesta);
    });
}

//Guarda los cambios hechos en un archivo
router.post("/guardar-cambios", function (req, res) {
    var data = {};
    archivo.findOne(
        {
            _id: req.body.id.html
        }
    )
    .then(archivoHTML=>{
        archivoHTML.contenido = req.body.contenido.html;
        data.html = archivoHTML;

        archivoHTML.save()
        .then(()=>{
            archivo.findOne(
                {
                    _id: mongoose.Types.ObjectId(req.body.id.js)
                }
            )
            .then(archivoJS=>{
                archivoJS.contenido = req.body.contenido.js;
                data.js = archivoJS;

                archivoJS.save()
                .then(()=>{
                    archivo.findOne(
                        {
                            _id: mongoose.Types.ObjectId(req.body.id.css)
                        }
                    )
                    .then(archivoCSS=>{
                        archivoCSS.contenido = req.body.contenido.css;
                        data.css = archivoCSS;

                        archivoCSS.save()
                        .then(()=>{
                            respuesta = {status:1, mensaje: "Cambios guardados", datos:data};
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

module.exports = router;