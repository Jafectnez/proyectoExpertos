var express = require("express");
var router = express.Router();
var carpeta = require("../modelos/carpeta");
var mongoose = require("mongoose");

//Obtiene todas las carpetas
router.get("/",function(req,res){
    carpeta.find()
    .then(data=>{
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

//Obtiene las carpetas de un usuario
router.get("/:id",function(req,res){
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
                usuario_creador:mongoose.Types.ObjectId(req.params.id)
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

module.exports = router;