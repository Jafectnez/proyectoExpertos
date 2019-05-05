var mongoose = require("mongoose");

var esquema = new mongoose.Schema(
    {
        nombre : String,
        fecha_creacion : String,
        descripcion : String,
        archivos: Array,
        colaboradores: Array,
        eliminado: Boolean,
        usuario_creador: mongoose.Types.ObjectId
    }
);
module.exports = mongoose.model('proyectos',esquema);