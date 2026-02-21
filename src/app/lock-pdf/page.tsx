'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';

export default function LockPdfPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLock = async () => {
        if (files.length === 0 || !password) {
            setError(files.length === 0 ? 'Please upload a PDF.' : 'Password is required.');
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await files[0].file.arrayBuffer();

            // Encrypt using the specialized lite library
            // encryptPDF(pdfBytes, userPassword, ownerPassword)
            const encryptedPdfBytes = await encryptPDF(new Uint8Array(arrayBuffer), password, password);

            const blob = new Blob([encryptedPdfBytes as any], { type: 'application/pdf' });
            setResult({
                url: URL.createObjectURL(blob),
                blob,
                name: `locked_${files[0].file.name}`
            });
        } catch (err: any) {
            console.error(err);
            setError('Failed to encrypt PDF. ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        clearFiles();
        setResult(null);
        setPassword('');
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Lock PDF</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Secure your PDF documents with a password. All encryption happens locally on your device.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!result ? (
                        <FileUploader maxFiles={1} accept={{ 'application/pdf': ['.pdf'] }} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                <Lock className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold">PDF Locked Successfully!</h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => downloadFile(result.blob, result.name)}
                                    className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" /> Download Locked PDF
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Lock Another
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
                        <h3 className="font-bold text-lg mb-6">Security Settings</h3>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-xs uppercase font-bold text-muted-foreground block mb-2">Set Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min 4 characters recommended"
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary outline-none transition-all pr-12"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                                <p className="text-[10px] text-orange-500 leading-relaxed font-medium">
                                    Important: We do not store your password. If you forget it, your document cannot be recovered.
                                </p>
                            </div>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !password}
                            onClick={handleLock}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                            Lock Document
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="lock-pdf" />
        </div>
    );
}
