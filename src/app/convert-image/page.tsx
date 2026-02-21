'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConvertImagePage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [results, setResults] = useState<{ name: string; blob: Blob; url: string }[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');

    const handleConvert = async () => {
        if (files.length === 0) {
            setError('Please upload at least one image.');
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const converted = await Promise.all(
                files.map(async (f) => {
                    const img = new Image();
                    const objectUrl = URL.createObjectURL(f.file);

                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = objectUrl;
                    });

                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) throw new Error('Canvas error');

                    ctx.drawImage(img, 0, 0);

                    const blob = await new Promise<Blob>((resolve) =>
                        canvas.toBlob((b) => resolve(b!), targetFormat, 0.95)
                    );

                    const ext = targetFormat.split('/')[1];
                    const newName = f.file.name.replace(/\.[^/.]+$/, "") + `.${ext}`;

                    URL.revokeObjectURL(objectUrl);

                    return {
                        name: newName,
                        blob,
                        url: URL.createObjectURL(blob)
                    };
                })
            );
            setResults(converted);
        } catch (err: any) {
            setError(err.message || 'Conversion failed');
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        if (results) results.forEach(r => URL.revokeObjectURL(r.url));
        clearFiles();
        setResults(null);
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Convert Format</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Instantly change image formats between JPG, PNG, and WebP. Professional grade local conversion.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!results ? (
                        <FileUploader accept={{ 'image/*': [] }} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                <Download className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold">Files Converted!</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                {results.map((res, i) => (
                                    <button
                                        key={i}
                                        onClick={() => downloadFile(res.blob, res.name)}
                                        className="p-4 rounded-xl bg-card border border-border hover:border-primary transition-all flex items-center justify-between group"
                                    >
                                        <span className="text-sm font-medium truncate shrink">{res.name}</span>
                                        <Download className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={handleReset}
                                    className="text-primary font-bold hover:underline flex items-center justify-center gap-2 mx-auto"
                                >
                                    <RefreshCcw className="w-4 h-4" /> Convert More
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
                        <h3 className="font-bold text-lg mb-6">Convert To</h3>

                        <div className="grid grid-cols-1 gap-2 mb-8">
                            {[
                                { label: 'PNG (Lossless)', val: 'image/png' },
                                { label: 'JPG (Photography)', val: 'image/jpeg' },
                                { label: 'WebP (Modern)', val: 'image/webp' },
                            ].map((f) => (
                                <button
                                    key={f.val}
                                    onClick={() => setTargetFormat(f.val as any)}
                                    className={`py-3 px-4 text-sm font-bold rounded-xl border transition-all text-left ${targetFormat === f.val ? 'bg-primary border-primary text-white' : 'bg-secondary border-transparent text-muted-foreground'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!results}
                            onClick={handleConvert}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Converting...
                                </>
                            ) : (
                                <>
                                    <ArrowLeftRight className="w-5 h-5" /> Convert Images
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="convert-image" />
        </div>
    );
}
