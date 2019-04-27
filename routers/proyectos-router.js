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

module.exports = router;