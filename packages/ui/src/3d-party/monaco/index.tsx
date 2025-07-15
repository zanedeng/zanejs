import { getAssetPath } from '@stencil/core';

import { loadScript, waitUntil } from '../../utils';

const VERSION = '0.52.2';

const win = window as any;

let loadMonacoCalled = false;

export default async function loadMonaco() {
  if (loadMonacoCalled) {
    await waitUntil(() => !!win.monaco);
    return;
  }

  loadMonacoCalled = true;

  // eslint-disable-next-line n/prefer-global/process
  if (process.env.THIRD_PARTY_ASSETS === 'LOCAL') {
    win.require = {
      paths: { vs: getAssetPath('./assets/node_modules/monaco-editor/min/vs') },
    };
    await loadScript(
      getAssetPath('./assets/node_modules/monaco-editor/min/vs/loader.js'),
    );
    await loadScript(
      getAssetPath(
        './assets/node_modules/monaco-editor/min/vs/editor/editor.main.nls.js',
      ),
    );
    await loadScript(
      getAssetPath(
        './assets/node_modules/monaco-editor/min/vs/editor/editor.main.js',
      ),
    );
  } else {
    win.require = {
      paths: {
        vs: `https://cdn.jsdelivr.net/npm/monaco-editor@${VERSION}/min/vs`,
      },
    };
    await loadScript(
      `https://cdn.jsdelivr.net/npm/monaco-editor@${VERSION}/min/vs/loader.js`,
    );
    await loadScript(
      `https://cdn.jsdelivr.net/npm/monaco-editor@${VERSION}/min/vs/editor/editor.main.min.js`,
    );
  }

  await waitUntil(() => !!win.monaco);
}
