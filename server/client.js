/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as oidc from 'openid-client';
import env from './env.js';

class Client {
  async initialize() {
    const issuer = await oidc.Issuer.discover(env.OIDC_ISSUER);

    this._client = new issuer.Client({
      client_id: env.OIDC_CLIENT_ID,
      client_secret: env.OIDC_CLIENT_SECRET,
      redirect_uris: env.OIDC_REDIRECT_URIS.split("|"),
      response_types: ['code'],
    });
  }

  url() {
    const code_verifier = oidc.generators.codeVerifier();
    const code_challenge = oidc.generators.codeChallenge(code_verifier);

    return this._client.authorizationUrl({
      scope: 'openid email profile',
      resource: 'https://my.api.example.com/resource/32178',
      code_challenge,
      code_challenge_method: 'S256',
    });
  }
};

const client = new Client();
export default client;
