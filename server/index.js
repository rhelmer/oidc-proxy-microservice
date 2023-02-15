/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as path from 'node:path';
import * as url from 'node:url';

import {
  dirname
} from 'desm';
import express from 'express';
import helmet from 'helmet';
import https from 'https';

import env from './env.js';
import configuration from './support/configuration.js';
import routes from './routes.js';
import providerHelper from './provider.js';

const app = express();

const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
delete directives['form-action'];
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives,
  },
}));

const __dirname = dirname(import.meta.url);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable('trust proxy');

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

const provider = providerHelper.create(env.ISSUER, configuration);
routes(app, provider, providerHelper.errors.SessionNotFound);
app.use(provider.callback());

app.listen(env.PORT);