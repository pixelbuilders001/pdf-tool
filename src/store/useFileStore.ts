import { create } from 'zustand';

export interface FileItem {
    id: string;
    file: File;
    previewUrl?: string;
    status: 'idle' | 'processing' | 'completed' | 'error';
    progress: number;
    message?: string;
    resultUrl?: string;
}

interface FileStore {
    files: FileItem[];
    isProcessing: boolean;
    addFiles: (newFiles: File[]) => void;
    removeFile: (id: string) => void;
    clearFiles: () => void;
    updateFileStatus: (id: string, status: FileItem['status'], progress: number, message?: string, resultUrl?: string) => void;
    setFiles: (files: FileItem[]) => void;
    setProcessing: (processing: boolean) => void;
}

export const useFileStore = create<FileStore>((set) => ({
    files: [],
    isProcessing: false,
    addFiles: (newFiles) => set((state) => {
        const nextFiles = [...state.files];
        newFiles.forEach(file => {
            if (nextFiles.length < 10) { // Limit to 10 files
                nextFiles.push({
                    id: Math.random().toString(36).substring(7),
                    file,
                    status: 'idle',
                    progress: 0,
                });
            }
        });
        return { files: nextFiles };
    }),
    removeFile: (id) => set((state) => {
        const file = state.files.find(f => f.id === id);
        if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
        if (file?.resultUrl) URL.revokeObjectURL(file.resultUrl);
        return { files: state.files.filter((f) => f.id !== id) };
    }),
    clearFiles: () => set((state) => {
        state.files.forEach(f => {
            if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
            if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
        });
        return { files: [] };
    }),
    updateFileStatus: (id, status, progress, message, resultUrl) => set((state) => ({
        files: state.files.map((f) =>
            f.id === id ? { ...f, status, progress, message, resultUrl: resultUrl || f.resultUrl } : f
        )
    })),
    setFiles: (files) => set({ files }),
    setProcessing: (processing) => set({ isProcessing: processing }),
}));
