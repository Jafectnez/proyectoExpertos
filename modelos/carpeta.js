var mongoose = require("mongoose");

var esquema = new mongoose.Schema(
    {
        nombre : String,
        fecha_creacion : mongoose.Schema.Types.Date,
        descripcion : String,
        contenedor: mongoose.Schema.Types.ObjectId
    }
);
module.exports = mongoose.model('carpetas',esquema);