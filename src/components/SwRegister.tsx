'use client';

import { useEffect } from 'react';

/**
 * Registers the production Workbox service worker.
 * Only runs in the browser and only in production mode.
 */
export default function SwRegister() {
    useEffect(() => {
        // Only register in production and if SW is supported
        if (process.env.NODE_ENV !== 'production') return;
        if (!('serviceWorker' in navigator)) return;

        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then((registration) => {
                console.log('[SW] Registered with scope:', registration.scope);

                // Check for updates when page regains focus
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (
                                newWorker.state === 'installed' &&
                                navigator.serviceWorker.controller
                            ) {
                                console.log('[SW] New content available. Refresh to update.');
                            }
                        });
                    }
                });
            })
            .catch((err) => {
                console.error('[SW] Registration failed:', err);
            });
    }, []);

    return null;
}
