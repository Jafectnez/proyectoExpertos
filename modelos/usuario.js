const bcrypt = require('bcrypt-nodejs');
const mongoose = require("mongoose");

const esquema = new mongoose.Schema(
    {
        nombre : String,
        apellido : String,
        foto_perfil : String,
        genero : String,
        residencia : String,
        correo : {type: String, unique: true, lowercase: true, required: true},
        usuario : {type: String, unique: true, required: true},
        contrasenia : {type: String, required: true},
        salt:{type: String},
        amigos: Array,
        plan_activo : mongoose.Schema.Types.ObjectId,
        proveedor: {type: String,required: 'El proveedor es necesario'},
        proveedorId: String,
        proveedorData: {},
    }
);

esquema.pre('save', function (next) {
    const usuario = this;
    if(!usuario.isModified('contrasenia')){
        return next();
    }

    bcrypt.genSalt(10, (err, salt) =>{
        if(err){
            next(err);
        }

        bcrypt.hash(usuario.contrasenia, salt, null, (err, hash)=>{
            if(err){
                next(err);
            }

            usuario.salt = salt;
            usuario.contrasenia = hash;
            next();
        })
    })
});

esquema.methods.compararContrasenia = function (contrasenia, cb) {
    bcrypt.compare(contrasenia, this.contrasenia, (err, sonIguales)=>{
        if(err){
            console.log(err);
            return cb(err);
        }
        
        return cb(sonIguales);
    })
}

module.exports = mongoose.model('usuarios', esquema);