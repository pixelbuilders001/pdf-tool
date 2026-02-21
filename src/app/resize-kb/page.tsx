'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, Database, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';

const TARGETS = [20, 50, 100, 200, 500];

export default function ResizeKbPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [targetKb, setTargetKb] = useState(50);
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string; size: number }[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleResize = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setError(null);

        try {
            const processed = await Promise.all(
                files.map(async (f) => {
                    // Iterative approach to hit target KB
                    // browser-image-compression handle this with maxSizeMB
                    const options = {
                        maxSizeMB: targetKb / 1024,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    };

                    const compressedFile = await imageCompression(f.file, options);

                    return {
                        url: URL.createObjectURL(compressedFile),
                        blob: compressedFile,
                        name: compressedFile.name,
                        size: compressedFile.size
                    };
                })
            );
            setResult(processed);
        } catch (err: any) {
            console.error(err);
            setError('Failed to reach target size. Try a larger KB limit or a smaller original image.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        clearFiles();
        setResult(null);
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                    Resize Image to KB
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Perfect for government forms, applications, and portal uploads. Hit exact size limits (20KB, 50KB, 100KB) instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!result ? (
                        <FileUploader accept={{ 'image/*': [] }} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                <Database className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold">Successfully Resized!</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                {result.map((res, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-card border border-border flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold truncate max-w-[150px]">{res.name}</span>
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                {Math.round(res.size / 1024)} KB
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => downloadFile(res.blob, res.name)}
                                            className="mt-2 w-full py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-3 h-3" /> Download
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={handleReset}
                                    className="text-primary font-bold hover:underline flex items-center justify-center gap-2 mx-auto"
                                >
                                    <RefreshCcw className="w-4 h-4" /> Process More Images
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-6">Target Size</h3>

                        <div className="space-y-6 mb-8">
                            <div className="grid grid-cols-3 gap-2">
                                {TARGETS.map((kb) => (
                                    <button
                                        key={kb}
                                        onClick={() => setTargetKb(kb)}
                                        className={`py-2 rounded-xl text-xs font-bold transition-all border-2 ${targetKb === kb ? 'border-primary bg-primary/5 text-primary' : 'border-secondary hover:border-primary/30'}`}
                                    >
                                        {kb} KB
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground block mb-2">Custom KB Limit</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={targetKb}
                                        onChange={(e) => setTargetKb(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary outline-none transition-all pr-12 font-mono text-sm"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">KB</span>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!result}
                            onClick={handleResize}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Compressing...
                                </>
                            ) : (
                                <>
                                    <Database className="w-5 h-5" /> Resize to {targetKb}KB
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="resize-kb" />
        </div>
    );
}
