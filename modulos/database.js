var mongoose = require("mongoose");

var servidor = "localhost:27017";
var nombreBaseDatos ="GEPO";

class Database{
    constructor(){
        this.conectar();
    }

    conectar(){
        mongoose.connect(`mongodb://${servidor}/${nombreBaseDatos}`)
        .then(()=>{
            console.log("Se conectó a la base de datos");
        })
        .catch(error=>{
            console.error(JSON.stringify(error));   
        });
    }
}

module.exports = new Database();