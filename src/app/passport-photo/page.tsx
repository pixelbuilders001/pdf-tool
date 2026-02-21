'use client';

import { useState, useRef, useCallback } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, UserSquare, Grid, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper, { Area } from 'react-easy-crop';

const SIZES = [
    { id: 'in', name: 'India (3.5 x 4.5 cm)', aspect: 3.5 / 4.5, width: 35, height: 45 },
    { id: 'us', name: 'USA (5.1 x 5.1 cm / 2x2")', aspect: 1, width: 51, height: 51 },
    { id: 'pk', name: 'Pakistan (3.5 x 4.5 cm)', aspect: 3.5 / 4.5, width: 35, height: 45 },
    { id: 'ae', name: 'UAE (4.0 x 6.0 cm)', aspect: 4 / 6, width: 40, height: 60 },
];

export default function PassportPhotoPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [selectedSize, setSelectedSize] = useState(SIZES[0]);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [gridResult, setGridResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('No 2d context');

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

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error('Canvas is empty'));
                resolve(blob);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleCreatePhoto = async () => {
        if (!files[0] || !croppedAreaPixels) return;
        setProcessing(true);
        try {
            const url = URL.createObjectURL(files[0].file);
            const croppedBlob = await getCroppedImg(url, croppedAreaPixels);
            const resultUrl = URL.createObjectURL(croppedBlob);
            setResult({
                url: resultUrl,
                blob: croppedBlob,
                name: `passport_${selectedSize.id}.jpg`
            });
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
        } finally {
            setProcessing(false);
        }
    };

    const handleCreateGrid = async () => {
        if (!result) return;
        setProcessing(true);
        try {
            const img = await createImage(result.url);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // 4x6 inch grid (approx 1200x1800 px at 300dpi)
            // But let's use a simpler grid of 8 photos (2 cols, 4 rows)
            const margin = 20;
            const photoWidth = img.width;
            const photoHeight = img.height;

            canvas.width = (photoWidth * 2) + (margin * 3);
            canvas.height = (photoHeight * 4) + (margin * 5);

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 2; col++) {
                    const x = margin + col * (photoWidth + margin);
                    const y = margin + row * (photoHeight + margin);
                    ctx.drawImage(img, x, y);

                    // Add subtle border
                    ctx.strokeStyle = '#eee';
                    ctx.strokeRect(x, y, photoWidth, photoHeight);
                }
            }

            canvas.toBlob((blob) => {
                if (blob) {
                    setGridResult({
                        url: URL.createObjectURL(blob),
                        blob,
                        name: 'passport_sheet_4x6.jpg'
                    });
                }
                setProcessing(false);
            }, 'image/jpeg', 0.95);
        } catch (e) {
            console.error(e);
            setProcessing(false);
        }
    };

    const handleReset = () => {
        clearFiles();
        setResult(null);
        setGridResult(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Passport Photo Maker</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Create professional passport size photos for any country locally in your browser. No upload required.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    {!files[0] ? (
                        <FileUploader maxFiles={1} accept={{ 'image/*': [] }} />
                    ) : (
                        <div className="space-y-6">
                            {!result ? (
                                <div className="relative h-[500px] rounded-3xl overflow-hidden bg-card border border-border">
                                    <Cropper
                                        image={URL.createObjectURL(files[0].file)}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={selectedSize.aspect}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                                    <h3 className="text-lg font-bold text-center">Preview Results</h3>
                                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <p className="text-xs font-bold uppercase text-muted-foreground">Single Photo</p>
                                            <div className="border-4 border-white shadow-xl bg-white overflow-hidden"
                                                style={{ width: 140, height: 140 / selectedSize.aspect }}>
                                                <img src={result.url} className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                onClick={() => downloadFile(result.blob, result.name)}
                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 w-full justify-center"
                                            >
                                                <Download className="w-4 h-4" /> Download
                                            </button>
                                        </div>

                                        {gridResult && (
                                            <div className="text-center space-y-4">
                                                <p className="text-xs font-bold uppercase text-muted-foreground">Print Sheet (8 Photos)</p>
                                                <div className="border-4 border-white shadow-xl bg-white overflow-hidden max-h-[300px] overflow-y-auto">
                                                    <img src={gridResult.url} className="w-full h-auto" />
                                                </div>
                                                <button
                                                    onClick={() => downloadFile(gridResult.blob, gridResult.name)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 w-full justify-center"
                                                >
                                                    <Download className="w-4 h-4" /> Download Sheet
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {!gridResult && (
                                        <div className="flex justify-center">
                                            <button
                                                onClick={handleCreateGrid}
                                                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg"
                                            >
                                                <Grid className="w-5 h-5" /> Generate Print Sheet
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-center pt-8 border-t border-border">
                                        <button onClick={handleReset} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold">
                                            <RefreshCcw className="w-4 h-4" /> Start Over
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-6">Settings</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold uppercase text-muted-foreground block mb-3">Country Standard</label>
                                <div className="space-y-2">
                                    {SIZES.map((size) => (
                                        <button
                                            key={size.id}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${selectedSize.id === size.id ? 'border-primary bg-primary/5' : 'border-secondary hover:border-primary/50'}`}
                                        >
                                            <span className="text-sm font-bold">{size.name}</span>
                                            {selectedSize.id === size.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {!result && (
                                <>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-muted-foreground block mb-3">Zoom Level</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="3"
                                            step="0.1"
                                            value={zoom}
                                            onChange={(e) => setZoom(Number(e.target.value))}
                                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>

                                    <button
                                        disabled={!files[0] || isProcessing}
                                        onClick={handleCreatePhoto}
                                        className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserSquare className="w-5 h-5" />}
                                        Generate Passport Photo
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SeoSection toolId="passport-photo" />
        </div>
    );
}
