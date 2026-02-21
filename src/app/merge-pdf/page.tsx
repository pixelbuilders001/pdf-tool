'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { spawnWorker, downloadBlob } from '@/utils/worker-helper';
import { motion, AnimatePresence } from 'framer-motion';
import { Merge, Loader2, Download, RefreshCcw } from 'lucide-react';

export default function MergePdfPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Uint8Array | null>(null);

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please select at least 2 PDF files to merge.');
            return;
        }

        setProcessing(true);
        setError(null);
        setResult(null);

        try {
            // Read all files as buffers
            const buffers = await Promise.all(
                files.map(f => f.file.arrayBuffer())
            );

            const mergedPdf = await spawnWorker('MERGE_PDFS', { files: buffers });
            setResult(mergedPdf);
        } catch (err: any) {
            setError(err.message || 'An error occurred during merging.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = () => {
        if (result) {
            downloadBlob(result, 'merged_document.pdf', 'application/pdf');
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
                <h1 className="text-4xl font-bold mb-4">Merge PDF</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Combine multiple PDF files into a single document. Reorder files as needed before merging.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!result ? (
                        <FileUploader />
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
                                <h3 className="text-2xl font-bold">Merging Complete!</h3>
                                <p className="text-muted-foreground mt-2">Your single merged PDF is ready for download.</p>
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
                                    <RefreshCcw className="w-5 h-5" /> Merge More
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
                        <h3 className="font-bold text-lg mb-4">Tool Settings</h3>
                        <p className="text-xs text-muted-foreground mb-6">
                            Processing happens entirely in your browser. Large files may take a moment.
                        </p>

                        <button
                            disabled={files.length < 2 || isProcessing || !!result}
                            onClick={handleMerge}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Merging...
                                </>
                            ) : (
                                <>
                                    <Merge className="w-5 h-5" /> Merge PDF
                                </>
                            )}
                        </button>
                    </div>

                    <div className="p-6 rounded-3xl bg-secondary/20 border border-border">
                        <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">Pro Tip</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            You can drag and drop your files in the queue to change the order they appear in the final document.
                        </p>
                    </div>
                </div>
            </div>

            <SeoSection toolId="merge" />
        </div>
    );
}
