'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import { useFileStore } from '@/store/useFileStore';
import { downloadBlob } from '@/utils/worker-helper';
import { motion } from 'framer-motion';
import { Minimize2, Loader2, Download, RefreshCcw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function CompressPdfPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ data: Uint8Array; savings: string } | null>(null);

    const handleCompress = async () => {
        if (files.length === 0) {
            setError('Please upload a PDF file to compress.');
            return;
        }

        setProcessing(true);
        setError(null);
        setResult(null);

        try {
            const originalSize = files[0].file.size;
            const buffer = await files[0].file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(buffer);

            // Simplistic compression: re-save the PDF which can strip some metadata and optimize structure
            // Real "high" compression would require downsampling images using a WASM library like ghostscript (heavy)
            // For this 100% client side demo, we'll use pdf-lib's optimized save
            const compressedBytes = await pdfDoc.save({ useObjectStreams: true });

            const newSize = compressedBytes.length;
            const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

            setResult({
                data: compressedBytes,
                savings: parseFloat(savings) > 0 ? `${savings}%` : 'Already Optimized'
            });
        } catch (err: any) {
            setError(err.message || 'An error occurred during compression.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = () => {
        if (result) {
            downloadBlob(result.data, 'compressed_document.pdf', 'application/pdf');
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
                <h1 className="text-4xl font-bold mb-4">Compress PDF</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Reduce the file size of your PDF documents while keeping visual quality.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!result ? (
                        <FileUploader maxFiles={1} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-12 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 text-center space-y-6"
                        >
                            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto">
                                <Minimize2 className="w-10 h-10 text-indigo-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Compression Complete!</h3>
                                <p className="text-muted-foreground mt-2">
                                    Optimization result: <span className="text-indigo-500 font-bold">{result.savings}</span>
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleDownload}
                                    className="px-8 py-3 rounded-2xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" /> Download PDF
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Compress Another
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
                        <h3 className="font-bold text-lg mb-4">Optimization</h3>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                            Our tool uses object stream compression to reduce file size without significantly impacting image quality.
                        </p>

                        <button
                            disabled={files.length === 0 || isProcessing || !!result}
                            onClick={handleCompress}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Optimizing...
                                </>
                            ) : (
                                <>
                                    <Minimize2 className="w-5 h-5" /> Compress PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
