const mysql = require("mysql")

const connection = mysql.createConnection({
  user: "root",
  password: "manager",
  host: "localhost",
  port: 3306,
  database: "Tiffinwala",
})

connection.connect()

module.exports = connection