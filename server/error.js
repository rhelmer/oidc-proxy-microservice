/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

async function renderError(ctx, out, error) {
  // TODO: ${Object.entries(out).map(([key, value]) => `<pre><strong>${key}</strong>: ${htmlSafe(value)}</pre>`).join('')}
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <head>
      <title>oops! something went wrong</title>
    </head>
    <body>
      <div>
        <h1>oops! something went wrong</h1>
      </div>
    </body>
    </html>`;
}

export default renderError;