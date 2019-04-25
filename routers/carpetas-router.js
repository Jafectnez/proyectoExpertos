var express = require("express");
var router = express.Router();
var carpeta = require("../modelos/carpeta");

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
    carpeta.find(
        {
            usuario_creador:req.params.id
        }
    )
    .then(data=>{
        res.send(data);
    })
    .catch(error=>{
        res.send(error);
    });
});

module.exports = router;