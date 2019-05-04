const express = require("./config/express");
const Passport = require("./config/passport");
const database = require("./modulos/database");

var app = express();
var passport = Passport();

app.listen(process.env.PORT || 3333, function(){
    console.log("Servidor levantado");
});

module.exports = app;