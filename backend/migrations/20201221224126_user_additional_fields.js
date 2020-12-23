exports.up = function (knex) {
  return knex.raw(`
  alter table users
  add column "tkoAlyUserId" int,
  add column email varchar(512),
  add column role varchar(128);
  `)
}

exports.down = function (knex) {}

exports.config = { transactions: false }
