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

  switch(data.role)
  {
    case 'paziente':
    {
      let idUser = await db.getUserByMail(data.email);
      console.log(idUser)
      let pwd = await db.getUserById("password", idUser)
      console.log(pwd)
      if(data.password == pwd.password)
      {

        let user = await db.getUserById("id, nome, cognome, indirizzo, dataN, mail", idUser)
        richiesta.session.userID = idUser
        user.role = 'paziente'
        console.log(user)
        risposta.send({status: 'success', data: user})

      }
      else
        risposta.send({status: 'failed', data: 'Password errata'})

    }
  }



})
