/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as url from 'node:url';

import oidc from './oidc.js';
import env from './env.js';
import {
  strict as assert
} from 'node:assert';

export default (app, provider, SessionNotFound) => {
  function setNoCache(req, res, next) {
    res.set('cache-control', 'no-store');
    next();
  }

  app.get('/interaction/callback', setNoCache, async (req, res, next) => {
    res.redirect(url.format({
      pathname: `/interaction/${req.session.uid}/callback`,
      query: req.query
    }));
  });

  app.get('/interaction/:uid', setNoCache, async (req, res, next) => {
    try {
      const {
        uid,
        prompt,
        params,
      } = await provider.interactionDetails(req, res);

      switch (prompt.name) {
        case 'login': {
          req.session.uid = uid;
          req.session.state = params.state;

          res.redirect(oidc.authorizationUrl({
            redirect_uri: url.format({
              protocol: req.protocol,
              host: req.get('host'),
              pathname: '/interaction/callback',
            }),
            state: params.state,
            scope: params.scope,
            response_type: params.response_type,
          }));
          break;
        }

        case 'consent': {
          const client = await provider.Client.find(params.client_id);
          return res.render('consent', {
            uid,
            userinfo: req.session.userinfo,
          });
        }

        default:
          return undefined;
      }
    } catch (err) {
      return next(err);
    }
  });

  app.get('/interaction/:uid/callback', setNoCache, async (req, res, next) => {
    try {
      const {
        prompt: {
          name
        }
      } = await provider.interactionDetails(req, res);
      assert.equal(name, 'login');

      const tokenSet = await oidc.callback(req);
      const userinfo = await oidc._client.userinfo(tokenSet.access_token);

      if (!(env.OIDC_UNIQUE_FIELD in userinfo)) {
        throw new Error(`Unable to use "${env.OIDC_UNIQUE_FIELD}" as unique field`);
      }

      const result = {
        login: {
          accountId: userinfo[env.OIDC_UNIQUE_FIELD],
        },
      };

      req.session.userinfo = userinfo;

      await provider.interactionFinished(req, res, result, {
        mergeWithLastSubmission: false
      });
    } catch (err) {
      next(err);
    }
  });

  app.post('/interaction/:uid/confirm', setNoCache, async (req, res, next) => {
    try {
      const interactionDetails = await provider.interactionDetails(req, res);
      const {
        prompt: {
          name,
          details
        },
        params,
        session: {
          accountId
        }
      } = interactionDetails;
      assert.equal(name, 'consent');

      let {
        grantId
      } = interactionDetails;
      let grant;

      if (grantId) {
        // we'll be modifying existing grant in existing session
        grant = await provider.Grant.find(grantId);
      } else {
        // we're establishing a new grant
        grant = new provider.Grant({
          accountId,
          clientId: params.client_id,
        });
      }

      if (details.missingOIDCScope) {
        grant.addOIDCScope(details.missingOIDCScope.join(' '));
      }
      if (details.missingOIDCClaims) {
        grant.addOIDCClaims(details.missingOIDCClaims);
      }
      if (details.missingResourceScopes) {
        for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
          grant.addResourceScope(indicator, scopes.join(' '));
        }
      }

      grantId = await grant.save();

      const consent = {};
      if (!interactionDetails.grantId) {
        // we don't have to pass grantId to consent, we're just modifying existing one
        consent.grantId = grantId;
      }

      const result = {
        consent
      };
      await provider.interactionFinished(req, res, result, {
        mergeWithLastSubmission: true
      });
    } catch (err) {
      next(err);
    }
  });

  app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
    try {
      const result = {
        error: 'access_denied',
        error_description: 'End-User aborted interaction',
      };
      await provider.interactionFinished(req, res, result, {
        mergeWithLastSubmission: false
      });
    } catch (err) {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err instanceof SessionNotFound) {
      // handle interaction expired / session not found error
    }
    next(err);
  });
};