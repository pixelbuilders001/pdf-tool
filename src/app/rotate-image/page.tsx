'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RotateImagePage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);

    const handleProcess = async () => {
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
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas error');

            const isRotated90 = (rotation / 90) % 2 !== 0;
            canvas.width = isRotated90 ? img.height : img.width;
            canvas.height = isRotated90 ? img.width : img.height;

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);

            const scaleX = flipH ? -1 : 1;
            const scaleY = flipV ? -1 : 1;
            ctx.scale(scaleX, scaleY);

            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            const blob = await new Promise<Blob>((resolve) =>
                canvas.toBlob((b) => resolve(b!), file.type, 0.95)
            );

            setResult({
                url: URL.createObjectURL(blob),
                blob,
                name: `transformed_${file.name}`
            });
            URL.revokeObjectURL(objectUrl);
        } catch (err: any) {
            setError(err.message || 'Processing failed');
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        if (result) URL.revokeObjectURL(result.url);
        clearFiles();
        setResult(null);
        setError(null);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Rotate / Flip Image</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Quickly correct image orientation or flip photos horizontally and vertically.
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
                            <img src={result.url} className="max-w-md mx-auto rounded-xl border border-border shadow-2xl" alt="Transformed" />
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
                                    <RefreshCcw className="w-5 h-5" /> Transform New
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-6">Transformations</h3>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Rotation</label>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {[0, 90, 180, 270].map((deg) => (
                                        <button
                                            key={deg}
                                            onClick={() => setRotation(deg)}
                                            className={`py-2 px-3 text-[10px] font-bold rounded-lg border transition-all ${rotation === deg ? 'bg-primary border-primary text-white' : 'bg-secondary border-transparent text-muted-foreground'
                                                }`}
                                        >
                                            {deg}°
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFlipH(!flipH)}
                                    className={`flex-grow py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${flipH ? 'bg-primary border-primary text-white' : 'bg-secondary border-transparent text-muted-foreground'
                                        }`}
                                >
                                    <FlipHorizontal className="w-4 h-4" /> Flip H
                                </button>
                                <button
                                    onClick={() => setFlipV(!flipV)}
                                    className={`flex-grow py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${flipV ? 'bg-primary border-primary text-white' : 'bg-secondary border-transparent text-muted-foreground'
                                        }`}
                                >
                                    <FlipVertical className="w-4 h-4" /> Flip V
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!result}
                            onClick={handleProcess}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <RotateCw className="w-5 h-5" /> Apply Transformations
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="rotate-image" />
        </div>
    );
}
