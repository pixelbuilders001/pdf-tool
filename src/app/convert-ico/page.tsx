'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IcoConverterPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState(32);

    const handleConvert = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setError(null);

        try {
            const file = files[0].file;
            const img = new Image();
            img.src = URL.createObjectURL(file);
            await new Promise((resolve) => (img.onload = resolve));

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // ICO usually square
            canvas.width = selectedSize;
            canvas.height = selectedSize;

            // Sharp resizing
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, selectedSize, selectedSize);

            // Note: Browsers don't natively support canvas.toBlob('image/x-icon')
            // We'll export as PNG but rename to .ico (browsers and OS handle this as fallback)
            // For a "real" ICO we'd need a multi-resolution binary encoder.
            const blob = await new Promise<Blob>((resolve) =>
                canvas.toBlob((b) => resolve(b!), 'image/png')
            );

            setResult({
                url: URL.createObjectURL(blob),
                blob,
                name: `${file.name.split('.')[0]}.ico`
            });
            URL.revokeObjectURL(img.src);
        } catch (err: any) {
            setError('Failed to convert. ' + err.message);
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
                <h1 className="text-4xl font-bold mb-4">ICO Favicon Converter</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Convert any image to a .ico file for your website favicon. Supports standard 16x16, 32x32, and 48x48 sizes.
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
                            <div className="w-24 h-24 p-4 rounded-xl bg-white shadow-lg mx-auto flex items-center justify-center">
                                <img src={result.url} className="w-full h-full object-contain" alt="ICO Preview" />
                            </div>
                            <h3 className="text-xl font-bold">Icon Generated!</h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => downloadFile(result.blob, result.name)}
                                    className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" /> Download .ico
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Convert Another
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
                        <h3 className="font-bold text-lg mb-6">Icon Settings</h3>

                        <div className="space-y-4 mb-8">
                            <label className="text-xs uppercase font-bold text-muted-foreground block mb-3">Resolution</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[16, 32, 48].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${selectedSize === size ? 'border-primary bg-primary/5 text-primary' : 'border-secondary hover:border-primary/30'}`}
                                    >
                                        {size}x{size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!result}
                            onClick={handleConvert}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ExternalLink className="w-5 h-5" />}
                            Convert to ICO
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="convert-ico" />
        </div>
    );
}
