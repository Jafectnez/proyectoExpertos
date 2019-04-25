var express = require("express");
var router = express.Router();
var carpeta = require("../modelos/carpeta");
var mongoose = require("mongoose");

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