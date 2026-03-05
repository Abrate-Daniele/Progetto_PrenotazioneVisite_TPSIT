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
  let test = []

  return ris
}


module.exports = {getUserByMail, getUserById, getVisiteByAnyId}
