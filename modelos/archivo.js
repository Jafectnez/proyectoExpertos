var mongoose = require("mongoose");

var esquema = new mongoose.Schema(
    {
        nombre : String,
        extension : String,
        fecha_creacion : String,
        descripcion : String,
        modificaciones: Array
    }
);
module.exports = mongoose.model('archivos',esquema);