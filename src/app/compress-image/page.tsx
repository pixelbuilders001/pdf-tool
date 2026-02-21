'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { compressImage, formatBytes } from '@/lib/image/utils';
import { Loader2, Download, RefreshCcw, FileArchive } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CompressImagePage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [results, setResults] = useState<{ originalName: string; compressedFile: File; savedBytes: number }[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quality, setQuality] = useState(0.8);

    const handleCompress = async () => {
        if (files.length === 0) {
            setError('Please upload at least one image.');
            return;
        }

        setProcessing(true);
        setError(null);
        setResults(null);

        try {
            const processedFiles = await Promise.all(
                files.map(async (f) => {
                    const compressed = await compressImage(f.file, {
                        maxSizeMB: f.file.size / (1024 * 1024) * quality
                    });
                    return {
                        originalName: f.file.name,
                        compressedFile: compressed,
                        savedBytes: f.file.size - compressed.size
                    };
                })
            );
            setResults(processedFiles);
        } catch (err: any) {
            setError(err.message || 'An error occurred during compression.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        clearFiles();
        setResults(null);
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Compress Image</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Reduce image file sizes (JPG, PNG, WebP) without losing visible quality. Optimized for web.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!results ? (
                        <FileUploader
                            accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }}
                        />
                    ) : (
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-6"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                    <Download className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold">Compression Done!</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                    {results.map((res, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-card border border-border flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-bold truncate max-w-[150px]">{res.originalName}</span>
                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                    -{Math.round((res.savedBytes / (res.compressedFile.size + res.savedBytes)) * 100)}%
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Saved {formatBytes(res.savedBytes)}
                                            </div>
                                            <button
                                                onClick={() => downloadFile(res.compressedFile, res.originalName)}
                                                className="mt-2 w-full py-2 bg-secondary rounded-lg text-xs font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Download className="w-3 h-3" /> Download
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center pt-6">
                                    <button
                                        onClick={handleReset}
                                        className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RefreshCcw className="w-5 h-5" /> Compress More
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-4">Compression Settings</h3>

                        <div className="space-y-4 mb-6">
                            <label className="text-sm font-medium">Quality Level</label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={quality}
                                onChange={(e) => setQuality(parseFloat(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold px-1">
                                <span>Small Size</span>
                                <span>High Quality</span>
                            </div>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!results}
                            onClick={handleCompress}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Compressing...
                                </>
                            ) : (
                                <>
                                    <FileArchive className="w-5 h-5" /> Compress Images
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="compress-image" />
        </div>
    );
}
