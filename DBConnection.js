const mysql = require('mysql')

const ConnectDB = (callback) => {
  var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'smartapp'
  })
  connection.connect((error) => {
    if (error) {
      console.error('Error in connecting with DB: ' + error.message)
      // callback(isSuccess = false, errorObject)
      return callback(false, error)
    } else {
      console.log('Connected with ID: ' + connection.threadId)
      // callback(isSuccess = true, connectionObject)
      return callback(true, connection)
    }
  })

}

module.exports = ConnectDB