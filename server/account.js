/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import knex from "./knex.js";

async function findAccount(ctx, sub, token) {
  return {
    accountId: sub,
    async claims(use, scope, claims, rejected) {
      return {
        sub
      };
    },
  };
}

async function findAccountFromSub(sub) {
  return knex("sub_to_account").select("account").where("sub", sub);
}

async function addSubAndAccount(sub, account) {
  try {
    await knex("sub_to_account").insert({
      sub,
      account
    })
    return true;
  } catch (e) {
    return false;
  }
}

export default {
  findAccount,
  findAccountFromSub,
  addSubAndAccount,
};