/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PORT: string;
  readonly NODE_ENV: 'development' | 'production';
}
