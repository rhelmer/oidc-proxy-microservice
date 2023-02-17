exports.up = function(knex) {
  return knex.schema.createTable("oidc_payloads", t => {
    t.string("id");
    t.integer("type");
    t.text("payload");
    t.string("grantId");
    t.string("userCode");
    t.string("uid");
    t.dateTime("expiresAt");
    t.dateTime("consumedAt");
    t.primary(["id", "type"]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("oidc_payloads");
};