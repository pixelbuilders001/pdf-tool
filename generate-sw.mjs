// generate-sw.mjs
// Runs after `next build` as a postbuild script.
// Scans the `out/` directory and generates a production-ready
// Workbox service worker at `out/sw.js` that precaches ALL static assets.

import { generateSW } from 'workbox-build';

const buildSW = async () => {
    console.log('⚙️  Generating Workbox Service Worker...');

    const { count, size, warnings } = await generateSW({
        // Source directory — the static export output
        globDirectory: 'out/',

        // All asset types to precache
        globPatterns: [
            '**/*.{html,js,css,png,jpg,jpeg,svg,ico,json,woff,woff2,ttf,wasm,webp,gif,txt,xml}',
        ],

        // Where to write the final SW
        swDest: 'out/sw.js',

        // Take control of all clients immediately
        clientsClaim: true,
        skipWaiting: true,

        // Don't use navigation preload (incompatible with static export)
        navigationPreload: false,

        runtimeCaching: [
            // Next.js static chunks — versioned hashes, cache forever
            {
                urlPattern: /\/_next\/static\//,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'pdf-toolkit-next-static',
                    expiration: {
                        maxEntries: 500,
                        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                    },
                    cacheableResponse: { statuses: [0, 200] },
                },
            },
            // Images
            {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'pdf-toolkit-images',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    },
                    cacheableResponse: { statuses: [0, 200] },
                },
            },
            // WASM files
            {
                urlPattern: /\.wasm$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'pdf-toolkit-wasm',
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    },
                    cacheableResponse: { statuses: [0, 200] },
                },
            },
            // HTML pages — network first, fall back to cache
            {
                urlPattern: ({ request }) => request.destination === 'document',
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'pdf-toolkit-pages',
                    networkTimeoutSeconds: 3,
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                    },
                    cacheableResponse: { statuses: [0, 200] },
                },
            },
        ],
    });

    if (warnings.length > 0) {
        console.warn('⚠️  Warnings:\n', warnings.join('\n'));
    }

    console.log(
        `✅ Service Worker generated!\n` +
        `   📦 ${count} files precached\n` +
        `   💾 ${(size / 1024).toFixed(2)} KB total precache size\n` +
        `   📄 Output: out/sw.js`
    );
};

buildSW().catch((err) => {
    console.error('❌ SW generation failed:', err);
    process.exit(1);
});
