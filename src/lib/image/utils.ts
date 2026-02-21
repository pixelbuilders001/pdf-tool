import imageCompression from 'browser-image-compression';

export async function compressImage(file: File, options?: { maxSizeMB?: number; maxWidthOrHeight?: number }) {
    const defaultOptions = {
        maxSizeMB: options?.maxSizeMB || 1,
        maxWidthOrHeight: options?.maxWidthOrHeight || 1920,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, defaultOptions);
        return compressedFile;
    } catch (error) {
        console.error('Image compression error:', error);
        throw error;
    }
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
