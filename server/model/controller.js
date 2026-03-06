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
  let query = `SELECT idVIs, DATE_FORMAT(data, '%Y-%m-%d') AS data, ora, idUser, idMedico, idRep, pagata, stato, note FROM visite WHERE ${campo} = ${valore} AND stato != 'D'`

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
  let query = `SELECT ora FROM visite WHERE idMedico = ${medicoId} AND data = '${data}' AND stato != 'D'`

  let ris = await eseguiQuery(query)
  console.log(ris)

  return ris
}

async function createVisita(visita) {
  try {
    // Validazione dei dati obbligatori
    if (!visita.data || visita.ora === undefined || !visita.pazienteId || !visita.medicoId || !visita.reparto) {
      throw new Error('Dati mancanti: data, ora, pazienteId, medicoId e reparto sono obbligatori');
    }

    // Ottieni l'idRep dal nome del reparto
    const repartiResult = await eseguiQuery(`SELECT id FROM reparti WHERE nomeRep = ${mysql.escape(visita.reparto)}`);
    if (!repartiResult.length) {
      throw new Error('Reparto non trovato');
    }
    const idRep = repartiResult[0].id;

    // Inserisce la nuova visita (senza colonne derivate che sono calcolate dal client)
    const query = `INSERT INTO visite (data, ora, idUser, idMedico, idRep, stato, pagata, note)
                   VALUES (${mysql.escape(visita.data)}, ${mysql.escape(visita.ora)},
                           ${mysql.escape(visita.pazienteId)}, ${mysql.escape(visita.medicoId)},
                           ${idRep}, ${mysql.escape(visita.stato || 'prenotata')},
                           ${visita.pagata ? 1 : 0}, ${mysql.escape(visita.note || '')})`;

    let ris = await eseguiQuery(query);
    console.log('Visita creata:', ris);
    return ris;
  } catch (error) {
    console.error('Errore nella creazione della visita:', error.message);
    throw error;
  }
}

async function updateVisita(id, updates) {
  try {
    // Validazione: l'id deve essere un numero
    if (!id || isNaN(id)) {
      throw new Error('ID visita non valido');
    }

    // Campi mappati da client a database
    const fieldMap = {
      'data': 'data',
      'ora': 'ora',
      'note': 'note',
      'stato': 'stato',
      'pagata': 'pagata',
      'reparto': null, // Gestito separatamente
    };

    let setClauses = [];

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'reparto') {
        // Se cambia il reparto, aggiorna anche l'idRep
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
      // Ignora i campi che non sono nel fieldMap (come medicoNome, pazienteCognome, etc.)
    }

    if (!setClauses.length) {
      throw new Error('Nessun campo da aggiornare');
    }

    const query = `UPDATE visite SET ${setClauses.join(', ')} WHERE idVis = ${mysql.escape(id)}`;

    let ris = await eseguiQuery(query);
    console.log('Visita aggiornata:', ris);
    return ris;
  } catch (error) {
    console.error('Errore nell\'aggiornamento della visita:', error.message);
    throw error;
  }
}

async function deleteVisita(id) {
  try {
    // Validazione: l'id deve essere un numero
    if (!id || isNaN(id)) {
      throw new Error('ID visita non valido');
    }

    // Soft delete: marca la visita come cancellata con stato 'C'
    const query = `UPDATE visite SET stato = 'D' WHERE idVis = ${mysql.escape(id)}`;

    let ris = await eseguiQuery(query);
    console.log('Visita cancellata:', ris);
    return ris;
  } catch (error) {
    console.error('Errore nell\'eliminazione della visita:', error.message);
    throw error;
  }
}

async function pagaVisita(id) {
  try {
    // Validazione: l'id deve essere un numero
    if (!id || isNaN(id)) {
      throw new Error('ID visita non valido');
    }

    let query = `UPDATE visite SET pagata = 1 WHERE idVis = ${mysql.escape(id)}`;

    let ris = await eseguiQuery(query);
    console.log('Visita pagata:', ris);

    return ris;
  } catch (error) {
    console.error('Errore nel pagamento della visita:', error.message);
    throw error;
  }
}

async function getSlotDisponibili(medicoId, data) {
  try {
    // Validazione dei dati
    if (!medicoId || !data || isNaN(medicoId)) {
      throw new Error('medicoId e data sono obbligatori');
    }

    // Ottieni gli slot già prenotati per questo medico in questa data
    const oreOcc = await eseguiQuery(
      `SELECT ora FROM visite WHERE idMedico = ${mysql.escape(medicoId)}
       AND data = ${mysql.escape(data)} AND stato != 'D'`
    );

    // Tutti gli slot orari disponibili
    const allSlots = [0, 1, 2, 3, 4, 5, 6, 7];

    // Filtra gli slot disponibili (quelli non prenotati)
    const slotsDisponibili = allSlots.filter(slot =>
      !oreOcc.some(occ => occ.ora === slot)
    );

    console.log('Slot disponibili:', slotsDisponibili);
    return slotsDisponibili;
  } catch (error) {
    console.error('Errore nel recupero degli slot disponibili:', error.message);
    throw error;
  }
}



module.exports = {getUserByMail, getUserById, getVisiteByAnyId, getIdRepartoByNome, getMediciByIdRep, getAllReparti, getVisiteNonPagate, createVisita, updateVisita, deleteVisita, pagaVisita, getVisiteByMedicoEData, getSlotDisponibili}
