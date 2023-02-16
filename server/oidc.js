/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as openIdClient from 'openid-client';
import env from './env.js';

class Client {
  async initialize() {
    const issuer = await openIdClient.Issuer.discover(env.OIDC_ISSUER);

    this._client = new issuer.Client({
      client_id: env.OIDC_CLIENT_ID,
      client_secret: env.OIDC_CLIENT_SECRET,
      redirect_uris: [env.OIDC_CALLBACK],
      response_types: ['code'],
    });
  }

  authorizationUrl(parameters) {
    return this._client.authorizationUrl(parameters);
  }

  async callback(req) {
    const params = this._client.callbackParams(req);
    return await this._client.callback(env.OIDC_CALLBACK, params, {
      state: req.session.state
    });
  }
};

const oidc = new Client();
export default oidc;