'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { spawnWorker, downloadBlob } from '@/utils/worker-helper';
import { motion } from 'framer-motion';
import { Scissors, Loader2, Download, RefreshCcw, Plus, Trash2 } from 'lucide-react';

export default function SplitPdfPage() {
    const { files, clearFiles, isProcessing, setProcessing, removeFile } = useFileStore();
    const [error, setError] = useState<string | null>(null);
    const [ranges, setRanges] = useState([{ start: 1, end: 1 }]);
    const [results, setResults] = useState<{ name: string; data: Uint8Array }[] | null>(null);

    const handleAddRange = () => {
        setRanges([...ranges, { start: 1, end: 1 }]);
    };

    const handleRemoveRange = (index: number) => {
        if (ranges.length > 1) {
            setRanges(ranges.filter((_, i) => i !== index));
        }
    };

    const handleRangeChange = (index: number, field: 'start' | 'end', value: string) => {
        const val = parseInt(value) || 0;
        const newRanges = [...ranges];
        newRanges[index][field] = val;
        setRanges(newRanges);
    };

    const handleSplit = async () => {
        if (files.length === 0) {
            setError('Please upload a PDF file to split.');
            return;
        }

        setProcessing(true);
        setError(null);
        setResults(null);

        try {
            const buffer = await files[0].file.arrayBuffer();
            const splitFiles = await spawnWorker('SPLIT_PDF', {
                file: buffer,
                ranges
            });
            setResults(splitFiles);
        } catch (err: any) {
            setError(err.message || 'An error occurred during splitting.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        clearFiles();
        setResults(null);
        setError(null);
        setRanges([{ start: 1, end: 1 }]);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Split PDF</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Extract specific page ranges into new PDF files. Processing is 100% private.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!results ? (
                        <FileUploader maxFiles={1} />
                    ) : (
                        <div className="space-y-4">
                            <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                    <Download className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold">Files Ready!</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    {results.map((res, i) => (
                                        <button
                                            key={i}
                                            onClick={() => downloadBlob(res.data, res.name, 'application/pdf')}
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
                                        <RefreshCcw className="w-4 h-4" /> Start New Split
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-4">Split Ranges</h3>

                        <div className="space-y-4 mb-6">
                            {ranges.map((range, idx) => (
                                <div key={idx} className="flex items-end gap-2 p-3 rounded-xl bg-secondary/50">
                                    <div className="flex-grow space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">From</label>
                                        <input
                                            type="number"
                                            value={range.start}
                                            onChange={(e) => handleRangeChange(idx, 'start', e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div className="pb-3 text-muted-foreground">-</div>
                                    <div className="flex-grow space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">To</label>
                                        <input
                                            type="number"
                                            value={range.end}
                                            onChange={(e) => handleRangeChange(idx, 'end', e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    {ranges.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveRange(idx)}
                                            className="p-2 mb-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={handleAddRange}
                                className="w-full py-2 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Range
                            </button>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !!results}
                            onClick={handleSplit}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Splitting...
                                </>
                            ) : (
                                <>
                                    <Scissors className="w-5 h-5" /> Split PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <SeoSection toolId="split" />
        </div>
    );
}
