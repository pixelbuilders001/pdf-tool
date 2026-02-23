/**
 * DEV PLACEHOLDER — This file is overwritten by `generate-sw.mjs`
 * after `next build` with a full Workbox service worker.
 *
 * In development, this minimal SW is used (no offline support).
 * Run `npm run build` to get the production SW with full offline support.
 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', () => { });
