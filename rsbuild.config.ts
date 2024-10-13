import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    distPath: {
      root: 'dist',
      js: 'js',
      css: 'css',
      html: './',
      image: 'images',
    },
  },
  source: {
    entry: {
      index: './src/main.tsx',
      background: './src/background.ts',
    },
  },
  html: {
    template: './index.html',
  },
});