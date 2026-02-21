'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, Eraser, Sparkles, Image as ImageIcon, Palette, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { removeBackground } from '@imgly/background-removal';

const PRESET_COLORS = [
    'transparent',
    '#ffffff',
    '#000000',
    '#f87171', // Red
    '#fbbf24', // Amber
    '#34d399', // Emerald
    '#60a5fa', // Blue
    '#818cf8', // Indigo
    '#a78bfa', // Violet
    '#f472b6', // Pink
];

export default function RemoveBgClient() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string; width: number; height: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingModel, setLoadingModel] = useState(false);
    const [progress, setProgress] = useState(0);

    // Custom background state
    const [bgColor, setBgColor] = useState('transparent');
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [isCompositing, setIsCompositing] = useState(false);

    const bgInputRef = useRef<HTMLInputElement>(null);

    const originalUrl = useMemo(() => {
        if (files.length > 0) {
            return URL.createObjectURL(files[0].file);
        }
        return null;
    }, [files]);

    useEffect(() => {
        return () => {
            if (originalUrl) URL.revokeObjectURL(originalUrl);
        };
    }, [originalUrl]);

    const handleRemove = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setLoadingModel(true);
        setError(null);
        setProgress(0);

        try {
            const file = files[0].file;
            const blob = await removeBackground(file, {
                progress: (item: string, p: number) => {
                    setProgress(Math.round(p * 100));
                    if (item.includes('model')) setLoadingModel(true);
                    else setLoadingModel(false);
                },
                debug: false,
                model: 'isnet'
            });

            // Get dimensions
            const img = new Image();
            const url = URL.createObjectURL(blob);
            img.src = url;
            await new Promise((resolve) => (img.onload = resolve));

            setResult({
                url,
                blob,
                name: `no_bg_${file.name.replace(/\.[^/.]+$/, "")}.png`,
                width: img.width,
                height: img.height
            });
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Background removal failed. This tool requires a browser with WebAssembly support.');
        } finally {
            setProcessing(false);
            setLoadingModel(false);
        }
    };

    // Auto-trigger
    useEffect(() => {
        if (files.length === 1 && !result && !isProcessing && !error) {
            handleRemove();
        }
    }, [files, result, isProcessing, error]);

    const handleReset = () => {
        if (result) URL.revokeObjectURL(result.url);
        if (bgImage) URL.revokeObjectURL(bgImage);
        clearFiles();
        setResult(null);
        setError(null);
        setProgress(0);
        setBgColor('transparent');
        setBgImage(null);
    };

    const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (bgImage) URL.revokeObjectURL(bgImage);
            setBgImage(URL.createObjectURL(file));
            setBgColor('transparent');
        }
    };

    const handleDownload = async () => {
        if (!result) return;

        if (bgColor === 'transparent' && !bgImage) {
            downloadFile(result.blob, result.name);
            return;
        }

        setIsCompositing(true);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            canvas.width = result.width;
            canvas.height = result.height;

            // 1. Draw background
            if (bgImage) {
                const bgImg = new Image();
                bgImg.src = bgImage;
                await new Promise((resolve) => (bgImg.onload = resolve));

                // Cover behavior
                const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
                const x = (canvas.width / 2) - (bgImg.width / 2) * scale;
                const y = (canvas.height / 2) - (bgImg.height / 2) * scale;
                ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
            } else if (bgColor !== 'transparent') {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // 2. Draw foreground
            const fgImg = new Image();
            fgImg.src = result.url;
            await new Promise((resolve) => (fgImg.onload = resolve));
            ctx.drawImage(fgImg, 0, 0);

            // 3. Export
            const finalBlob = await new Promise<Blob>((resolve) =>
                canvas.toBlob((b) => resolve(b!), 'image/png')
            );
            downloadFile(finalBlob, result.name);
        } catch (err) {
            console.error('Download compositing failed:', err);
            downloadFile(result.blob, result.name); // Fallback to transparent
        } finally {
            setIsCompositing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                    AI Background Remover
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Professional, 100% client-side background removal. Now with custom backdrop replacement.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {!originalUrl ? (
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
                                className="p-8 rounded-3xl bg-secondary/10 border border-border text-center space-y-6 relative overflow-hidden"
                            >
                                <div className="relative group max-w-md mx-auto rounded-xl border border-border overflow-hidden shadow-2xl min-h-[300px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')]">
                                    <div
                                        className="absolute inset-0 transition-all duration-300"
                                        style={{
                                            backgroundColor: bgColor,
                                            backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                    <img
                                        src={result?.url || originalUrl}
                                        className={`relative z-10 w-full h-auto object-contain transition-all duration-700 ${isProcessing ? 'blur-sm opacity-50' : ''}`}
                                        alt="Processed"
                                    />

                                    {isProcessing && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                            <div className="relative w-full h-full">
                                                <motion.div
                                                    initial={{ top: '0%' }}
                                                    animate={{ top: '100%' }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute w-full h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] z-10"
                                                />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
                                                    <Sparkles className="w-12 h-12 text-primary animate-pulse mb-4" />
                                                    <h3 className="text-lg font-bold mb-2">
                                                        {loadingModel ? 'Initializing AI...' : 'Removing Background...'}
                                                    </h3>
                                                    <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            className="h-full bg-primary"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-mono">{progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    {result ? (
                                        <>
                                            <button
                                                disabled={isCompositing}
                                                onClick={handleDownload}
                                                className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                            >
                                                {isCompositing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                                                Download {bgColor === 'transparent' && !bgImage ? 'PNG' : 'Image'}
                                            </button>
                                            <button
                                                onClick={handleReset}
                                                className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                            >
                                                <RefreshCcw className="w-5 h-5" /> Remove Another
                                            </button>
                                        </>
                                    ) : (
                                        !isProcessing && (
                                            <button
                                                onClick={handleReset}
                                                className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                            >
                                                <RefreshCcw className="w-5 h-5" /> Cancel & Reset
                                            </button>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-6">Replace Background</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground mb-3 block flex items-center gap-2">
                                    <Palette className="w-3 h-3" /> Solid Color
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setBgColor(c);
                                                setBgImage(null);
                                            }}
                                            className={`w-full aspect-square rounded-lg border-2 transition-all ${bgColor === c && !bgImage ? 'border-primary ring-2 ring-primary/20 scale-110 z-10' : 'border-transparent hover:scale-105'}`}
                                            style={{
                                                backgroundColor: c === 'transparent' ? 'transparent' : c,
                                                backgroundImage: c === 'transparent' ? "url('https://www.transparenttextures.com/patterns/checkerboard.png')" : 'none',
                                                backgroundSize: '150%'
                                            }}
                                            title={c}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground mb-3 block flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" /> Custom Image
                                </label>
                                <input
                                    type="file"
                                    ref={bgInputRef}
                                    onChange={handleBgUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => bgInputRef.current?.click()}
                                    className={`w-full py-3 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2 text-sm font-medium ${bgImage ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'}`}
                                >
                                    {bgImage ? (
                                        <>
                                            <ImageIcon className="w-4 h-4" /> Change Background
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-4 h-4" /> Upload Backdrop
                                        </>
                                    )}
                                </button>
                                {bgImage && (
                                    <p className="text-[10px] text-center mt-2 text-muted-foreground">
                                        Custom backdrop selected
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Privacy Mode</span>
                                <span className="text-blue-500 font-bold">On-Device (WASM)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SeoSection toolId="remove-bg" />
        </div>
    );
}
