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


app.post('/getVisiteByPaziente', async (richiesta, risposta)=>{
  let data = richiesta.body
  let idUser = data.pazienteId

  let visite = await db.getVisiteByAnyId('idUser', idUser)
  let ris = []

  for(let i = 0; i < visite.length; i++)
  {
    console.log(visite[i].data.toDateString())

    let user = await db.getUserById('nome, cognome', 'user', visite[i].idUser)
    visite[i].pazienteNome = user.nome
    visite[i].pazienteCognome = user.cognome

    let dottore = await db.getUserById('nome, cognome, costo', 'dottori', visite[i].idMedico)
    visite[i].medicoNome = dottore.nome
    visite[i].medicoCognome = dottore.cognome
    visite[i].importo = dottore.costo

    let reparto = await db.getUserById('nomeRep', 'reparti', visite[i].idRep)

    visite[i].reparto = reparto.nomeRep
    console.log(visite[i])
    ris.push(visite[i])
  }


  risposta.send({status: 'success', data: ris})
})

app.post('/getVisiteByMedico', async (richiesta, risposta)=>{
  let data = richiesta.body
  let idMedico = data.medicoId

  let visite = await db.getVisiteByAnyId('idMedico', idMedico)
  let ris = []
  console.log(visite)
  for(let i = 0; i < visite.length; i++)
  {

    let user = await db.getUserById('nome, cognome', 'user', visite[i].idUser)
    visite[i].pazienteNome = user.nome
    visite[i].pazienteCognome = user.cognome

    let dottore = await db.getUserById('nome, cognome, costo', 'dottori', visite[i].idMedico)
    visite[i].medicoNome = dottore.nome
    visite[i].medicoCognome = dottore.cognome
    visite[i].importo = dottore.costo

    let reparto = await db.getUserById('nomeRep', 'reparti', visite[i].idRep)

    visite[i].reparto = reparto.nomeRep
    console.log(visite[i])
    ris.push(visite[i])
  }


  risposta.send({status: 'success', data: ris})
})

app.post('/getVisiteByPazienteNP', async (richiesta, risposta)=>{

})

app.post('/getVisiteByPaziente', async (richiesta, risposta)=>{

})
