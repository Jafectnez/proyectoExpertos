var mongoose = require("mongoose");

var esquema = new mongoose.Schema(
    {
        nombre : String,
        apellido : String,
        foto_perfil : String,
        genero : String,
        residencia : String,
        correo : String,
        usuario: String,
        contrasenia:String,
        plan_activo: ObjectId
    }
);
module.exports = mongoose.model('usuarios',esquema);