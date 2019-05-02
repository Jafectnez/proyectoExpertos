var express = require("express");
var router = express.Router();
var proyecto = require("../modelos/proyecto");
var carpeta = require("../modelos/carpeta");
var archivo = require("../modelos/archivo");
var mongoose = require("mongoose");

//Obtiene los archivos del proyecto
router.get("/:idProyecto/archivos",function(req,res){
    proyecto.aggregate([{
            $lookup:{
                from: "archivos",
                localField: "archivos",
                foreignField: "_id",
                as: "archivos"
            }
        },
        {
            $match:{
                _id:mongoose.Types.ObjectId(req.params.idProyecto)
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

//Crear un proyecto
router.post("/:idCarpeta/crear", function(req, res){
    proyecto.find({usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario)}).then(data=>{
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc77af9fb6fc00ed59db713")){
            if(data.length < 1){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc77b39fb6fc00ed59db736")){
            if(data.length < 3){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.session.planActivo == mongoose.Types.ObjectId("5cc77b5bfb6fc00ed59db754")){
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
    fechaCreacion = `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`;
    var idProyecto = mongoose.Types.ObjectId();

    carpeta.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.idCarpeta)
    },
    {
        $push:{
            proyectos_internos: mongoose.Types.ObjectId(idProyecto)
        }
    })
    .then(carpetaPadre=>{
        var idHTML = mongoose.Types.ObjectId();
        var idJS = mongoose.Types.ObjectId();
        var idCSS = mongoose.Types.ObjectId();
    
        var archivoHTML = new archivo({
            _id: idHTML,
            nombre: `index`,
            extension: `html`,
            eliminado: false,
            usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario),
            fecha_creacion: fechaCreacion,
            contenido: `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Page Title</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
                <h1>Hola Mundo!</h1>
            </body>
            </html>`,
            modificaciones: [{mensaje:"Creación del archivo", fecha: fechaCreacion}]
        });
    
        var archivoJS = new archivo({
            _id: idJS,
            nombre: `main`,
            extension: `js`,
            eliminado: false,
            usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario),
            fecha_creacion: fechaCreacion,
            contenido: "",
            modificaciones: [{mensaje:"Creación del archivo", fecha: fechaCreacion}]
        });
    
        var archivoCSS = new archivo({
            _id: idCSS,
            nombre: `estilos`,
            extension: `css`,
            eliminado: false,
            usuario_creador: mongoose.Types.ObjectId(req.session.codigoUsuario),
            fecha_creacion: fechaCreacion,
            contenido: "",
            modificaciones: [{mensaje:"Creación del archivo", fecha: fechaCreacion}]
        });
    
        archivoHTML.save();
        archivoJS.save();
        archivoCSS.save();
    
        var proyectoNuevo = new proyecto({
            _id: idProyecto,
            nombre: req.body.nombreProyecto,
            descripcion: req.body.descripcionProyecto,
            archivos: [idHTML, idJS, idCSS],
            colaboradores: [],
            eliminado: false,
            fecha_creacion: fechaCreacion
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
    });
}

module.exports = router;