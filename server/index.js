/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as path from 'node:path';
import * as url from 'node:url';

import express from 'express';
import session from 'express-session';
import helmet from 'helmet';

import {
  dirname
} from 'desm';
import env from './env.js';
import configuration from './configuration.js';
import routes from './routes.js';
import providerHelper from './provider.js';
import oidc from './oidc.js';

await oidc.initialize();

const app = express();
const __dirname = dirname(import.meta.url);
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.enable('trust proxy');

const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
delete directives['form-action'];
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives,
  },
}));

const sessionParams = {
  secret: env.OIDCP_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {},
};

if (!env.OIDCP_ALLOW_HTTP_REQUESTS) {
  sessionParams.cooke.secure = true;

  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else if (req.method === 'GET' || req.method === 'HEAD') {
      res.redirect(url.format({
        protocol: 'https',
        host: req.get('host'),
        pathname: req.originalUrl,
      }));
    } else {
      res.status(400).json({
        error: 'invalid_request',
        error_description: 'do yourself a favor and only use https',
      });
    }
  });
}

app.use(session(sessionParams))

const provider = providerHelper.create(env.OIDCP_ISSUER, configuration);
routes(app, provider, providerHelper.errors.SessionNotFound);
app.use(provider.callback());

app.listen(env.OIDCP_PORT);