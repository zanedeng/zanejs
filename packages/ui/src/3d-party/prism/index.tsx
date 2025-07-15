import { getAssetPath } from '@stencil/core';

import { loadScript, waitUntil } from '../../utils';

const VERSION = '1.30.0';

const win = window as any;

let loadPrismCalled = false;

export async function loadPrism() {
  if (loadPrismCalled) {
    await waitUntil(() => !!win.Prism);
    return;
  }

  loadPrismCalled = true;

  // eslint-disable-next-line n/prefer-global/process
  if (process.env.THIRD_PARTY_ASSETS === 'LOCAL') {
    await loadScript(
      getAssetPath(
        './assets/node_modules/prismjs/components/prism-core.min.js',
      ),
    );
    await loadScript(
      getAssetPath(
        './assets/node_modules/prismjs/plugins/autoloader/prism-autoloader.min.js',
      ),
    );
  } else {
    await loadScript(
      `https://cdn.jsdelivr.net/npm/prismjs@${VERSION}/components/prism-core.min.js`,
    );
    await loadScript(
      `https://cdn.jsdelivr.net/npm/prismjs@${VERSION}/plugins/autoloader/prism-autoloader.min.js`,
    );
  }

  await waitUntil(() => !!win.Prism);
}

const loadPrismLanguageCalled: any = {};

export async function loadPrismLanguage(language: string) {
  const Prism = win.Prism;

  if (loadPrismLanguageCalled[language]) {
    await waitUntil(() => !!Prism.languages[language]);
    return;
  }

  loadPrismLanguageCalled[language] = true;

  await autoLoader(language);
}

export async function autoLoader(language: string) {
  const Prism = win.Prism;
  const autoloader = Prism.plugins.autoloader;
  return await new Promise((resolve) => {
    autoloader.loadLanguages([language], () => {
      resolve(1);
    });
  });
}
