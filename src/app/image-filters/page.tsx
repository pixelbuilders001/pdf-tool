'use client';

import { useState, useEffect, useMemo } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageFiltersPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [grayscale, setGrayscale] = useState(0);
    const [blur, setBlur] = useState(0);
    const [sepia, setSepia] = useState(0);

    const previewUrl = useMemo(() => {
        if (files.length > 0) {
            return URL.createObjectURL(files[0].file);
        }
        return null;
    }, [files]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const filterString = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) blur(${blur}px) sepia(${sepia}%)`;

    const applyFilters = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setError(null);

        try {
            const file = files[0].file;
            const img = new Image();
            img.src = previewUrl!;
            await new Promise((resolve) => (img.onload = resolve));

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.filter = filterString;
            ctx.drawImage(img, 0, 0);

            const blob = await new Promise<Blob>((resolve) =>
                canvas.toBlob((b) => resolve(b!), file.type, 0.95)
            );

            setResult({
                url: URL.createObjectURL(blob),
                blob,
                name: `filtered_${file.name}`
            });
        } catch (err: any) {
            setError('Failed to apply filters');
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        if (result) URL.revokeObjectURL(result.url);
        clearFiles();
        setResult(null);
        setError(null);
        setBrightness(100);
        setContrast(100);
        setGrayscale(0);
        setBlur(0);
        setSepia(0);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Filters & Adjust</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Enhance your photos with professional filters and adjustments. Everything happens locally in your browser.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {!previewUrl ? (
                            <motion.div
                                key="uploader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <FileUploader maxFiles={1} accept={{ 'image/*': [] }} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 rounded-3xl bg-secondary/10 border border-border text-center space-y-6"
                            >
                                <div className="relative group max-w-2xl mx-auto rounded-xl border border-border shadow-2xl overflow-hidden bg-background">
                                    <img
                                        src={result?.url || previewUrl}
                                        style={{ filter: result ? 'none' : filterString }}
                                        className="w-full h-auto object-contain transition-all duration-300"
                                        alt="Preview"
                                    />
                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                                            <div className="text-center">
                                                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-2" />
                                                <p className="text-sm font-bold">Processing Output...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    {result ? (
                                        <>
                                            <button
                                                onClick={() => downloadFile(result.blob, result.name)}
                                                className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Download className="w-5 h-5" /> Download
                                            </button>
                                            <button
                                                onClick={() => setResult(null)}
                                                className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                            >
                                                <RefreshCcw className="w-5 h-5" /> Adjust Again
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleReset}
                                            className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                        >
                                            <RefreshCcw className="w-5 h-5" /> Clear & Reset
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-6">Adjustments</h3>

                        <div className="space-y-6 mb-8">
                            {[
                                { label: 'Brightness', val: brightness, set: setBrightness, min: 0, max: 200 },
                                { label: 'Contrast', val: contrast, set: setContrast, min: 0, max: 200 },
                                { label: 'Grayscale', val: grayscale, set: setGrayscale, min: 0, max: 100 },
                                { label: 'Blur', val: blur, set: setBlur, min: 0, max: 20 },
                                { label: 'Sepia', val: sepia, set: setSepia, min: 0, max: 100 },
                            ].map((f) => (
                                <div key={f.label}>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs uppercase font-bold text-muted-foreground ml-1">{f.label}</label>
                                        <span className="text-xs font-mono">{f.val}{f.label === 'Blur' ? 'px' : '%'}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={f.min}
                                        max={f.max}
                                        value={f.val}
                                        onChange={(e) => f.set(parseInt(e.target.value))}
                                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            ))}
                        </div>

                        {!result && (
                            <button
                                disabled={files.length === 0 || isProcessing}
                                onClick={applyFilters}
                                className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sliders className="w-5 h-5" /> Generate Download
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <SeoSection toolId="image-filters" />
        </div>
    );
}
