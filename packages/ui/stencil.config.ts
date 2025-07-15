import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import { vueOutputTarget } from '@stencil/vue-output-target';
import dotEnvPlugin from 'rollup-plugin-dotenv';

export const config: Config = {
  namespace: 'zaneui',
  outputTargets: [
    {
      copy: [{ src: 'assets' }],
      esmLoaderPath: '../loader',
      type: 'dist',
    },
    reactOutputTarget({
      componentCorePackage: '@zanejs/ui',
      includeImportCustomElements: true,
      proxiesFile: 'dist/generated/zaneui-react/index.ts',
    }),
    vueOutputTarget({
      componentCorePackage: '@zanejs/ui',
      includeImportCustomElements: true,
      proxiesFile: 'dist/generated/zaneui-vue/index.ts',
    }),
    {
      externalRuntime: false,
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      serviceWorker: null, // disable service workers
      type: 'www',
    },
  ],
  plugins: [sass(), dotEnvPlugin()],
  testing: {
    browserHeadless: 'shell',
  },
};
