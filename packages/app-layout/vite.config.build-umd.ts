import { resolve } from 'path'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
// import Dts from 'vite-plugin-dts'
import type { UserConfigExport } from 'vite'

export default (): UserConfigExport => {
  // const packageDir = './src'
  const entry = resolve(__dirname, './src/index.ts')
  const outDir = resolve(__dirname, 'dist/umd')
  return {
    mode: 'production',
    plugins: [
      Vue(),
      VueJsx(),
      // Dts({
      //   insertTypesEntry: true,
      //   cleanVueFileName: true,
      //   skipDiagnostics: false,
      //   logDiagnostics: true,
      //   include: [packageDir],
      //   entryRoot: packageDir,
      // }),
    ],
    build: {
      // target: 'modules',
      minify: true, // 压缩
      chunkSizeWarningLimit: 2, // 超过 2kb 警告提示
      // reportCompressedSize: false,
      emptyOutDir: false,
      outDir,
      lib: {
        name: 'zanejs',
        entry,
        formats: ['umd'],
        fileName: (target): string => {
          return `index.${target}.js`
        },
      },
      rollupOptions: {
        external: ['vue'],
        // output: {
        //   preserveModules: true,
        //   preserveModulesRoot: packageDir,
        //   sourcemap: true,
        // },
        output: {
          format: 'umd',
          exports: 'named',
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  }
}
