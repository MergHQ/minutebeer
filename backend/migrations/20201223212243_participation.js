exports.up = function (knex) {
  return knex.raw(`
    create table participation(
      "userId" varchar(256) not null,
      "gameId" varchar(256) not null,
      tier int not null,
      constraint fk_user foreign key ("userId") references users(id),
      constraint fk_game foreign key ("gameId") references games(id)
    )`)
}

exports.down = function (knex) {}
