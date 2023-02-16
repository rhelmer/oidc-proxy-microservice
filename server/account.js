/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This needs to be a DB
const db = new Map();

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

async function findOidcSub(sub) {
  return db.get(sub);
}

async function addOidcSubHandler(sub, accountId) {
  db.set(sub, accountId);
}

export default {
  findAccount,
  findOidcSub,
  addOidcSubHandler,
};