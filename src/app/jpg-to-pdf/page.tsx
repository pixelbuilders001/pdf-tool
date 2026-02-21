'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadBlob } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, ImagePlus } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { motion } from 'framer-motion';

export default function JpgToPdfPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Uint8Array | null>(null);

    const handleConvert = async () => {
        if (files.length === 0) {
            setError('Please upload at least one JPG image.');
            return;
        }

        setProcessing(true);
        setError(null);
        setResult(null);

        try {
            const pdfDoc = await PDFDocument.create();

            for (const fileItem of files) {
                const imageBuffer = await fileItem.file.arrayBuffer();
                const image = fileItem.file.type === 'image/jpeg'
                    ? await pdfDoc.embedJpg(imageBuffer)
                    : await pdfDoc.embedPng(imageBuffer);

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            setResult(pdfBytes);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during conversion.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = () => {
        if (result) {
            downloadBlob(result, 'converted_images.pdf', 'application/pdf');
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
                <h1 className="text-4xl font-bold mb-4">JPG to PDF</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Convert your images into a single PDF document. Support for JPG and PNG.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!result ? (
                        <FileUploader
                            accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
                        />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-12 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-6"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                <Download className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">PDF Created!</h3>
                                <p className="text-muted-foreground mt-2">All your images have been combined into a single PDF.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleDownload}
                                    className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" /> Download PDF
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Convert More
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
                        <h3 className="font-bold text-lg mb-4">PDF Options</h3>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                            Images will be placed on individual pages at their original dimensions. No compression is applied.
                        </p>

                        <button
                            disabled={files.length === 0 || isProcessing || !!result}
                            onClick={handleConvert}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <ImagePlus className="w-5 h-5" /> Convert to PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <SeoSection toolId="jpg-to-pdf" />
        </div>
    );
}
