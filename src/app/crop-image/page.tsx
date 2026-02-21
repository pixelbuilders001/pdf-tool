'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, Crop } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CropImagePage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [aspect, setAspect] = useState<number | undefined>(1); // Default square

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => (image.onload = resolve));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.95);
        });
    };

    const handleCrop = async () => {
        if (!files[0] || !croppedAreaPixels) return;

        setProcessing(true);
        setError(null);

        try {
            const objectUrl = URL.createObjectURL(files[0].file);
            const croppedBlob = await getCroppedImg(objectUrl, croppedAreaPixels);

            if (croppedBlob) {
                setResult({
                    url: URL.createObjectURL(croppedBlob),
                    blob: croppedBlob,
                    name: `cropped_${files[0].file.name}`
                });
            }
            URL.revokeObjectURL(objectUrl);
        } catch (err: any) {
            setError(err.message || 'Error cropping image');
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
                <h1 className="text-4xl font-bold mb-4">Crop Image</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Perfectly frame your pictures with our interactive cropping tool. Multiple aspect ratios available.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!result ? (
                        files.length > 0 ? (
                            <div className="relative h-[500px] w-full bg-black/20 rounded-3xl overflow-hidden border border-border">
                                <Cropper
                                    image={URL.createObjectURL(files[0].file)}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={aspect}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                        ) : (
                            <FileUploader maxFiles={1} accept={{ 'image/*': [] }} />
                        )
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-6"
                        >
                            <img src={result.url} className="max-w-md mx-auto rounded-xl border border-border" alt="Cropped" />
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
                                    <RefreshCcw className="w-5 h-5" /> New Crop
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-6">Crop Settings</h3>

                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Aspect Ratio</label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {[
                                        { label: 'Square (1:1)', val: 1 },
                                        { label: 'Classic (4:3)', val: 4 / 3 },
                                        { label: 'Wide (16:9)', val: 16 / 9 },
                                        { label: 'Free', val: undefined },
                                    ].map((r) => (
                                        <button
                                            key={r.label}
                                            onClick={() => setAspect(r.val)}
                                            className={`py-2 px-3 text-[10px] font-bold rounded-lg border transition-all ${aspect === r.val ? 'bg-primary border-primary text-white' : 'bg-secondary border-transparent text-muted-foreground'
                                                }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground ml-1">Zoom</label>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                                />
                            </div>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!result}
                            onClick={handleCrop}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Cropping...
                                </>
                            ) : (
                                <>
                                    <Crop className="w-5 h-5" /> Apply Crop
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="crop-image" />
        </div>
    );
}
