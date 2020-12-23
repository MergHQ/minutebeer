exports.up = function (knex) {
  knex.raw(`alter table users remove column tier;`)
}

exports.down = function (knex) {}
