const mysql = require("mysql")

class SqlCon {
  constructor(options, callback) {
    this.config = {
      database: options.db || "employees_db2",
      user: options.user || "root",
      password: options.password || "password",
      host: options.host || "localhost",
    }

    this.connection = mysql.createConnection(this.config)

    this.connection.connect()
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      })
    })
  }

  seedDB(options) {
    if (options.drop) {
      console.log("\x1b[31m", "Dropping database ", options.drop)
      this.connection.query(`DROP DATABASE IF EXISTS ${options.drop}`)
    }
    if (options.fileName) {
      this.connection.query(
        fs.readFileSync(path.join(__dirname, options.fileName), "utf8"),
        (err, result) => {
          if (err) {
            console.log(
              "\x1b[31m",
              "Error seeding the database: ",
              err.sqlMessage,
              "\n Ending db connection..."
            )
            this.connection.end()
          } else {
            console.log("\x1b[32m", "Seed complete")
            return true
          }
        }
      )
    }
  }
}

const sqlConn = new SqlCon({})

module.exports = {
  sqlConn,
}
