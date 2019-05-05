var express = require("express");
var router = express.Router();
var proyecto = require("../modelos/proyecto");
var carpeta = require("../modelos/carpeta");
var archivo = require("../modelos/archivo");
var usuario = require("../modelos/usuario");
var mongoose = require("mongoose");
var JSZip = require("jszip");
var fs = require("fs");

//Obtiene los datos de un proyecto
router.get("/:idProyecto",function(req,res){
    proyecto.find({_id: req.params.idProyecto})
    .then(data=>{
        usuario.find({_id: data[0].usuario_creador})
        .then(usuarioEncontrado=>{
            respuesta = {proyecto: data[0], creador: usuarioEncontrado[0].usuario};
            res.send(respuesta);
        })
    })
    .catch(error=>{
        res.send(error);
    });
});

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

//Guarda los cambios de un proyecto
router.post("/guardar", function (req, res) {
    proyecto.findOne(
        {
            _id: mongoose.Types.ObjectId(req.body.idProyecto)
        }
    )
    .then(proyectoEncontrado=>{
        if(proyectoEncontrado.usuario_creador.equals(req.user._id)){
            proyectoEncontrado.nombre = req.body.nombreProyecto;
            proyectoEncontrado.descripcion = req.body.descripcionProyecto;
            
            proyectoEncontrado.save()
            .then(()=>{
                respuesta = {status:1, mensaje: "Cambios guardados", datos: proyectoEncontrado};
                res.send(respuesta);
            })
            .catch(error=>{
                respuesta = {status:0, mensaje: "Ocurrió un error interno"};
                res.send(respuesta);
            });
        }else{
            respuesta = {status:0, mensaje: "No puede editar un proyecto que no es suyo."};
            res.send(respuesta);
        }
    })
    .catch(error=>{
        respuesta = {status:0, mensaje: "Ocurrió un error interno al entrar el archivo."};
        res.send(respuesta);
    });
});

//Crear un proyecto
router.post("/:idCarpeta/crear", function(req, res){
    carpeta.find({_id: mongoose.Types.ObjectId(req.params.idCarpeta)}).then(data=>{
        if(req.user.plan_activo == "5cc77af9fb6fc00ed59db713"){
            if(data[0].proyectos_internos.length < 1){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.user.plan_activo == "5cc77b39fb6fc00ed59db736"){
            if(data[0].proyectos_internos.length < 3){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.user.plan_activo == "5cc77b5bfb6fc00ed59db754"){
            if(data[0].proyectos_internos.length < 8){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan premium."}
                res.send(respuesta);
            }
        }
    });

});

//Compartir un proyecto
router.post("/:idProyecto/compartir", function (req, res) {  
    proyecto.findOne({
        _id: mongoose.Types.ObjectId(req.params.idProyecto)
    })
    .then(data=>{
        var control = 0;
        for(var i=0; i<data.colaboradores.length; i++){
            if(data.colaboradores[i] == req.body.idAmigoCompartir)
                control++;
        }
        if(control >= 1){
            respuesta={status: 0, mensaje: `Este proyecto ya está compartido con ese usuario.`};
            res.send(respuesta);
        }else if(mongoose.Types.ObjectId(req.body.idAmigoCompartir).equals(data.usuario_creador)){
            respuesta={status: 0, mensaje: `No puedes compartir el proyecto con el creador del mismo.`, objeto: error};
            res.send(respuesta);
        }else{
            data.colaboradores.push(mongoose.Types.ObjectId(req.body.idAmigoCompartir));
            data.save()
            .then(proyectoCompartido=>{
                respuesta={status: 1, mensaje: `Proyecto compartido con éxito.`, objeto: proyectoCompartido};
                res.send(respuesta);
            })
            .catch(error=>{
                respuesta={status: 0, mensaje: `Ocurrió un error interno al compartir el proyecto.`, objeto: error};
                res.send(respuesta);
            });
        }
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al buscar el proyecto.`, objeto: error};
        res.send(respuesta);
    });
});

//Dejar de seguir un proyecto compartido
router.get("/:idProyecto/compartidos/eliminar", function (req, res) {  
    proyecto.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.idProyecto)
    },{
        $pull:{
            colaboradores:req.user._id
        }
    })
    .then(data=>{
        data.save()
        .then(proyectoEliminado=>{
            respuesta={status: 1, mensaje: `Se dejó de seguir el proyecto.`, objeto: proyectoEliminado};
            res.send(respuesta);
        })
        .catch(error=>{
            respuesta={status: 0, mensaje: `Ocurrió un error interno al eliminar el proyecto`, objeto: error};
            res.send(respuesta);
        });
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al encontrar el proyecto`, objeto: error};
        res.send(respuesta);
    });
});

//Elimina un proyecto
router.get("/:idProyecto/eliminar", function (req, res) {  
    proyecto.findByIdAndUpdate(
        {
            _id: mongoose.Types.ObjectId(req.params.idProyecto)
        },
        {
            $set:{
                eliminado: true
            }
        }
    )
    .then(proyectoEliminado=>{
        respuesta={status: 1, mensaje: `Eliminación exitosa`, objeto: proyectoEliminado};
        res.send(respuesta);
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrio un error interno`, objeto: error};
        res.send(respuesta);
    });
});

//Descarga un proyecto
router.get("/:idProyecto/descargar", function (req, res) {  
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
                _id:mongoose.Types.ObjectId(req.params.idProyecto),
                eliminado: false
            }
        },
        {
            $project:{"nombre":1, "archivos":1}
        }
    ])
    .then(proyectoEncontrado=>{
        var zip = new JSZip();

        var miProyecto = zip.folder(`${proyectoEncontrado[0].nombre}`)

        for(var i=0; i<proyectoEncontrado[0].archivos.length; i++){
          var archivo = proyectoEncontrado[0].archivos[i];
          miProyecto.file(`${archivo.nombre}.${archivo.extension}`, archivo.contenido, {base64: true});
        }

        miProyecto.generateNodeStream({type:'nodebuffer', streamFiles:true})
        .pipe(fs.createWriteStream(`${__dirname}/${proyectoEncontrado[0].nombre}.zip`))
        .on('finish', function () {
            // JSZip generates a readable stream with a "end" event,
            // but is piped here in a writable stream which emits a "finish" event.
            console.log(`${proyectoEncontrado[0].nombre}.zip creado.`);
            res.download(`${__dirname}/${proyectoEncontrado[0].nombre}.zip`, `${proyectoEncontrado[0].nombre}.zip`);
        });
    })
    .catch(error=>{
        res.send(error);
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
            compartido: [],
            usuario_creador: mongoose.Types.ObjectId(req.user._id),
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
            compartido: [],
            usuario_creador: mongoose.Types.ObjectId(req.user._id),
            fecha_creacion: fechaCreacion,
            contenido: "",
            modificaciones: [{mensaje:"Creación del archivo", fecha: fechaCreacion}]
        });
    
        var archivoCSS = new archivo({
            _id: idCSS,
            nombre: `estilos`,
            extension: `css`,
            eliminado: false,
            compartido: [],
            usuario_creador: mongoose.Types.ObjectId(req.user._id),
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
            usuario_creador: mongoose.Types.ObjectId(req.user._id),
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