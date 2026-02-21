'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, Stamp, Type, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WatermarkImagePage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [text, setText] = useState('© Copyright');
    const [opacity, setOpacity] = useState(0.5);
    const [fontSize, setFontSize] = useState(48);

    const handleApply = async () => {
        if (files.length === 0) {
            setError('Please upload an image.');
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
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas error');

            ctx.drawImage(img, 0, 0);

            // Apply Text Watermark
            ctx.globalAlpha = opacity;
            ctx.font = `${fontSize}px sans-serif`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Tile watermark
            const spacing = fontSize * 4;
            for (let x = 0; x < canvas.width + spacing; x += spacing) {
                for (let y = 0; y < canvas.height + spacing; y += spacing) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(-Math.PI / 4);
                    ctx.fillText(text, 0, 0);
                    ctx.restore();
                }
            }

            const blob = await new Promise<Blob>((resolve) =>
                canvas.toBlob((b) => resolve(b!), file.type, 0.95)
            );

            setResult({
                url: URL.createObjectURL(blob),
                blob,
                name: `watermarked_${file.name}`
            });
            URL.revokeObjectURL(objectUrl);
        } catch (err: any) {
            setError(err.message || 'Watermarking failed');
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
                <h1 className="text-4xl font-bold mb-4">Add Watermark</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Protect your images with custom text watermarks. Perfect for photographers and businesses.
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
                            <img src={result.url} className="max-w-md mx-auto rounded-xl border border-border mt-4" alt="Watermarked" />
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => downloadFile(result.blob, result.name)}
                                    className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" /> Download
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> New Watermark
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-6">Watermark Options</h3>

                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Watermark Text</label>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Opacity ({Math.round(opacity * 100)}%)</label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.05"
                                    value={opacity}
                                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Font Size ({fontSize}px)</label>
                                <input
                                    type="range"
                                    min="12"
                                    max="120"
                                    step="2"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                                />
                            </div>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!result}
                            onClick={handleApply}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Applying...
                                </>
                            ) : (
                                <>
                                    <Stamp className="w-5 h-5" /> Apply Watermark
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="watermark-image" />
        </div>
    );
}
