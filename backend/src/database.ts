import knex from 'knex'

const db = knex({
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  client: 'pg',
  dialect: 'pg',
})

export default db
