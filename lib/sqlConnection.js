const mysql = require("mysql")
const cTable = require("console.table")
const inquirer = require("inquirer")

// module.exports = class SqlCon {
class SqlCon {
  constructor(options, startApp) {
    this.config = {
      database: options.db || "employees_db",
      user: options.user || "root",
      password: options.password || "password",
      host: options.host || "localhost",
    }

    this.connection = mysql.createConnection(this.config)

    this.connection.connect((err) => {
      if (err) {
        console.log("\x1b[31m", "Error connecting to the database.")
      } else {
        console.log(
          "\x1b[32m",
          `Welcome!\n Connected to database: ${this.connection.config.database} \n \n *************************************************`
        )

        startApp()
      }
    })
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

const sqlConn = generateNewConnection()

function generateNewConnection() {
  console.log("CREATEING NEW CONNECTION")
  return new SqlCon({}, () => console.log("Connected"))
}

module.exports = sqlConn
