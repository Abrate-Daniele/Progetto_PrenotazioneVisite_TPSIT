var mysql = require("mysql")

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'Progetto_TPSIT'
});

connection.connect();

async function eseguiQuery(query){
    return new Promise((risolta, respinta)=>{
        connection.query(query,
            function (error, results, fields) {
                if(error)
                    respinta(error)
                else
                    risolta(results)
        });
    })
}

async function getUserByMail(mail, table) {
  let query = `SELECT id FROM ${table} WHERE mail = '${mail}' `
  let ris = await eseguiQuery(query)
  //console.log(ris)
  return ris[0]?.id
}

async function getUserById(campi, table, id) {
  let query = `SELECT ${campi} FROM ${table} WHERE id = ${id}`
  let ris = await eseguiQuery(query)
  //console.log(ris)
  return ris[0]
}

async function getVisiteByAnyId(campo, valore) {
  let query = `SELECT * FROM visite WHERE ${campo} = ${valore}`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}

async function getIdRepartoByNome(nome) {
  let query = `SELECT id FROM reparti WHERE nomeRep = '${nome}'`

  let ris = await eseguiQuery(query)
  console.log(ris)


  return ris
}

async function getMediciByIdRep(idRep) {
  let query = `SELECT id, nome, cognome FROM dottori WHERE idRep = ${idRep}`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}

async function getAllReparti() {
  let query = `SELECT id, nomeRep FROM reparti`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}

async function getVisiteNonPagate(pazienteId) {
  let query = `SELECT ora FROM visite WHERE idUser = ${pazienteId} AND pagata = false AND stato = 'prenotata'`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}

async function getVisiteByMedicoEData(medicoId, data) {
  let query = `SELECT ora FROM visite WHERE idMedico = ${medicoId} AND data = '${data}'`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}

async function createVisita(visita) {
  let query = `INSERT INTO visite (data, ora, idUser, idMedico, idRep, stato, pagata, importo, note)
               VALUES ('${visita.data}', ${visita.ora}, ${visita.pazienteId}, ${visita.medicoId},
               (SELECT id FROM reparti WHERE nomeRep = '${visita.reparto}'),
               '${visita.stato}', ${visita.pagata ? 1 : 0}, ${visita.importo}, '${visita.note || ''}')`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}

async function updateVisita(id, updates) {
  let setClauses = Object.entries(updates).map(([key, value]) => {
    if (key === 'reparto') {
      return `idRep = (SELECT id FROM reparti WHERE nomeRep = '${value}')`
    }
    if (typeof value === 'string') {
      return `${key} = '${value}'`
    }
    if (typeof value === 'boolean') {
      return `${key} = ${value ? 1 : 0}`
    }
    return `${key} = ${value}`
  }).join(', ')

  let query = `UPDATE visite SET ${setClauses} WHERE id = ${id}`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}

async function deleteVisita(id) {
  let query = `UPDATE visite SET stato = 'D' WHERE id = ${id}`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}

async function pagaVisita(id) {
  let query = `UPDATE visite SET pagata = true WHERE id = ${id}`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}



module.exports = {getUserByMail, getUserById, getVisiteByAnyId, getIdRepartoByNome, getMediciByIdRep, getAllReparti, getVisiteNonPagate, createVisita, updateVisita, deleteVisita, pagaVisita, getVisiteByMedicoEData}
