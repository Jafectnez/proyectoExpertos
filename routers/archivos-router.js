var express = require("express");
var router = express.Router();
var archivo = require("../modelos/archivo");
var carpeta = require("../modelos/carpeta");
var usuario = require("../modelos/usuario");
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

//Obtiene los datos de un archivo
router.get("/:idArchivo",function(req,res){
    archivo.find({
      _id: mongoose.Types.ObjectId(req.params.idArchivo)
    })
    .then(data=>{
        usuario.find({_id: data[0].usuario_creador})
        .then(usuarioEncontrado=>{
            respuesta = {archivo: data[0], creador: usuarioEncontrado[0].usuario};
            res.send(respuesta);
        })
    })
    .catch(error=>{
        res.send({status: 0, mensaje: "Ocurrio un error", datos: error});
    });
});

//Crear un archivo
router.post("/:idCarpeta/crear", function(req, res){
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
                _id: mongoose.Types.ObjectId(req.params.idCarpeta),
                eliminado: false
            }
        },
        {
            $project:{"nombre":1, "archivos":1}
        }
    ])
    .then(data=>{
        if(req.user.plan_activo == "5cc77af9fb6fc00ed59db713"){
            if(data[0].archivos.length < 4){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.user.plan_activo == "5cc77b39fb6fc00ed59db736"){
            if(data[0].archivos.length < 8){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.user.plan_activo == "5cc77b5bfb6fc00ed59db754"){
            if(data[0].archivos.length < 20){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan premium."}
                res.send(respuesta);
            }
        }
    });

});

//Guarda los cambios en un archivo
router.post("/guardar", function (req, res) {  
    var fecha_actual = new Date();
    archivo.findOne(
        {
            _id: mongoose.Types.ObjectId(req.body.idArchivo)
        }
    )
    .then(archivoEncontrado=>{
        if(archivoEncontrado.usuario_creador.equals(req.user._id)){
            archivoEncontrado.nombre = req.body.nombreArchivo;
            archivoEncontrado.extension = req.body.extensionArchivo;
            archivoEncontrado.contenido = req.body.contenidoArchivo;
            var modificacion = {mensaje:`Modificaciones realizadas por: ${req.user._id}`, fecha:`${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`}
            archivoEncontrado.modificaciones.push(modificacion);
            console.log(modificacion);
            archivoEncontrado.save()
            .then(()=>{
                respuesta = {status:1, mensaje: "Cambios guardados", datos:archivoEncontrado};
                res.send(respuesta);
            })
            .catch(error=>{
                respuesta = {status:0, mensaje: "Ocurrió un error interno"};
                res.send(respuesta);
            });
        }else{
            archivoEncontrado.contenido = req.body.contenidoArchivo;
            archivoEncontrado.modificaciones.push({mensaje:"Modificaciones realizadas por: "+req.user._id, fecha:`${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`})

            archivoEncontrado.save()
            .then(()=>{
                respuesta = {status:1, mensaje: "Cambios guardados.", datos:archivoEncontrado};
                res.send(respuesta);
            })
            .catch(error=>{
                respuesta = {status:0, mensaje: "Ocurrió un error interno al guardar los cambios."};
                res.send(respuesta);
            });
        }
    })
    .catch(error=>{
        respuesta = {status:0, mensaje: "Ocurrió un error interno al entrar el archivo."};
        res.send(respuesta);
    });
});

//Guarda los cambios hechos en un proyecto
router.post("/guardar-cambios", function (req, res) {
    var fecha_actual = new Date();
    var data = {};
    archivo.findOne(
        {
            _id: req.body.id.html
        }
    )
    .then(archivoHTML=>{
        archivoHTML.contenido = req.body.contenido.html;
        archivoHTML.modificaciones.push({mensaje:"Modificaciones realizadas por: "+req.user._id, fecha:`${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`})
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
                archivoJS.modificaciones.push({mensaje:"Modificaciones realizadas por: "+req.user._id, fecha:`${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`})
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
                        archivoCSS.modificaciones.push({mensaje:"Modificaciones realizadas por: "+req.user._id, fecha:`${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`})
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

//Compartir un archivo
router.post("/:idArchivo/compartir", function (req, res) {  
    archivo.findOne({
        _id: mongoose.Types.ObjectId(req.params.idArchivo)
    })
    .then(data=>{
        var control = 0;
        for(var i=0; i<data.compartido.length; i++){
            if(data.compartido[i] == req.body.idAmigoCompartir)
                control++;
        }
        if(control >= 1){
            respuesta={status: 0, mensaje: `Este archivo ya está compartido con ese usuario.`};
            res.send(respuesta);
        }else{
            data.compartido.push(mongoose.Types.ObjectId(req.body.idAmigoCompartir));
            data.save()
            .then(archivoCompartido=>{
                respuesta={status: 1, mensaje: `Archivo compartido con éxito.`, objeto: archivoCompartido};
                res.send(respuesta);
            })
            .catch(error=>{
                respuesta={status: 0, mensaje: `Ocurrió un error interno al compartir el archivo.`, objeto: error};
                res.send(respuesta);
            });
        }
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al buscar el archivo.`, objeto: error};
        res.send(respuesta);
    });
});

//Dejar de seguir un archivo compartido
router.get("/:idArchivo/compartidos/eliminar", function (req, res) {  
    archivo.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.idArchivo)
    },{
        $pull:{
            compartido:req.user._id
        }
    })
    .then(data=>{
        data.save()
        .then(archivoEliminado=>{
            respuesta={status: 1, mensaje: `Se dejó de seguir el archivo.`, objeto: archivoEliminado};
            res.send(respuesta);
        })
        .catch(error=>{
            respuesta={status: 0, mensaje: `Ocurrió un error interno al eliminar el archivo`, objeto: error};
            res.send(respuesta);
        });
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al encontrar el archivo`, objeto: error};
        res.send(respuesta);
    });
});

//Elimina un archivo
router.get("/:idArchivo/eliminar", function (req, res) {  
    archivo.findByIdAndUpdate(
        {
            _id: mongoose.Types.ObjectId(req.params.idArchivo)
        },
        {
            $set:{
                eliminado: true
            }
        }
    )
    .then(archivoEliminado=>{
        respuesta={status: 1, mensaje: `Eliminación exitosa`, objeto: archivoEliminado};
        res.send(respuesta);
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrio un error interno`, objeto: error};
        res.send(respuesta);
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
            compartido: [],
            usuario_creador: mongoose.Types.ObjectId(req.user._id),
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

module.exports = router;