'use client';

import { useState, useRef, useEffect } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadFile } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, PenTool, Eraser, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument, rgb } from 'pdf-lib';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function SignPdfPage() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [signature, setSignature] = useState<string | null>(null);
    const [result, setResult] = useState<{ url: string; blob: Blob; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sigCanvas = useRef<SignatureCanvas>(null);

    // Preview state
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const handleClearSig = () => {
        sigCanvas.current?.clear();
        setSignature(null);
    };

    const handleSaveSig = () => {
        if (sigCanvas.current?.isEmpty()) return;
        setSignature(sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || null);
    };

    const handleSignPdf = async () => {
        if (files.length === 0 || !signature) return;

        setProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await files[0].file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const signatureImage = await pdfDoc.embedPng(signature);

            // For now, place signature on the last page at the bottom right
            const pages = pdfDoc.getPages();
            const lastPage = pages[pages.length - 1];
            const { width, height } = lastPage.getSize();

            const sigDims = signatureImage.scale(0.3);
            lastPage.drawImage(signatureImage, {
                x: width - sigDims.width - 50,
                y: 50,
                width: sigDims.width,
                height: sigDims.height,
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

            setResult({
                url: URL.createObjectURL(blob),
                blob,
                name: `signed_${files[0].file.name}`
            });
        } catch (err: any) {
            console.error(err);
            setError('Failed to sign PDF. ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        clearFiles();
        setResult(null);
        setSignature(null);
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Digital Signature</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Sign your PDF documents with a hand-drawn signature. Professional, legally-compliant, and 100% private.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!result ? (
                        <div className="space-y-8">
                            <FileUploader maxFiles={1} accept={{ 'application/pdf': ['.pdf'] }} />

                            {files.length > 0 && (
                                <div className="p-8 rounded-3xl bg-secondary/10 border border-border">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <PenTool className="w-5 h-5 text-primary" /> Draw Your Signature
                                        </h3>
                                        <div className="flex gap-2">
                                            <button onClick={handleClearSig} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border-2 border-dashed border-border overflow-hidden">
                                        <SignatureCanvas
                                            ref={sigCanvas}
                                            penColor="black"
                                            canvasProps={{ className: 'sigCanvas w-full h-48 cursor-crosshair' }}
                                        />
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={handleSaveSig}
                                            className={`px-6 py-2 rounded-xl font-bold transition-all ${signature ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
                                        >
                                            {signature ? 'Signature Captured!' : 'Use This Signature'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                <PenTool className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold">Document Signed!</h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => downloadFile(result.blob, result.name)}
                                    className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" /> Download Signed PDF
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Sign Another
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
                        <h3 className="font-bold text-lg mb-6">Instructions</h3>

                        <div className="p-4 rounded-xl bg-secondary/50 mb-8 space-y-4">
                            <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">1</div>
                                <p className="text-xs text-muted-foreground">Upload your PDF document.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">2</div>
                                <p className="text-xs text-muted-foreground">Draw your signature in the pad below.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">3</div>
                                <p className="text-xs text-muted-foreground">Click "Generate Signed PDF" to apply.</p>
                            </div>
                        </div>

                        <button
                            disabled={files.length === 0 || isProcessing || !signature}
                            onClick={handleSignPdf}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenTool className="w-5 h-5" />}
                            Generate Signed PDF
                        </button>
                    </div>
                </div>
            </div>

            <SeoSection toolId="sign-pdf" />
        </div>
    );
}
