import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  ssr: {
    resolve: {
      conditions: ['custom', 'import', 'default'],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    tsconfigPaths(),

    swc.vite(
      {
        jsc: {
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      },
      //   {
      //   tsconfigFile: './tsconfig.json',
      //   module: { type: 'es6', noInterop: false },
      //   jsc: {
      //     target: 'es2023',
      //     parser: {
      //       syntax: 'typescript',
      //       decorators: true,
      //     },
      //     transform: {
      //       legacyDecorator: true,
      //       decoratorMetadata: true,
      //     },
      //     preserveAllComments: true,
      //   },
      // }
    ),
  ],

  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    clearMocks: true,
    root: './',
    include: ['**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    reporters: ['verbose'],
    testTimeout: 120000,
    deps: {
      moduleDirectories: ['node_modules', path.resolve('../../packages')],
    },
    // coverage: {
    //   enabled: false,
    //
    // }
    // server: {
    //   deps: {
    //     inline: [
    //       '@nestjs/common',
    //       '@nestjs/core',
    //       '@nestjs/testing',
    //       '@nestjs/platform-express',
    //     ],
    //   },
    // },
    // deps: {
    //   interopDefault: true,
    // },
  },
});
