import { PDFDocument } from 'pdf-lib';

/**
 * Web Worker for PDF Processing
 * This worker handles heavy PDF tasks to avoid blocking the main thread.
 */

self.onmessage = async (event) => {
    const { type, payload } = event.data;

    try {
        switch (type) {
            case 'MERGE_PDFS':
                const mergedPdf = await mergePdfs(payload.files);
                self.postMessage({ type: 'SUCCESS', payload: mergedPdf });
                break;
            case 'SPLIT_PDF':
                const splitPdfs = await splitPdf(payload.file, payload.ranges);
                self.postMessage({ type: 'SUCCESS', payload: splitPdfs });
                break;
            default:
                self.postMessage({ type: 'ERROR', message: 'Unknown task type' });
        }
    } catch (error: any) {
        self.postMessage({ type: 'ERROR', message: error.message });
    }
};

async function mergePdfs(fileBuffers: ArrayBuffer[]) {
    const mergedPdf = await PDFDocument.create();

    for (const buffer of fileBuffers) {
        const pdf = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    return pdfBytes;
}

async function splitPdf(fileBuffer: ArrayBuffer, ranges: { start: number; end: number }[]) {
    const sourcePdf = await PDFDocument.load(fileBuffer);
    const results = [];

    for (const range of ranges) {
        const newPdf = await PDFDocument.create();
        const pageIndices = [];
        for (let i = range.start - 1; i < range.end; i++) {
            if (i >= 0 && i < sourcePdf.getPageCount()) {
                pageIndices.push(i);
            }
        }

        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        results.push({ name: `split_${range.start}-${range.end}.pdf`, data: pdfBytes });
    }

    return results;
}
