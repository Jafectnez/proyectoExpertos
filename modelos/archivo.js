var mongoose = require("mongoose");

var esquema = new mongoose.Schema(
    {
        nombre : String,
        extension : String,
        fecha_creacion : mongoose.Schema.Types.Date,
        contenedor: mongoose.Schema.Types.ObjectId,
        descripcion : String,
        modificaciones: Array
    }
);
module.exports = mongoose.model('archivos',esquema);