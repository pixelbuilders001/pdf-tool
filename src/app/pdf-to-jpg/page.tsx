'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const PdfToJpgClient = dynamic(() => import('@/components/PdfToJpgClient'), {
    ssr: false,
    loading: () => (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse font-medium">Loading Tool...</p>
        </div>
    ),
});

export default function PdfToJpgPage() {
    return <PdfToJpgClient />;
}
