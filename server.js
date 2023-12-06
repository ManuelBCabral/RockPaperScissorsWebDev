const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql2');

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Dakar2002kc!",
  database: "rockpaperscissors",
  connectionLimit:10
});