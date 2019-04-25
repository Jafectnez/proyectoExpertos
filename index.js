var express = require("express");
var bodyParser = require("body-parser");
var database = require("./modulos/database");
var carpetasRouter = require('./routers/carpetas-router');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/carpetas", carpetasRouter);
app.use(express.static("public"));

app.listen(3333, function(){
    console.log("Servidor levantado en el puerto 3333");
});