const mysql = require("mysql")
const fs = require("fs")
const path = require("path")

class SqlConnection {
  constructor(db, user, password, host, callback) {
    this.callback = callback
    this.db_name = db
    this.connected = false
    this.config = {
      database: db,
      user: user,
      password: password,
      host: host || "localhost",
    }

    this.connection = mysql.createConnection(this.config)

    this.connect()
  }

  setupNoDbConnection() {
    delete this.config.database
    this.connection = mysql.createConnection(this.config)
    this.createDB(this.db_name)
  }

  connect() {
    this.connection.connect((err) => {
      if (err) {
        switch (err.errno) {
          case 1049:
            console.log(
              "\x1b[31m",
              `${this.db_name} does not exist, creating database ${this.db_name}...`
            )

            this.setupNoDbConnection()
            break
          default:
            console.log("\x1b[31m", err.sqlMessage)
        }
      } else {
        console.log(
          "\x1b[32m",
          `Connected to mysql database: ${this.connection.config.database}`
        )

        this.prototype.query = this.connection.query
        this.callback(null)
      }
    })
  }

  /**
   *
   * @param {string} query      Query string to run with seed
   * @param {object} options    Options to pass to the seed method
   * @param options.drop        If true drops the database before seeding
   * @param options.fileName    If file then read the query string from the file
   *
   * Seed the database for intial setup or for testing.
   * WARNING: If drop is passed as an option then seed() will drop
   * the database before seeding.
   */
  seed(options = {}) {
    let db = this.connection.config.database

    if (options.drop) {
      console.log("\x1b[31m", "Dropping database ", db)
      this.connection.query(`DROP DATABASE IF EXISTS ${db}`)
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
          }
        }
      )
    }
  }

  /**
   *
   * @param {string} db_name  name of the database to make
   *
   * Creates a database on the mysql server
   */
  createDB(db_name) {
    this.connection.query(`CREATE DATABASE ${db_name}`, (err, result) => {
      if (!err) {
        this.connection.changeUser({ database: this.db_name }, (err) => {
          if (!err) {
            console.log("\x1b[32m", `${this.db_name} was successfully created.`)
            this.callback(null)
          } else {
            console.log(
              "\x1b[31m",
              "Could not automatically set the database. Killing connection."
            )
            this.connection.end()
          }
        })
      } else {
        this.connection.end()
        console.log("\x1b[31m", "Error creating database", err)
      }
    })
  }
}

module.exports = {
  SqlConnection,
}
