"use client"

import { useState, useCallback, useRef } from 'react';

export type SpeedTestStatus = 'idle' | 'pinging' | 'downloading' | 'uploading' | 'complete' | 'error';

export interface SpeedTestResult {
    ping: number | null;
    download: number | null;
    upload: number | null;
    isp: string | null;
    location: string | null;
}

const CLOUDFLARE_TEST_URL = 'https://speed.cloudflare.com';

export const useSpeedTest = () => {
    const [status, setStatus] = useState<SpeedTestStatus>('idle');
    const [results, setResults] = useState<SpeedTestResult>({
        ping: null,
        download: null,
        upload: null,
        isp: null,
        location: null,
    });
    const [progress, setProgress] = useState(0);
    const abortControllerRef = useRef<AbortController | null>(null);

    const stopTest = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setStatus('idle');
        setProgress(0);
    }, []);

    const fetchMetadata = async (signal: AbortSignal) => {
        try {
            const response = await fetch(`${CLOUDFLARE_TEST_URL}/meta`, { signal });
            const data = await response.json();
            setResults(prev => ({
                ...prev,
                isp: data.asOrganization || data.isp || 'Unknown ISP',
                location: `${data.city}, ${data.country}` || 'Unknown Location',
            }));
        } catch (e) {
            console.error('Failed to fetch metadata', e);
        }
    };

    const runPingTest = async (signal: AbortSignal) => {
        const pings: number[] = [];
        for (let i = 0; i < 5; i++) {
            if (signal.aborted) return null;
            const start = performance.now();
            try {
                await fetch(`${CLOUDFLARE_TEST_URL}/cdn-cgi/trace`, { cache: 'no-store', signal, mode: 'no-cors' });
                pings.push(performance.now() - start);
            } catch (e) {
                if (signal.aborted) return null;
                // Even if it fails CORS, the time taken to get the error can be used as a rough ping if needed, 
                // but Cloudflare cdn-cgi/trace usually works.
            }
            await new Promise(r => setTimeout(r, 100));
        }
        return pings.length > 0 ? Math.min(...pings) : null;
    };

    const runDownloadTest = async (signal: AbortSignal) => {
        const FILE_SIZE_MB = 10;
        const bytesToDownload = FILE_SIZE_MB * 1024 * 1024;
        const url = `${CLOUDFLARE_TEST_URL}/__down?bytes=${bytesToDownload}`;
        const start = performance.now();

        try {
            const response = await fetch(url, { cache: 'no-store', signal });
            if (!response.body) throw new Error('No body');

            const reader = response.body.getReader();
            let receivedBytes = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                receivedBytes += value.length;
                setProgress((receivedBytes / bytesToDownload) * 100);
            }

            const end = performance.now();
            const durationInSeconds = (end - start) / 1000;
            const speedMbps = (receivedBytes * 8) / (durationInSeconds * 1024 * 1024);
            return speedMbps;
        } catch (e) {
            if (signal.aborted) return null;
            throw e;
        }
    };

    const runUploadTest = async (signal: AbortSignal) => {
        const FILE_SIZE_MB = 5;
        const size = FILE_SIZE_MB * 1024 * 1024;
        const data = new Uint8Array(size);
        crypto.getRandomValues(data);
        const blob = new Blob([data], { type: 'application/octet-stream' });

        return new Promise<number | null>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const start = performance.now();

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    setProgress((event.loaded / event.total) * 100);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const end = performance.now();
                    const durationInSeconds = (end - start) / 1000;
                    const speedMbps = (size * 8) / (durationInSeconds * 1024 * 1024);
                    resolve(speedMbps);
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            };

            xhr.onerror = () => {
                if (signal.aborted) {
                    resolve(null);
                } else {
                    reject(new Error('Upload failed due to network error'));
                }
            };

            xhr.onabort = () => resolve(null);

            signal.addEventListener('abort', () => xhr.abort());

            xhr.open('POST', `${CLOUDFLARE_TEST_URL}/__up`, true);
            xhr.send(blob);
        });
    };

    const startTest = useCallback(async () => {
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            setStatus('pinging');
            setProgress(0);

            // Start fetching metadata in parallel with ping
            const metaPromise = fetchMetadata(signal);
            const pingResult = await runPingTest(signal);
            await metaPromise;

            if (signal.aborted) return;
            setResults(prev => ({ ...prev, ping: pingResult }));

            setStatus('downloading');
            setProgress(0);
            const downloadResult = await runDownloadTest(signal);
            if (signal.aborted) return;
            setResults(prev => ({ ...prev, download: downloadResult }));

            setStatus('uploading');
            setProgress(0);
            const uploadResult = await runUploadTest(signal);
            if (signal.aborted) return;
            setResults(prev => ({ ...prev, upload: uploadResult }));

            setStatus('complete');
            setProgress(100);
        } catch (error) {
            if (!signal.aborted) {
                console.error('Speed test failed:', error);
                setStatus('error');
            }
        }
    }, []);

    return {
        status,
        results,
        progress,
        startTest,
        stopTest,
    };
};
