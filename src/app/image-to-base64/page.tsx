'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { Loader2, Copy, Check, Code, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageToBase64Page() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [result, setResult] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setError(null);

        try {
            const file = files[0].file;
            const reader = new FileReader();

            const base64 = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            setResult(base64);
        } catch (err) {
            setError('Failed to convert image to Base64');
        } finally {
            setProcessing(false);
        }
    };

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
                <h1 className="text-4xl font-bold mb-4">Image to Base64</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Convert any image into a Base64 string for embedding in HTML, CSS, or JSON.
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
                            className="p-8 rounded-3xl bg-secondary/20 border border-border space-y-4"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold">Base64 Output</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy String'}
                                    </button>
                                </div>
                            </div>
                            <div className="relative group">
                                <textarea
                                    readOnly
                                    value={result}
                                    className="w-full h-64 bg-background border border-border rounded-xl p-4 text-xs font-mono resize-none focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <button
                                onClick={handleReset}
                                className="w-full py-3 rounded-xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCcw className="w-4 h-4" /> Convert Another
                            </button>
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
                        <h3 className="font-bold text-lg mb-6">Convert Options</h3>
                        <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
                            Base64 strings allow you to include image data directly in code. Note that Base64 strings are about 33% larger than the original binary file.
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
                                    <Code className="w-5 h-5" /> Get Base64
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="image-to-base64" />
        </div>
    );
}
