/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Provider from 'oidc-provider';

export default {
  errors: Provider.errors,

  create(issuer, configuration) {
    const provider = new Provider.default(issuer, {
      ...configuration
    });
    provider.proxy = true;

    /* TODO
     * This list of events has to be:
     * - removed
     * - converted to glean events
     */
    provider.on("access_token.destroyed", (token) => console.log("access_token.destroyed"));
    provider.on("access_token.saved", (token) => console.log("access_token.saved"));
    provider.on("access_token.issued", (token) => console.log("access_token.issued"));
    provider.on("authorization_code.consumed", (code) => console.log("authorization_code.consumed"));
    provider.on("authorization_code.destroyed", (code) => console.log("authorization_code.destroyed"));
    provider.on("authorization_code.saved", (code) => console.log("authorization_code.saved"));
    provider.on("authorization.accepted", (ctx) => console.log("authorization.accepted"));
    provider.on('authorization.error', (ctx, err) => console.log("authorization.error", err));
    provider.on("authorization.success", (ctx) => console.log("authorization.success"));
    provider.on('backchannel.error', (ctx, err) => console.log("backchannel.error", err));
    provider.on("backchannel.success", (ctx) => console.log("backchannel.success"));
    provider.on("jwks.success", (ctx) => console.log("jwks.success"));
    provider.on('jwks.error', (ctx, err) => console.log("jwks.error"));
    provider.on("client_credentials.destroyed", (token) => console.log("client_credentials.destroyed"));
    provider.on("client_credentials.saved", (token) => console.log("client_credentials.saved"));
    provider.on("client_credentials.issued", (token) => console.log("client_credentials.issued"));
    provider.on("device_code.consumed", (code) => console.log("device_code.consumed"));
    provider.on("device_code.destroyed", (code) => console.log("device_code.destroyed"));
    provider.on("device_code.saved", (code) => console.log("device_code.saved"));
    provider.on('discovery.error', (ctx, err) => console.log("discovery.error"));
    provider.on('end_session.error', (ctx, err) => console.log("end_session.error"));
    provider.on("end_session.success", (ctx) => console.log("end_session.success"));
    provider.on('grant.error', (ctx, err) => console.log("grant.error"));
    provider.on("grant.revoked", (ctx, grantId) => console.log("grant.revoked"));
    provider.on("grant.success", (ctx) => console.log("grant.success"));
    provider.on("initial_access_token.destroyed", (token) => console.log("initial_access_token.destroyed"));
    provider.on("initial_access_token.saved", (token) => console.log("initial_access_token.saved"));
    provider.on("interaction.destroyed", (interaction) => console.log("interaction.destroyed"));
    provider.on("interaction.ended", (ctx) => console.log("interaction.ended"));
    provider.on("interaction.saved", (ctx) => console.log("interaction.saved"));
    provider.on("interaction.started", (ctx, error) => console.log("interaction.started"));
    provider.on('introspection.error', (ctx, err) => console.log("introspection.error"));
    provider.on("replay_detection.destroyed", (token) => console.log("replay_detection.destroyed"));
    provider.on("replay_detection.saved", (token) => console.log("replay_detection.saved"));
    provider.on('pushed_authorization_request.error', (ctx, err) => console.log("pushed_authorization_request.error"));
    provider.on("pushed_authorization_request.success", (ctx, client) => console.log("pushed_authorization_request.success"));
    provider.on("pushed_authorization_request.destroyed", (token) => console.log("pushed_authorization_request.destroyed"));
    provider.on("pushed_authorization_request.saved", (token) => console.log("pushed_authorization_request.saved"));
    provider.on("refresh_token.consumed", (token) => console.log("refresh_token.consumed"));
    provider.on("refresh_token.destroyed", (token) => console.log("refresh_token.destroyed"));
    provider.on("refresh_token.saved", (token) => console.log("refresh_token.saved"));
    provider.on("registration_access_token.destroyed", (token) => console.log("registration_access_token.destroyed"));
    provider.on("registration_access_token.saved", (token) => console.log("registration_access_token.saved"));
    provider.on('registration_create.error', (ctx, err) => console.log("registration_create.error"));
    provider.on("registration_create.success", (ctx, client) => console.log("registration_create.success"));
    provider.on('registration_delete.error', (ctx, err) => console.log("registration_delete.error"));
    provider.on("registration_delete.success", (ctx, client) => console.log("registration_delete.success"));
    provider.on('registration_read.error', (ctx, err) => console.log("registration_read.error"));
    provider.on("registration_read.success", (ctx, client) => console.log("registration_read.success"));
    provider.on('registration_update.error', (ctx, err) => console.log("registration_update.error"));
    provider.on("registration_update.success", (ctx, client) => console.log("registration_update.success"));
    provider.on('revocation.error', (ctx, err) => console.log("revocation.error"));
    provider.on('server.error', (ctx, err) => console.log("server.error"));
    provider.on("session.destroyed", (session) => console.log("session.destroyed"));
    provider.on("session.saved", (session) => console.log("session.saved"));
    provider.on('userinfo.error', (ctx, err) => console.log("userinfo.error"));

    return provider;
  }
};