var mongoose = require("mongoose");

var esquema = new mongoose.Schema(
    {
        nombre : String,
        fecha_creacion : Date,
        descripcion : String,
        contenedor: ObjectId
    }
);
module.exports = mongoose.model('proyectos',esquema);