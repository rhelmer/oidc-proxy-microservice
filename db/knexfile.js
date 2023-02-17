/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import env from '../server/env.js';

export default {
  client: env.DB_CLIENT,
  connection: env.DB_CONNECTION,
  useNullAsDefault: true,
  migrations: {
    directory: "migrations"
  },
}