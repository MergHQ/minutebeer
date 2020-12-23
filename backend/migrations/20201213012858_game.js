exports.up = function (knex) {
  return knex.schema.hasTable('games').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('games', function (table) {
        table.string('id').primary()
        table.integer('max_minutes')
        table.integer('current_minutes')
      })
    }
  })
}

exports.down = function (knex) {}

exports.config = { transactions: false }
