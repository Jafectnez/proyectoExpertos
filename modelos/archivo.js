var mongoose = require("mongoose");

var esquema = new mongoose.Schema(
    {
        nombre : String,
        extension : String,
        fecha_creacion : String,
        contenido : String,
        modificaciones: Array
    }
);
module.exports = mongoose.model('archivos',esquema);