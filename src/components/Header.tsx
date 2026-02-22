'use client';

import Link from 'next/link';
import { Moon, Sun, FileText, User, LayoutGrid, ChevronDown, LucideIcon, X, Menu, Search, Briefcase, HelpCircle, ShieldCheck, Zap, ArrowRight, Calculator } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO_CONFIG } from '@/seo/config';
import * as LucideIcons from 'lucide-react';

export default function Header() {
    const [isDark, setIsDark] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDark]);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsMenuOpen(false);
        }, 200);
    };

    const categories = [
        { id: 'pdf', name: 'PDF Tools', icon: FileText },
        { id: 'image', name: 'Image Tools', icon: Search },
        { id: 'utility', name: 'Utility Tools', icon: Briefcase },
        { id: 'advanced', name: 'Advanced AI', icon: Zap },
        { id: 'calculators', name: 'Calculators', icon: Calculator }
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-foreground shrink-0 group">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                        <FileText className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <span className="hidden sm:inline-block">PDF Toolkit</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    <Link href="/" className="px-4 py-2 text-[15px] font-bold text-foreground hover:bg-secondary rounded-lg transition-colors">Home</Link>

                    {/* Mega Menu Trigger */}
                    <div
                        className="relative h-20 flex items-center"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            className={`px-4 py-2 text-[15px] font-bold transition-all flex items-center gap-1.5 rounded-lg ${isMenuOpen ? 'bg-primary/5 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                        >
                            Tools <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="fixed top-20 left-0 w-full bg-card border-b border-border shadow-2xl overflow-hidden z-[60]"
                                >
                                    <div className="container mx-auto px-4 py-12">
                                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                                            {categories.map((cat) => (
                                                <div key={cat.id} className="space-y-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                                                            <cat.icon className="w-3.5 h-3.5 text-primary" />
                                                        </div>
                                                        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/70">
                                                            {cat.name}
                                                        </h4>
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {SEO_CONFIG.tools
                                                            .filter(t => t.category === cat.id)
                                                            .map((tool) => {
                                                                // @ts-ignore
                                                                const Icon = LucideIcons[tool.icon] as LucideIcon || LucideIcons.File;
                                                                return (
                                                                    <li key={tool.id}>
                                                                        <Link
                                                                            href={tool.path}
                                                                            onClick={() => setIsMenuOpen(false)}
                                                                            className="flex items-center gap-3 group p-2.5 rounded-xl hover:bg-primary/[0.03] transition-all"
                                                                        >
                                                                            <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                                                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                                                                            </div>
                                                                            <span className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors truncate">{tool.name}</span>
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            })}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mega Menu Footer */}
                                    <div className="bg-secondary/20 p-6">
                                        <div className="container mx-auto px-4 flex items-center justify-between">
                                            <div className="flex items-center gap-8">
                                                <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                    Client-Side Privacy
                                                </div>
                                                <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                                                    <Zap className="w-4 h-4 text-amber-500" />
                                                    Instant Performance
                                                </div>
                                                <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                                                    <HelpCircle className="w-4 h-4 text-blue-500" />
                                                    24/7 Support
                                                </div>
                                            </div>
                                            <Link
                                                href="#"
                                                className="group flex items-center gap-2 text-sm font-black text-primary px-6 py-2.5 bg-primary/10 rounded-full hover:bg-primary/20 transition-all uppercase tracking-widest"
                                            >
                                                Explore All Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="#" className="px-4 py-2 text-[15px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors">Pricing</Link>
                    <Link href="#" className="px-4 py-2 text-[15px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors">Support</Link>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2.5 rounded-xl hover:bg-secondary transition-all text-muted-foreground active:scale-95"
                        aria-label="Toggle Dark Mode"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        className="lg:hidden p-2.5 rounded-xl bg-secondary text-foreground active:scale-95"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-20 z-40 bg-background lg:hidden border-t border-border overflow-y-auto"
                    >
                        <div className="p-6 space-y-10">
                            <nav className="flex flex-col gap-2">
                                <Link href="/" className="px-4 py-4 text-xl font-black border-b border-border flex items-center justify-between group" onClick={() => setIsMobileMenuOpen(false)}>
                                    Home <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                                </Link>

                                {categories.map((cat) => (
                                    <div key={cat.id} className="pt-4 space-y-4">
                                        <div className="flex items-center gap-2 px-4">
                                            <cat.icon className="w-4 h-4 text-primary" />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{cat.name}</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 px-2">
                                            {SEO_CONFIG.tools
                                                .filter(t => t.category === cat.id)
                                                .map((tool) => (
                                                    <Link
                                                        key={tool.id}
                                                        href={tool.path}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/50 active:bg-primary/10 transition-colors border border-border/50"
                                                    >
                                                        <span className="text-[14px] font-bold truncate">{tool.name}</span>
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-8 space-y-3">
                                    <Link href="#" className="px-4 py-4 text-xl font-bold flex items-center justify-between border-t border-border pt-8" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                                    <Link href="#" className="px-4 py-4 text-xl font-bold flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
                                </div>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
