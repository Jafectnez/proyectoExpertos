var express = require("express");
var router = express.Router();
var archivo = require("../modelos/archivo");
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

module.exports = router;