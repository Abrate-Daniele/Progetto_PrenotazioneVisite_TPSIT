var express = require("express")
var db = require("./model/controller")
var app = express()
var porta = 8081

var expressSession = require("express-session")
const { provideAppInitializer } = require("@angular/core")

// Avvia il server HTTP
app.listen(porta, () => {
  console.log("Server avviato sulla porta " + porta)
})

// Abilita CORS verso il client Angular
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

app.use(express.json())

app.use(expressSession({
    secret: 'parolasegreta',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}))

// Termina la sessione lato server
app.post('/logout', (richiesta, risposta) => {
  richiesta.session.destroy(() => {
    risposta.send({ status: 'success' })
  })
})
// Autentica un utente in base al ruolo selezionato
app.post('/login', async (richiesta, risposta)=>{
  let data = richiesta.body

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

  let pwd = await db.getUserById("password", role.table, idUser)

  if(data.password == pwd.password)
  {
    let user = await db.getUserById(role.campi, role.table, idUser)
    richiesta.session.userID = idUser
    user.role = role.role
    risposta.send({status: 'success', data: user})

  }
  else
    risposta.send({status: 'failed', data: 'Password errata'})


})

// Registra un nuovo paziente
app.post('/register', async (richiesta, risposta) => {
  try {
    const data = richiesta.body
    const { nome, cognome, email, password, role, dataN } = data

    if (!nome || !cognome || !email || !password || !dataN) {
      return risposta.status(400).send({ status: 'failed', data: 'Dati mancanti per la registrazione' })
    }

    if (role !== 'paziente') {
      return risposta.status(400).send({ status: 'failed', data: 'La registrazione è consentita solo per i pazienti' })
    }

    const userData = {
      nome,
      cognome,
      mail: email,
      password,
      dataN,
      indirizzo: ''
    }

    const result = await db.createUser(userData)
    const newId = result.insertId

    const user = await db.getUserById('id, nome, cognome, indirizzo, dataN, mail', 'user', newId)
    user.role = 'paziente'

    richiesta.session.userID = newId

    risposta.send({ status: 'success', data: user })
  } catch (error) {
    console.error('Errore registrazione:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return risposta.status(400).send({ status: 'failed', data: 'Email già registrata' })
    }
    risposta.status(500).send({ status: 'failed', data: 'Errore durante la registrazione' })
  }
})

app.post('/updateProfile', async (richiesta, risposta) => {
  try {
    const data = richiesta.body
    const { id, role, nome, cognome, mail } = data

    if (!id || !role) {
      return risposta.status(400).send({ status: 'error', message: 'ID e ruolo sono obbligatori' })
    }

    let table = null

    switch (role) {
      case 'paziente':
        table = 'user'
        break
      case 'medico':
        table = 'dottori'
        break
      case 'admin':
        table = 'admin'
        break
      default:
        return risposta.status(400).send({ status: 'error', message: 'Ruolo non valido' })
    }

    const updates = {}
    if (nome !== undefined) {
      if (role === 'admin') {
        updates.utente = nome
      } else {
        updates.nome = nome
      }
    }
    if (cognome !== undefined && role !== 'admin') {
      updates.cognome = cognome
    }
    if (mail !== undefined) {
      updates.mail = mail
    }

    const result = await db.updateUserProfile(table, id, updates)

    if (result.affectedRows && result.affectedRows > 0) {
      risposta.send({ status: 'success' })
    } else {
      risposta.send({ status: 'failed', data: 'Nessuna modifica effettuata' })
    }
  } catch (error) {
    console.error("Errore nell'aggiornamento del profilo:", error)
    risposta.status(500).send({ status: 'error', message: 'Errore durante l\'aggiornamento del profilo' })
  }
})


app.post('/getVisiteByPaziente', async (richiesta, risposta)=>{
  let data = richiesta.body
  let idUser = data.pazienteId

  let visite = await db.getVisiteByAnyId('idUser', idUser)
  let ris = await parseVisite(visite)

  risposta.send({status: 'success', data: ris})
})

app.post('/getVisiteByMedico', async (richiesta, risposta)=>{
  let data = richiesta.body
  let idMedico = data.medicoId

  let visite = await db.getVisiteByAnyId('idMedico', idMedico)

  let ris = await parseVisite(visite)

  risposta.send({status: 'success', data: ris})
})

app.post('/getVisiteByReparto', async (richiesta, risposta)=>{
  let data = richiesta.body
  let rep = data.reparto

  let idReparto = await db.getIdRepartoByNome(rep)

  let visite = await db.getVisiteByAnyId('idRep', idReparto[0].id)

  let ris = await parseVisite(visite)

  risposta.send({status: 'success', data: ris})
})

app.post('/getVisiteByPazienteNP', async (richiesta, risposta)=>{
  let data = richiesta.body
  let idUser = data.pazienteId

  let visite = await db.getVisiteNonPagate(idUser)

  let ris = await parseVisite(visite)

  risposta.send({status: 'success', data: ris})
})

app.post('/getMediciByReparto', async (richiesta, risposta)=>{
  let data = richiesta.body
  let rep = data.reparto

  let idReparto = await db.getIdRepartoByNome(rep)

  let medici = await db.getMediciByIdRep(idReparto[0].id)
  //console.log(medici)

  risposta.send({status: 'success', data: medici})
})

app.post('/getAllReparti', async (richiesta, risposta)=>{
  let reparti = await db.getAllReparti()

  let repartiNomi = reparti.map(r => r.nomeRep)
  //console.log(repartiNomi)

  risposta.send({status: 'success', data: repartiNomi})
})

app.post('/createVisita', async (richiesta, risposta)=>{
  try {
    let data = richiesta.body;
    let result = await db.createVisita(data);
    risposta.send({status: 'success', data: result});
  } catch (error) {
    console.error('Errore nella creazione della visita:', error);
    risposta.status(400).send({status: 'error', message: error.message});
  }
})

app.post('/updateVisita', async (richiesta, risposta)=>{
  try {
    let data = richiesta.body;
    let id = data.id;
    let updates = {...data};
    delete updates.id;

    let result = await db.updateVisita(id, updates);

    risposta.send({status: 'success', data: result});
  } catch (error) {
    console.error('Errore nell\'aggiornamento della visita:', error);
    risposta.status(400).send({status: 'error', message: error.message});
  }
})

app.post('/deleteVisita', async (richiesta, risposta)=>{
  try {
    let data = richiesta.body;
    let result = await db.deleteVisita(data.id);
    risposta.send({status: 'success', data: result});
  } catch (error) {
    console.error('Errore nell\'eliminazione della visita:', error);
    risposta.status(400).send({status: 'error', message: error.message});
  }
})

app.post('/pagaVisita', async (richiesta, risposta)=>{
  try {
    let data = richiesta.body;
    let result = await db.pagaVisita(data.id);
    risposta.send({status: 'success', data: result});
  } catch (error) {
    console.error('Errore nel pagamento della visita:', error);
    risposta.status(400).send({status: 'error', message: error.message});
  }
})

app.post('/getSlotDisponibili', async (richiesta, risposta)=>{
  try {
    let data = richiesta.body;
    let medicoId = data.medicoId;
    let data_visita = data.data;

    let slotsDisponibili = await db.getSlotDisponibili(medicoId, data_visita);

    risposta.send({status: 'success', data: slotsDisponibili});
  } catch (error) {
    console.error('Errore nel recupero degli slot disponibili:', error);
    risposta.status(400).send({status: 'error', message: error.message});
  }
})


async function parseVisite(visite)
{
  let ris = []
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
    //console.log(visite[i])
    ris.push(visite[i])
  }

  return ris
}
