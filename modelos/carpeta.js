var mongoose = require("mongoose");

var esquema = new mongoose.Schema(
    {
        nombre : String,
        fecha_creacion : String,
        descripcion : String,
        usuario_creador: mongoose.Schema.Types.Mixed,
        carpetas_internas: Array,
        proyectos_internos: Array,
        archivos_internos: Array
    }
);

module.exports = mongoose.model('carpetas', esquema);