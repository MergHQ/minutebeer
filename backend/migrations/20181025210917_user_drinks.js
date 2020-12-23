exports.up = function (knex) {
  return knex.schema.hasTable('user_drinks').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('user_drinks', function (table) {
        table.string('id').primary()
        table.integer('drinkType')
        table.string('userId')
      })
    }
  })
}

exports.down = function (knex) {}

exports.config = { transactions: false }
