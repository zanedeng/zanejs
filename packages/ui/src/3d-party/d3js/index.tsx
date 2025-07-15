import { getAssetPath } from '@stencil/core';

import { loadScript, waitUntil } from '../../utils';

let loadD3Called = false;

const win = window as any;

export async function loadD3JS() {
  if (loadD3Called) {
    await waitUntil(() => !!win.d3);
    return;
  }

  loadD3Called = true;

  // eslint-disable-next-line n/prefer-global/process
  await (process.env.THIRD_PARTY_ASSETS === 'LOCAL'
    ? loadScript(getAssetPath('./assets/node_modules/d3/dist/d3.min.js'))
    : loadScript('https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js'));

  await waitUntil(() => !!win.d3);
}
