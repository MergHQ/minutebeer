const pg = require('pg')
const dotenv = require('dotenv')

dotenv.config()

const connection = new pg.Connection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432
})

connection.query('CREATE DATABASE karhu;')
