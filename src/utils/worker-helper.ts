export function spawnWorker(type: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('../workers/pdf.worker.ts', import.meta.url));

        worker.onmessage = (event) => {
            const { type: responseType, payload: responsePayload, message } = event.data;
            if (responseType === 'SUCCESS') {
                resolve(responsePayload);
            } else {
                reject(new Error(message || 'Worker task failed'));
            }
            worker.terminate();
        };

        worker.onerror = (error) => {
            reject(error);
            worker.terminate();
        };

        worker.postMessage({ type, payload });
    });
}

export function downloadBlob(data: Uint8Array, fileName: string, mimeType: string) {
    const blob = new Blob([data as any], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function downloadFile(file: File | Blob, fileName: string) {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

