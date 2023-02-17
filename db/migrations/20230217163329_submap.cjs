exports.up = function(knex) {
  return knex.schema.createTable("sub_to_account", t => {
    t.string("sub").primary().unique();
    t.string("account").primary().unique();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("sub_to_account");
};