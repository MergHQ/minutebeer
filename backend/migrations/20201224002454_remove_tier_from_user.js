exports.up = function (knex) {
  knex.raw(`alter table users drop column tier;`)
}

exports.down = function (knex) {}
