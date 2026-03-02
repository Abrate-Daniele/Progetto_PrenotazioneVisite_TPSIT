var express = require("express")
var mysql = require("mysql")
var app = express()
var porta = 8081


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'Progetto_TPSIT'
});

/* Questa callback viene richiamata quando avvio il server */
/* rispetto alla listen del modulo http, questa è ASINCRONA */
app.listen(porta, ()=>{
    console.log("Il server è stato avviato sulla porta "+porta)
})


