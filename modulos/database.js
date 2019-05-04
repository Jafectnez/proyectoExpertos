var mongoose = require("mongoose");

class Database{
    constructor(){
        this.conectar();
    }

    conectar(){
        mongoose.connect(`mongodb://zaden:zaden_Z9@ds115971.mlab.com:15971/heroku_d2srm201`, { useNewUrlParser: true })
        .then(()=>{
            console.log("Se conectó a la base de datos");
        })
        .catch(error=>{
            console.error(JSON.stringify(error));   
        });
    }
}

module.exports = new Database();