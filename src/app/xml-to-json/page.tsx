'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadBlob } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, FileJson } from 'lucide-react';
import { XMLParser } from 'fast-xml-parser';
import { motion } from 'framer-motion';

export default function XmlToJsonPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const handleConvert = async () => {
        if (files.length === 0) {
            setError('Please upload an XML file.');
            return;
        }

        setProcessing(true);
        setError(null);
        setResult(null);

        try {
            const file = files[0].file;
            const text = await file.text();

            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: "@_"
            });
            const jsonObj = parser.parse(text);
            const jsonString = JSON.stringify(jsonObj, null, 4);
            setResult(jsonString);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during conversion.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = () => {
        if (result) {
            const blob = new Blob([result], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted_data.json';
            a.click();
            URL.revokeObjectURL(url);
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
                <h1 className="text-4xl font-bold mb-4">XML to JSON</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Convert XML documents into clean, structured JSON objects instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!result ? (
                        <FileUploader
                            accept={{ 'text/xml': ['.xml'], 'application/xml': ['.xml'] }}
                        />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-12 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-6"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                <Download className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold">Conversion Complete!</h3>
                                <p className="text-muted-foreground mt-2">Your XML has been converted to JSON.</p>
                            </div>

                            <div className="bg-card p-4 rounded-xl border border-border max-h-60 overflow-auto">
                                <pre className="text-xs text-left whitespace-pre-wrap font-mono">
                                    {result}
                                </pre>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <button
                                    onClick={handleDownload}
                                    className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" /> Download JSON
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
                        <h3 className="font-bold text-lg mb-4">Options</h3>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                            Attributes will be prefixed with @_ in the resulting JSON.
                        </p>

                        <button
                            disabled={files.length === 0 || isProcessing || !!result}
                            onClick={handleConvert}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Converting...
                                </>
                            ) : (
                                <>
                                    <FileJson className="w-5 h-5" /> Convert to JSON
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <SeoSection toolId="xml-to-json" />
        </div>
    );
}
