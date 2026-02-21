'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResizeImagePage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [width, setWidth] = useState<number>(1200);
    const [height, setHeight] = useState<number>(0); // 0 for auto
    const [maintainAspect, setMaintainAspect] = useState(true);

    const handleResize = async () => {
        if (files.length === 0) {
            setError('Please upload an image to resize.');
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const file = files[0].file;
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = objectUrl;
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            let targetWidth = width;
            let targetHeight = height || (width * (img.height / img.width));

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const blob = await new Promise<Blob>((resolve) =>
                canvas.toBlob((b) => resolve(b!), file.type, 0.9)
            );

            setResult({
                url: URL.createObjectURL(blob),
                blob,
                name: `resized_${file.name}`
            });
            URL.revokeObjectURL(objectUrl);
        } catch (err: any) {
            setError(err.message || 'An error occurred during resizing.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        if (result) URL.revokeObjectURL(result.url);
        clearFiles();
        setResult(null);
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Resize Image</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Adjust image dimensions while maintaining perfect quality. Fast & secure local processing.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!result ? (
                        <FileUploader maxFiles={1} accept={{ 'image/*': [] }} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-6"
                        >
                            <div className="aspect-video max-w-md mx-auto rounded-xl overflow-hidden border border-border bg-background relative group">
                                <img src={result.url} className="w-full h-full object-contain" alt="Resized" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => downloadFile(result.blob, result.name)}
                                        className="p-4 bg-primary text-white rounded-full shadow-lg"
                                    >
                                        <Download className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => downloadFile(result.blob, result.name)}
                                    className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" /> Download Image
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Resize More
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-6">Resize Options</h3>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Width (px)</label>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            {!maintainAspect && (
                                <div>
                                    <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Height (px)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            )}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={maintainAspect}
                                        onChange={() => setMaintainAspect(!maintainAspect)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-colors ${maintainAspect ? 'bg-primary' : 'bg-secondary'}`} />
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${maintainAspect ? 'translate-x-4' : ''}`} />
                                </div>
                                <span className="text-sm font-medium">Maintain Aspect Ratio</span>
                            </label>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!result}
                            onClick={handleResize}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Resizing...
                                </>
                            ) : (
                                <>
                                    <Maximize className="w-5 h-5" /> Resize Image
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="resize-image" />
        </div>
    );
}
