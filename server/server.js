var express = require("express")
var db = require("./model/controller")
var app = express()
var porta = 8081

var expressSession = require("express-session")

/* Questa callback viene richiamata quando avvio il server */
/* rispetto alla listen del modulo http, questa è ASINCRONA */
app.listen(porta, ()=>{
    console.log("Il server è stato avviato sulla porta " + porta)
})

// Middleware CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Credentials', 'true')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

// Middleware per parsare JSON
app.use(express.json())

app.use(expressSession({
    secret: 'parolasegreta',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}))


app.post('/login', async (richiesta, risposta)=>{
  let data = richiesta.body
  console.log(data)
  let role = {}
  switch(data.role)
  {
    case 'paziente':
      role.campi = 'id, nome, cognome, indirizzo, dataN, mail'
      role.table = 'user'
      role.role = 'paziente'
      break;

    case 'medico':
      role.campi = 'id, nome, cognome, indirizzo, dataN, mail, idRep, costo'
      role.table = 'dottori'
      role.role = 'medico'
      break;

    case 'admin':
      role.campi = 'id, utente, mail'
      role.table = 'admin'
      role.role = 'admin'
      break;

  }

  let idUser = await db.getUserByMail(data.email, role.table);
  console.log(idUser)
  let pwd = await db.getUserById("password", role.table, idUser)
  console.log(pwd)
  if(data.password == pwd.password)
  {

    let user = await db.getUserById(role.campi, role.table, idUser)
    richiesta.session.userID = idUser
    user.role = role.role
    console.log(user)
    risposta.send({status: 'success', data: user})

  }
  else
    risposta.send({status: 'failed', data: 'Password errata'})


})
