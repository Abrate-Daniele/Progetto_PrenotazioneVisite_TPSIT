var mysql = require("mysql")

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'Progetto_TPSIT'
});

connection.connect();

// Esegue una query MySQL e restituisce una Promise con i risultati
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

// Ritorna l'id utente dato l'email e la tabella (user/dottori/admin)
async function getUserByMail(mail, table) {
  let query = `SELECT id FROM ${table} WHERE mail = '${mail}' `
  let ris = await eseguiQuery(query)

  return ris[0]?.id
}

// Ritorna i campi richiesti per un utente dato l'id
async function getUserById(campi, table, id) {
  let query = `SELECT ${campi} FROM ${table} WHERE id = ${id}`
  let ris = await eseguiQuery(query)

  return ris[0]
}

// Crea un nuovo record nella tabella USER
async function createUser(user) {
  const query = `INSERT INTO user (nome, cognome, dataN, indirizzo, mail, password)
                 VALUES (${mysql.escape(user.nome)},
                         ${mysql.escape(user.cognome)},
                         ${mysql.escape(user.dataN)},
                         ${mysql.escape(user.indirizzo)},
                         ${mysql.escape(user.mail)},
                         ${mysql.escape(user.password)})`

  let ris = await eseguiQuery(query)
  return ris
}

// Aggiorna i campi base del profilo (nome, cognome, mail/utente)
async function updateUserProfile(table, id, updates) {
  let setClauses = []

  if (updates.nome !== undefined) {
    setClauses.push(`nome = ${mysql.escape(updates.nome)}`)
  }
  if (updates.cognome !== undefined) {
    setClauses.push(`cognome = ${mysql.escape(updates.cognome)}`)
  }
  if (updates.mail !== undefined) {
    setClauses.push(`mail = ${mysql.escape(updates.mail)}`)
  }
  if (updates.utente !== undefined) {
    setClauses.push(`utente = ${mysql.escape(updates.utente)}`)
  }

  if (!setClauses.length) {
    throw new Error('Nessun campo da aggiornare')
  }

  const query = `UPDATE ${table} SET ${setClauses.join(', ')} WHERE id = ${mysql.escape(id)}`

  let ris = await eseguiQuery(query)
  return ris
}

// Restituisce le visite filtrate per un campo (idUser, idMedico, idRep, ...)
async function getVisiteByAnyId(campo, valore) {
  let query = `SELECT idVis, DATE_FORMAT(data, '%Y-%m-%d') AS data, ora, idUser, idMedico, idRep, pagata, stato, note FROM visite WHERE ${campo} = ${valore} AND stato != 'D'`

  let ris = await eseguiQuery(query)

  return ris
}

// Restituisce l'id del reparto dato il nome
async function getIdRepartoByNome(nome) {
  let query = `SELECT id FROM reparti WHERE nomeRep = '${nome}'`

  let ris = await eseguiQuery(query)

  return ris
}

// Restituisce tutti i medici di un reparto
async function getMediciByIdRep(idRep) {
  let query = `SELECT id, nome, cognome FROM dottori WHERE idRep = ${idRep}`

  let ris = await eseguiQuery(query)

  return ris
}

// Restituisce tutti i reparti
async function getAllReparti() {
  let query = `SELECT id, nomeRep FROM reparti`

  let ris = await eseguiQuery(query)

  return ris
}

// Restituisce le visite non pagate di un paziente
async function getVisiteNonPagate(pazienteId) {
  let query = `SELECT idVis, DATE_FORMAT(data, '%Y-%m-%d') AS data, ora, idUser, idMedico, idRep, pagata, stato, note FROM visite WHERE idUser = ${pazienteId} AND pagata = FALSE AND stato != 'D'`

  let ris = await eseguiQuery(query)

  return ris
}

// Restituisce gli orari occupati di un medico in una data
async function getVisiteByMedicoEData(medicoId, data) {
  let query = `SELECT ora FROM visite WHERE idMedico = ${medicoId} AND data = '${data}' AND stato != 'D'`

  let ris = await eseguiQuery(query)

  return ris
}

// Crea una nuova visita nel database
async function createVisita(visita) {
  try {
    if (!visita.data || visita.ora === undefined || !visita.pazienteId || !visita.medicoId || !visita.reparto) {
      throw new Error('Dati mancanti: data, ora, pazienteId, medicoId e reparto sono obbligatori');
    }

    const repartiResult = await eseguiQuery(`SELECT id FROM reparti WHERE nomeRep = ${mysql.escape(visita.reparto)}`);
    if (!repartiResult.length) {
      throw new Error('Reparto non trovato');
    }
    const idRep = repartiResult[0].id;

    const query = `INSERT INTO visite (data, ora, idUser, idMedico, idRep, stato, pagata, note)
                   VALUES (${mysql.escape(visita.data)}, ${mysql.escape(visita.ora)},
                           ${mysql.escape(visita.pazienteId)}, ${mysql.escape(visita.medicoId)},
                           ${idRep}, ${mysql.escape(visita.stato || 'prenotata')},
                           ${visita.pagata ? 1 : 0}, ${mysql.escape(visita.note || '')})`;

    let ris = await eseguiQuery(query);
    return ris;
  } catch (error) {
    console.error('Errore nella creazione della visita:', error.message);
    throw error;
  }
}

// Aggiorna i campi di una visita esistente
async function updateVisita(id, updates) {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID visita non valido');
    }

    const fieldMap = {
      'data': 'data',
      'ora': 'ora',
      'note': 'note',
      'stato': 'stato',
      'pagata': 'pagata',
      'reparto': null,
    };

    let setClauses = [];

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'reparto') {
        const repartiResult = await eseguiQuery(`SELECT id FROM reparti WHERE nomeRep = ${mysql.escape(value)}`);
        if (repartiResult.length) {
          setClauses.push(`idRep = ${repartiResult[0].id}`);
        } else {
          throw new Error('Reparto non trovato');
        }
      } else if (key === 'medicoId') {
        setClauses.push(`idMedico = ${mysql.escape(value)}`);
      } else if (key === 'pazienteId') {
        setClauses.push(`idUser = ${mysql.escape(value)}`);
      } else if (fieldMap.hasOwnProperty(key)) {
        const dbField = fieldMap[key];
        if (typeof value === 'boolean') {
          setClauses.push(`${dbField} = ${value ? 1 : 0}`);
        } else {
          setClauses.push(`${dbField} = ${mysql.escape(value)}`);
        }
      }
    }

    if (!setClauses.length) {
      throw new Error('Nessun campo da aggiornare');
    }

    const query = `UPDATE visite SET ${setClauses.join(', ')} WHERE idVis = ${mysql.escape(id)}`;

    let ris = await eseguiQuery(query);
    return ris;
  } catch (error) {
    console.error('Errore nell\'aggiornamento della visita:', error.message);
    throw error;
  }
}

// Marca una visita come cancellata (soft delete)
async function deleteVisita(id) {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID visita non valido');
    }

    const query = `UPDATE visite SET stato = 'D' WHERE idVis = ${mysql.escape(id)}`;

    let ris = await eseguiQuery(query);
    return ris;
  } catch (error) {
    console.error('Errore nell\'eliminazione della visita:', error.message);
    throw error;
  }
}

// Segna una visita come pagata
async function pagaVisita(id) {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID visita non valido');
    }

    let query = `UPDATE visite SET pagata = 1 WHERE idVis = ${mysql.escape(id)}`;

    let ris = await eseguiQuery(query);

    return ris;
  } catch (error) {
    console.error('Errore nel pagamento della visita:', error.message);
    throw error;
  }
}

// Restituisce gli slot orari liberi per un medico in una certa data
async function getSlotDisponibili(medicoId, data) {
  try {
    if (!medicoId || !data || isNaN(medicoId)) {
      throw new Error('medicoId e data sono obbligatori');
    }

    const oreOcc = await eseguiQuery(
      `SELECT ora FROM visite WHERE idMedico = ${mysql.escape(medicoId)}
       AND data = ${mysql.escape(data)} AND stato != 'D'`
    );

    const allSlots = [0, 1, 2, 3, 4, 5, 6, 7];

    const slotsDisponibili = allSlots.filter(slot =>
      !oreOcc.some(occ => occ.ora === slot)
    );

    return slotsDisponibili;
  } catch (error) {
    console.error('Errore nel recupero degli slot disponibili:', error.message);
    throw error;
  }
}



module.exports = {
  getUserByMail,
  getUserById,
  getVisiteByAnyId,
  getIdRepartoByNome,
  getMediciByIdRep,
  getAllReparti,
  getVisiteNonPagate,
  createVisita,
  updateVisita,
  deleteVisita,
  pagaVisita,
  getVisiteByMedicoEData,
  getSlotDisponibili,
  createUser,
  updateUserProfile
}
