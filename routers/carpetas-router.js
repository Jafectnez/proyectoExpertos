var express = require("express");
var router = express.Router();
var carpeta = require("../modelos/carpeta");
var proyecto = require("../modelos/proyecto");
var archivo = require("../modelos/archivo");
var usuario = require("../modelos/usuario");
var mongoose = require("mongoose");

//Obtiene las carpetas de un usuario
router.get("/", function(req, res){
    carpeta.aggregate([{
            $lookup:{
                from: "carpetas",
                localField: "carpetas_internas",
                foreignField: "_id",
                as: "carpetas"
            }
        },
        {
            $match:{
                usuario_creador: mongoose.Types.ObjectId(req.user._id),
                eliminado: false,
                subcarpeta: false
            }
        },
        {
            $project:{"carpetas_internas":0}
        }
    ])
    .then(data=>{
        for(var c=0; c<data.length; c++){
            if(data[c].subcarpeta == true){
                data.splice(c, 1);
            }else{
                for(var i=0; i<data[c].carpetas.length; i++){
                    if(data[c].carpetas[i].eliminado == true){
                        data[c].carpetas.splice(i, 1);
                    }
                }
            }
        }

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
                    usuario_creador: mongoose.Types.ObjectId(req.user._id),
                    eliminado: false
                }
            },
            {
                $project:{"proyectos_internos":0}
            }
        ])
        .then(data2=>{
            for(var c=0; c<data2.length; c++){
                for(var i=0; i<data2[c].proyectos.length; i++){
                    if(data2[c].proyectos[i].eliminado == true){
                        data2[c].proyectos.splice(i, 1);
                    }
                }
            }
    
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
                        usuario_creador: mongoose.Types.ObjectId(req.user._id),
                        eliminado: false,
                        subcarpeta: false
                    }
                },
                {
                    $project:{"archivos_internos":0}
                }
            ])
            .then(data3=>{
                for(var c=0; c<data3.length; c++){
                    if(data3[c].subcarpeta == true){
                        data3.splice(c, 1);
                    }else{
                        data3[c].carpetas_internas = data[c].carpetas;
                        data3[c].proyectos_internos = data2[c].proyectos;
                        
                        for(var i=0; i<data3[c].archivos.length; i++){
                            if(data3[c].archivos[i].eliminado == true){
                                data3[c].archivos.splice(i, 1);
                            }
                        }
                    }
                }

                res.send(data3);
            });
        });
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene los datos de una carpeta
router.get("/:idCarpeta/datos", function(req, res){
    console.log(req.params.idCarpeta);
    carpeta.find({
        _id: mongoose.Types.ObjectId(req.params.idCarpeta),
        eliminado: false
    })
    .then(data=>{
        for(var c=0; c<data.length; c++){
            for(var i=0; i<data[c].carpetas_internas.length; i++){
                if(data[c].carpetas_internas[i].eliminado == true){
                    data[c].carpetas_internas.splice(i, 1);
                }
            }
        }

        carpeta.find({
            _id: mongoose.Types.ObjectId(req.params.idCarpeta),
            eliminado: false
        })
        .then(data2=>{
            for(var c=0; c<data2.length; c++){
                for(var i=0; i<data2[c].proyectos_internos.length; i++){
                    if(data2[c].proyectos_internos[i].eliminado == true){
                        data2[c].proyectos_internos.splice(i, 1);
                    }
                }
            }
    
            carpeta.find({
                _id: mongoose.Types.ObjectId(req.params.idCarpeta),
                eliminado: false
            })
            .then(async data3=>{
                var respuesta = []
                for(var c=0; c<data3.length; c++){
                    data3[c].carpetas_internas = data[c].carpetas_internas;
                    data3[c].proyectos_internos = data2[c].proyectos_internos;
                    
                    for(var i=0; i<data3[c].archivos_internos.length; i++){
                        if(data3[c].archivos_internos[i].eliminado == true){
                            data3[c].archivos_internos.splice(i, 1);
                        }
                    }

                    respuesta.push({
                        carpeta: data3[c], 
                        creador: await usuario.findById(mongoose.Types.ObjectId(data3[c].usuario_creador))
                            .then(data=>{
                                return data.usuario;
                            })
                    });
                }

                res.send(respuesta[0]);
            });
        });
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene las carpetas compartidas de un usuario
router.get("/carpetas-compartidas", function(req, res){
    carpeta.aggregate([{
            $lookup:{
                from: "carpetas",
                localField: "carpetas_internas",
                foreignField: "_id",
                as: "carpetas"
            }
        },
        {
            $match:{
                compartido: mongoose.Types.ObjectId(req.user._id),
                eliminado: false,
                subcarpeta: false
            }
        },
        {
            $project:{"carpetas_internas":0}
        }
    ])
    .then(data=>{
        for(var c=0; c<data.length; c++){
            if(data[c].subcarpeta == true){
                data.splice(c, 1);
            }else{
                for(var i=0; i<data[c].carpetas.length; i++){
                    if(data[c].carpetas[i].eliminado == true){
                        data[c].carpetas.splice(i, 1);
                    }
                }
            }
        }
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
                    compartido: mongoose.Types.ObjectId(req.user._id),
                    eliminado: false
                }
            },
            {
                $project:{"proyectos_internos":0}
            }
        ])
        .then(data2=>{
            for(var c=0; c<data2.length; c++){
                for(var i=0; i<data2[c].proyectos.length; i++){
                    if(data2[c].proyectos[i].eliminado == true){
                        data2[c].proyectos.splice(i, 1);
                    }
                }
            }
    
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
                        compartido: mongoose.Types.ObjectId(req.user._id),
                        eliminado: false,
                        subcarpeta: false
                    }
                },
                {
                    $project:{"archivos_internos":0}
                }
            ])
            .then(async data3=>{
                var respuesta = [];
                for(var c=0; c<data3.length; c++){
                    if(data3[c].subcarpeta == true){
                        data3.splice(c, 1);
                    }else{
                        data3[c].carpetas_internas = data[c].carpetas;
                        data3[c].proyectos_internos = data2[c].proyectos;
                        
                        for(var i=0; i<data3[c].archivos.length; i++){
                            if(data3[c].archivos[i].eliminado == true){
                                data3[c].archivos.splice(i, 1);
                            }
                        }

                        respuesta.push({
                            carpeta: data3[c], 
                            creador: await usuario.findById(mongoose.Types.ObjectId(data3[c].usuario_creador))
                                .then(data=>{
                                    return data.usuario;
                                })
                        });
                    }
                }
                res.send(respuesta);
            });
        });
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene los proyectos compartidos de un usuario
router.get("/proyectos-compartidos", function(req, res){
    proyecto.find({
            colaboradores:mongoose.Types.ObjectId(req.user._id),
            eliminado: false
        }
    )
    .then(async data=>{
        var respuesta = [];
        for(var p=0; p<data.length; p++){
            if(data[p].eliminado == true){
                data[p].splice(i, 1);
            }else{
                respuesta.push({
                    proyecto: data[p], 
                    creador: await usuario.findById(mongoose.Types.ObjectId(data[p].usuario_creador))
                        .then(data=>{
                            return data.usuario;
                        })
                });
            }   
        }

        res.send(respuesta);  
    })
    .catch(error=>{
        res.send({status:0, mensaje: "Ocurrio un error interno."});
    });
});

//Obtiene los archivos compartidos de un usuario
router.get("/archivos-compartidos", function(req, res){
    archivo.find({
            compartido: mongoose.Types.ObjectId(req.user._id),
            eliminado: false
        }
    )
    .then(async data=>{
        var respuesta = [];
        for(var a=0; a<data.length; a++){
            if(data[a].eliminado == true){
                data[a].splice(i, 1);
            }else{
                respuesta.push({
                    archivo: data[a], 
                    creador: await usuario.findById(mongoose.Types.ObjectId(data[a].usuario_creador))
                        .then(data=>{
                            return data.usuario;
                        })
                });
            }   
        }

        res.send(respuesta);  
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene las subcarpetas de una carpeta
router.get("/:idCarpeta/carpetas", function(req, res){
    carpeta.aggregate([{
            $lookup:{
                from: "carpetas",
                localField: "carpetas_internas",
                foreignField: "_id",
                as: "carpetas"
            }
        },
        {
            $match:{
                _id: mongoose.Types.ObjectId(req.params.idCarpeta),
                eliminado: false
            }
        },
        {
            $project:{"nombre":1, "carpetas":1}
        }
    ])
    .then(data=>{

        for(var i=0; i<data[0].carpetas.length; i++){
            if(data[0].carpetas[i].eliminado == true){
                data[0].carpetas.splice(i, 1);
            }
        }

        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene los proyectos de una carpeta
router.get("/:idCarpeta/proyectos", function(req, res){
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
                _id: mongoose.Types.ObjectId(req.params.idCarpeta),
                eliminado: false
            }
        },
        {
            $project:{"nombre":1, "proyectos":1}
        }
    ])
    .then(data=>{

        for(var i=0; i<data[0].proyectos.length; i++){
            if(data[0].proyectos[i].eliminado == true){
                data[0].proyectos.splice(i, 1);
            }
        }

        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene los archivos de una carpeta
router.get("/:idCarpeta/archivos", function(req, res){
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
            $project:{"nombre":1, 
                      "archivos":1
            }
        }
    ])
    .then(data=>{
        
        for(var i=0; i<data[0].archivos.length; i++){
            if(data[0].archivos[i].eliminado == true){
                data[0].archivos.splice(i, 1);
            }
        }
        
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Guarda los cambios de una carpeta
router.post("/guardar", function (req, res) {
    carpeta.findOne(
        {
            _id: mongoose.Types.ObjectId(req.body.idCarpeta)
        }
    )
    .then(carpetaEncontrado=>{
        if(carpetaEncontrado.usuario_creador.equals(req.user._id)){
            carpetaEncontrado.nombre = req.body.nombreCarpeta;
            carpetaEncontrado.descripcion = req.body.descripcionCarpeta;
            
            carpetaEncontrado.save()
            .then(()=>{
                respuesta = {status:1, mensaje: "Cambios guardados.", datos: carpetaEncontrado};
                res.send(respuesta);
            })
            .catch(error=>{
                respuesta = {status:0, mensaje: "Ocurrió un error interno."};
                res.send(respuesta);
            });
        }else{
            respuesta = {status:0, mensaje: "No puede editar una carpeta que no es suya."};
            res.send(respuesta);
        }
    })
    .catch(error=>{
        respuesta = {status:0, mensaje: "Ocurrió un error interno al entrar el archivo."};
        res.send(respuesta);
    });
});

//Crear una carpeta
router.post("/crear", function(req, res){
    if(req.body.id){
        var idCreador = req.body.id;
        var planActivo = req.body.plan_activo;
    }
    else{
        var idCreador = req.user._id;
        var planActivo = req.user.plan_activo;
    }

    carpeta.find(
    {
        usuario_creador: mongoose.Types.ObjectId(idCreador),
        subcarpeta: false
    })
    .then(data=>{

        for(var i=0; i<data.length; i++){
            if(data[i].eliminado == true){
                data.splice(i, 1);
            }
        }
        
        if(planActivo == "5cc77af9fb6fc00ed59db713"){
            if(data.length < 2){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(planActivo == "5cc77b39fb6fc00ed59db736"){
            if(data.length < 4){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(planActivo == "5cc77b5bfb6fc00ed59db754"){
            if(data.length < 10){
                crear(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan premium."}
                res.send(respuesta);
            }
        }
    });
});

//Crear una subcarpeta
router.post("/:idCarpeta/crear", function(req, res){
    carpeta.aggregate([{
            $lookup:{
                from: "carpetas",
                localField: "carpetas_internas",
                foreignField: "_id",
                as: "carpetas"
            }
        },
        {
            $match:{
                _id: mongoose.Types.ObjectId(req.params.idCarpeta),
                eliminado: false
            }
        }
    ])
    .then(data=>{

        for(var i=0; i<data[0].carpetas.length; i++){
            if(data[0].carpetas[i].subcarpeta == false){
                data[0].carpetas.splice(i, 1);
            }
        }

        for(var i=0; i<data[0].carpetas.length; i++){
            if(data[0].carpetas[i].eliminado == true){
                data[0].carpetas.splice(i, 1);
            }
        }
        
        if(req.user.plan_activo == "5cc77af9fb6fc00ed59db713"){
            if(data.length < 2){
                crearSubcarpeta(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan gratuito, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.user.plan_activo == "5cc77b39fb6fc00ed59db736"){
            if(data.length < 4){
                crearSubcarpeta(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan regular, si aumenta su plan puede seguir creando."}
                res.send(respuesta);
            }
        }
        if(req.user.plan_activo == "5cc77b5bfb6fc00ed59db754"){
            if(data.length < 10){
                crearSubcarpeta(req, res);
            }else{
                respuesta={status:0, mensaje:"Alcanzó el limite de creaciones para el plan premium."}
                res.send(respuesta);
            }
        }
    })

});

//Compartir una carpeta o subcarpeta
router.post("/:idCarpeta/compartir", function (req, res) {  
    carpeta.findOne({
        _id: mongoose.Types.ObjectId(req.params.idCarpeta)
    })
    .then(data=>{
        var control = 0;
        for(var i=0; i<data.compartido.length; i++){
            if(data.compartido[i] == req.body.idAmigoCompartir)
                control++;
        }
        if(control >= 1){
            respuesta={status: 0, mensaje: `Esta carpeta ya está compartida con ese usuario.`};
            res.send(respuesta);
        }else if(mongoose.Types.ObjectId(req.body.idAmigoCompartir).equals(data.usuario_creador)){
            respuesta={status: 0, mensaje: `No puedes compartir la carpeta con el creador de la misma.`, objeto: error};
            res.send(respuesta);
        }else{
            data.compartido.push(mongoose.Types.ObjectId(req.body.idAmigoCompartir));
            data.save()
            .then(carpetaCompartido=>{
                respuesta={status: 1, mensaje: `Carpeta compartida con éxito.`, objeto: carpetaCompartido};
                res.send(respuesta);
            })
            .catch(error=>{
                respuesta={status: 0, mensaje: `Ocurrió un error interno al compartir la carpeta.`, objeto: error};
                res.send(respuesta);
            });
        }
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al encontrar la carpeta`, objeto: error};
        res.send(respuesta);
    });
});

//Dejar de seguir una carpeta compartida
router.get("/:idCarpeta/compartidas/eliminar", function (req, res) {  
    carpeta.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.idCarpeta)
    },{
        $pull:{
            compartido:req.user._id
        }
    })
    .then(data=>{
        data.save()
        .then(carpetaEliminada=>{
            respuesta={status: 1, mensaje: `Se dejó de seguir la carpeta.`, objeto: carpetaEliminada};
            res.send(respuesta);
        })
        .catch(error=>{
            respuesta={status: 0, mensaje: `Ocurrió un error interno al eliminar la carpeta`, objeto: error};
            res.send(respuesta);
        });
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al encontrar la carpeta`, objeto: error};
        res.send(respuesta);
    });
});

//Eliminar una carpeta o subcarpeta
router.get("/:idCarpeta/eliminar", function (req, res) {  
    carpeta.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.idCarpeta)
    },{
        $set:{
            eliminado: true
        }
    })
    .then(data=>{
        data.save()
        .then(carpetaEliminada=>{
            eliminarContenido(req.params.idCarpeta);
            respuesta={status: 1, mensaje: `Eliminación exitosa.`, objeto: carpetaEliminada};
            res.send(respuesta);
        })
        .catch(error=>{
            respuesta={status: 0, mensaje: `Ocurrió un error interno al eliminar la carpeta`, objeto: error};
            res.send(respuesta);
        });
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al encontrar la carpeta`, objeto: error};
        res.send(respuesta);
    });
});

function crear(req, res){
    fecha_actual = new Date();
    if(req.body.id)
        var idCreador = req.body.id;
    else
        var idCreador = req.user._id;
    
    var carpetaNueva = new carpeta({
        nombre: req.body.nombreCarpeta,
        descripcion: req.body.descripcionCarpeta,
        subcarpeta: false,
        eliminado: false,
        compartido: [],
        usuario_creador: mongoose.Types.ObjectId(idCreador),
        fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`,
        carpetas_internas: [],
        proyectos_internos: [],
        archivos_internos: []
    });

    carpetaNueva.save()
    .then(obj=>{
        respuesta={status: 1, mensaje: `Creación exitosa`, objeto: obj};
        res.send(respuesta);
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno.`, objeto: error};
        res.send(respuesta);
    });
}

function crearSubcarpeta(req, res){
    fecha_actual = new Date();

    var idCarpetaNueva = mongoose.Types.ObjectId();
    var idCarpetaPadre = mongoose.Types.ObjectId(req.params.idCarpeta);

    carpeta.findOneAndUpdate({
        _id: idCarpetaPadre
    },
    {
        $push:{
            carpetas_internas: idCarpetaNueva
        }
    })
    .then(carpetaPadre=>{
        var carpetaNueva = new carpeta({
            _id: idCarpetaNueva,
            nombre: req.body.nombreCarpeta,
            descripcion: req.body.descripcionCarpeta,
            subcarpeta: true,
            eliminado: false,
            compartido: [],
            usuario_creador: mongoose.Types.ObjectId(req.user._id),
            fecha_creacion: `${fecha_actual.getFullYear()}-${fecha_actual.getMonth()}-${fecha_actual.getDate()}`,
            carpetas_internas: [],
            proyectos_internos: [],
            archivos_internos: [],
        });
    
        carpetaNueva.save()
        .then(obj=>{
            respuesta={status: 1, mensaje: `Creación exitosa`, objeto: obj};
            res.send(respuesta);
        })
        .catch(error=>{
            respuesta={status: 0, mensaje: `Ocurrió un error interno`, objeto: error};
            res.send(respuesta);
        });
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno`, objeto: error};
        res.send(respuesta);
    });
}

function eliminarContenido(idCarpeta) {
    carpeta.aggregate([
        {
            $lookup:{
                from: "carpetas",
                localField: "carpetas_internas",
                foreignField: "_id",
                as: "carpetas"
            }
        },
        {
            $match:{
                _id: mongoose.Types.ObjectId(idCarpeta)
            }
        },
        {
            $project:{"nombre":1, "carpetas":1}
        }
    ])
    .then(carpetaSeleccionada=>{
        for(let i in carpetaSeleccionada[0].carpetas){
            carpeta.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(carpetaSeleccionada[0].carpetas[i]._id)
                },
                {
                    $set:{
                        eliminado: true
                    }
                }
            )
            .then(data=>{
                data.save()
            })
            .catch(error=>{
                respuesta={status: 0, mensaje: `Ocurrió un error interno al eliminar la subcarpeta ${carpetaSeleccionada[0].carpetas[i]._id}`, objeto: error};
                res.send(respuesta);
            });
        }
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al encontrar la carpeta`, objeto: error};
        res.send(respuesta);
    });

    carpeta.aggregate([
        {
            $lookup:{
                from: "archivos",
                localField: "archivos_internos",
                foreignField: "_id",
                as: "archivos"
            }
        },
        {
            $match:{
                _id: mongoose.Types.ObjectId(idCarpeta)
            }
        },
        {
            $project:{"nombre":1, "archivos":1}
        }
    ])
    .then(carpetaSeleccionada=>{
        for(let i in carpetaSeleccionada[0].archivos){
            archivo.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(carpetaSeleccionada[0].archivos[i]._id)
                },
                {
                    $set:{
                        eliminado: true
                    }
                }
            )
            .then(data=>{
                data.save()
            })
            .catch(error=>{
                respuesta={status: 0, mensaje: `Ocurrió un error interno al eliminar el archivo ${carpetaSeleccionada[0].archivos[i]._id}`, objeto: error};
                res.send(respuesta);
            });
        }
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al encontrar la carpeta`, objeto: error};
        res.send(respuesta);
    });;
    
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
                _id: mongoose.Types.ObjectId(idCarpeta)
            }
        },
        {
            $project:{"nombre":1, "proyectos":1}
        }
    ])
    .then(carpetaSeleccionada=>{
        for(let i in carpetaSeleccionada[0].proyectos){
            proyecto.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(carpetaSeleccionada[0].proyectos[i]._id)
                },
                {
                    $set:{
                        eliminado: true
                    }
                }
            )
            .then(data=>{
                data.save()
            })
            .catch(error=>{
                respuesta={status: 0, mensaje: `Ocurrió un error interno al eliminar el proyecto ${carpetaSeleccionada[0].proyectos[i]._id}`, objeto: error};
                res.send(respuesta);
            });
        }
    })
    .catch(error=>{
        respuesta={status: 0, mensaje: `Ocurrió un error interno al encontrar la carpeta`, objeto: error};
        res.send(respuesta);
    });;
}

module.exports = router;