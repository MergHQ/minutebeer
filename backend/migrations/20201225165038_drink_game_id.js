exports.up = function (knex) {
  return knex.raw(
    'alter table user_drinks add column "gameId" varchar(256) references games(id);'
  )
}

exports.down = function (knex) {}
