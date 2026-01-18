declare module 'vite-plugin-eslint' {
  import type { Plugin } from 'vite';

  export interface ESLintPluginOptions {
    fix?: boolean;
    include?: string | string[];
    exclude?: string | string[];
    cache?: boolean;
    failOnError?: boolean;
    failOnWarning?: boolean;
    formatter?: string | ((results: unknown) => string);
  }

  export default function eslint(options?: ESLintPluginOptions): Plugin;
}
