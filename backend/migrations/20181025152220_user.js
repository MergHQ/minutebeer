exports.up = function (knex) {
  return knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', function (table) {
        table.string('id').primary()
        table.string('nickname')
        table.integer('tier')
      })
    }
  })
}

exports.down = function (knex) {}

exports.config = { transactions: false }
