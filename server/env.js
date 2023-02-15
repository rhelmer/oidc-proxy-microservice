/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as dotenv from "dotenv";
dotenv.config();

const ENVIRONMENT_VARIABLES = [
  // OIDC Provider settings
  "OIDCP_PORT",
  "OIDCP_ISSUER",
  "OIDCP_CLIENT_ID",
  "OIDCP_CLIENT_SECRET",
  "OIDCP_REDIRECT_URIS",
  "OIDCP_ALLOW_HTTP_REQUESTS",

  // OIDC Client settings
  "OIDC_ISSUER",
  "OIDC_CLIENT_ID",
  "OIDC_CLIENT_SECRET",
  "OIDC_REDIRECT_URIS",
];

const config = {};

for (const v of ENVIRONMENT_VARIABLES) {
  if (!(v in process.env)) {
    throw new Error(`Required environment variable was not set: ${v}`);
  }

  config[v] = process.env[v];
}

Object.freeze(config);
export default config;
