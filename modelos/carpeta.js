var mongoose = require("mongoose");

var esquema = new mongoose.Schema(
    {
        nombre : String,
        fecha_creacion : String,
        descripcion : String,
        contenedor: mongoose.Schema.Types.ObjectId,
        usuario_creador: mongoose.Schema.Types.ObjectId
    }
);

module.exports = mongoose.model('Carpetas', esquema);