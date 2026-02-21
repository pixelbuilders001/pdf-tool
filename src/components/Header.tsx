'use client';

import Link from 'next/link';
import { Moon, Sun, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border glass">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
                    <FileText className="w-8 h-8" />
                    <span>PDF Toolkit</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/merge-pdf" className="text-sm font-medium hover:text-primary transition-colors">Merge</Link>
                    <Link href="/split-pdf" className="text-sm font-medium hover:text-primary transition-colors">Split</Link>
                    <Link href="/compress-pdf" className="text-sm font-medium hover:text-primary transition-colors">Compress</Link>
                    <Link href="/pdf-to-jpg" className="text-sm font-medium hover:text-primary transition-colors">Convert</Link>
                </nav>

                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
}
