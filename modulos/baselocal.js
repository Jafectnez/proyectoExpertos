var mongoose = require("mongoose");

class Database{
    constructor(){
        this.conectar();
    }

    conectar(){
        mongoose.connect(`mongodb://127.0.0.1:27017/gepo`, { useNewUrlParser: true })
        .then(()=>{
            console.log("Se conectó a la base de datos local");
        })
        .catch(error=>{
            console.error(JSON.stringify(error));   
        });
    }

    mensaje(){
        console.log("PRUEBA");
    }
}

module.exports = new Database();