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

async function getUserByMail(mail) {
  let query = `SELECT id FROM user WHERE mail = '${mail}' `
  let ris = await eseguiQuery(query)
  console.log(ris)
  return ris[0]?.id
}

async function getUserById(campi, id) {
  let query = `SELECT ${campi} FROM user WHERE id = ${id}`
  let ris = await eseguiQuery(query)
  console.log(ris)
  return ris[0]
}


module.exports = {getUserByMail, getUserById}
