const sqlite3 = require('sqlite3').verbose()

const ConnectDB = (callback) => {
  const DBSOURCE = "SmartAppDB.sqlite"
  let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
      console.log('Connected to the SQLite database.')
      return callback(true, db)
    }
  });
}

module.exports = ConnectDB