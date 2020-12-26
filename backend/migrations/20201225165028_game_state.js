exports.up = function (knex) {
  return knex.raw('alter table games add column state int not null default 0')
}

exports.down = function (knex) {}
