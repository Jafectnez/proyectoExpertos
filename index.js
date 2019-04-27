var express = require("express");
var bodyParser = require("body-parser");
var database = require("./modulos/database");
var carpetasRouter = require('./routers/carpetas-router');
var proyectosRouter = require('./routers/proyectos-router');
var archivosRouter = require('./routers/archivos-router');
var cookieParser = require('cookie-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/carpetas", carpetasRouter);
app.use("/proyectos", proyectosRouter);
app.use("/archivos", archivosRouter);
app.use(cookieParser());
app.use(express.static("public"));

app.listen(3333, function(){
    console.log("Servidor levantado en el puerto 3333");
});