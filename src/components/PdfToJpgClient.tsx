'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import SeoSection from '@/components/SeoSection';
import { useFileStore } from '@/store/useFileStore';
import { downloadBlob } from '@/utils/worker-helper';
import { Loader2, Download, RefreshCcw, FileImage } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

export default function PdfToJpgClient() {
    const { files, clearFiles, isProcessing, setProcessing } = useFileStore();
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<{ name: string; url: string; blob: Blob }[] | null>(null);

    const handleConvert = async () => {
        if (files.length === 0) {
            setError('Please upload a PDF file to convert.');
            return;
        }

        setProcessing(true);
        setError(null);
        setResults(null);

        try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
                'pdfjs-dist/build/pdf.worker.min.mjs',
                import.meta.url
            ).toString();

            const buffer = await files[0].file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: buffer });
            const pdf = await loadingTask.promise;

            const images: { name: string; url: string; blob: Blob }[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                if (!context) continue;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport } as any).promise;

                const blob = await new Promise<Blob>((resolve) =>
                    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9)
                );

                images.push({
                    name: `page_${i}.jpg`,
                    url: URL.createObjectURL(blob),
                    blob
                });
            }

            setResults(images);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during conversion.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReset = () => {
        if (results) {
            results.forEach(r => URL.revokeObjectURL(r.url));
        }
        clearFiles();
        setResults(null);
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">PDF to JPG</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Convert each page of your PDF into high-quality JPG images. Offline & secure.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {!results ? (
                        <FileUploader maxFiles={1} />
                    ) : (
                        <div className="space-y-6">
                            <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                                <h3 className="text-xl font-bold mb-6">Conversion Complete!</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {results.map((img, i) => (
                                        <div key={i} className="space-y-2 group">
                                            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border bg-background relative">
                                                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={async () => downloadBlob(new Uint8Array(await img.blob.arrayBuffer()), img.name, 'image/jpeg')}
                                                    className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                                >
                                                    <Download className="w-6 h-6" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold truncate px-1">{img.name}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12">
                                    <button
                                        onClick={handleReset}
                                        className="px-8 py-3 rounded-2xl bg-secondary font-bold hover:bg-border transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <RefreshCcw className="w-4 h-4" /> Convert Another
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
                        <h3 className="font-bold text-lg mb-4">Export Options</h3>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                            We render your PDF pages at 2x scale for crisp image quality. All processing is local.
                        </p>

                        <button
                            disabled={files.length === 0 || isProcessing || !!results}
                            onClick={handleConvert}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Converting...
                                </>
                            ) : (
                                <>
                                    <FileImage className="w-5 h-5" /> Convert to JPG
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <SeoSection toolId="pdf-to-jpg" />
        </div>
    );
}
