'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, ShieldOff, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import exifr from 'exifr';

export default function RemoveMetadataPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [results, setResults] = useState<{ name: string; blob: Blob; url: string; metaRemoved: boolean }[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRemove = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setError(null);

        try {
            const stripped = await Promise.all(
                files.map(async (f) => {
                    const img = new Image();
                    const objectUrl = URL.createObjectURL(f.file);

                    await new Promise((resolve) => (img.onload = resolve));

                    // Drawing to canvas naturally strips most metadata (EXIF, GPS, etc.)
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) throw new Error('Canvas error');

                    ctx.drawImage(img, 0, 0);

                    const blob = await new Promise<Blob>((resolve) =>
                        canvas.toBlob((b) => resolve(b!), f.file.type, 1.0)
                    );

                    URL.revokeObjectURL(objectUrl);

                    return {
                        name: `clean_${f.file.name}`,
                        blob,
                        url: URL.createObjectURL(blob),
                        metaRemoved: true
                    };
                })
            );
            setResults(stripped);
        } catch (err) {
            setError('Failed to remove metadata');
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
                <h1 className="text-4xl font-bold mb-4">Remove Metadata</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Strip EXIF data, GPS coordinates, and camera settings from your images for maximum privacy.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!results ? (
                        <FileUploader accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                <ShieldOff className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold">Metadata Stripped!</h3>

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
                                    <RefreshCcw className="w-4 h-4" /> Process More
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
                        <h3 className="font-bold text-lg mb-6">Privacy Options</h3>

                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-8 space-y-3">
                            <div className="flex items-center gap-2 text-blue-500">
                                <Info className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">What will be removed?</span>
                            </div>
                            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                                <li>GPS Coordinates</li>
                                <li>Camera Model & Settings</li>
                                <li>Date/Time Original</li>
                                <li>Software Information</li>
                                <li>Thumbnail Data</li>
                            </ul>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!results}
                            onClick={handleRemove}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Stripping...
                                </>
                            ) : (
                                <>
                                    <ShieldOff className="w-5 h-5" /> Clean Metadata
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="remove-exif" />
        </div>
    );
}
