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
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(true); // show by default
    const [showInstructions, setShowInstructions] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Hide button if already installed as PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstallable(false);
            return;
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Native install prompt available
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsInstallable(false);
            }
            setDeferredPrompt(null);
        } else {
            // Show manual instructions as fallback
            setShowInstructions(true);
        }
    };




    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

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
        <>
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

                        {/* <Link href="#" className="px-4 py-2 text-[15px] font-bold text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors">Pricing</Link> */}
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

                        {isInstallable && (
                            <button
                                onClick={handleInstallClick}
                                className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95"
                            >
                                <LucideIcons.Download className="w-4 h-4" />
                                Download App
                            </button>
                        )}


                    </div>
                </div>
            </header>



            {/* Mobile Nav Drawer & Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-card z-[110] lg:hidden border-r border-border shadow-2xl flex flex-col h-screen"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <span>PDF Toolkit</span>
                                </Link>
                                <div className="flex items-center gap-2">
                                    {isInstallable && (
                                        <button
                                            onClick={handleInstallClick}
                                            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2"
                                        >
                                            <LucideIcons.Download className="w-5 h-5" />
                                            <span className="text-xs font-bold">App</span>
                                        </button>
                                    )}




                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Drawer Content */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                                <div className="p-6 space-y-8 pb-12">
                                    <nav className="space-y-6">


                                        {categories.map((cat) => (
                                            <div key={cat.id} className="space-y-3">
                                                <div className="flex items-center gap-2 px-4">
                                                    <cat.icon className="w-4 h-4 text-primary" />
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{cat.name}</h4>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {SEO_CONFIG.tools
                                                        .filter(t => t.category === cat.id)
                                                        .map((tool) => {
                                                            // @ts-ignore
                                                            const Icon = LucideIcons[tool.icon] as LucideIcon || LucideIcons.File;
                                                            return (
                                                                <Link
                                                                    key={tool.id}
                                                                    href={tool.path}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/5 group transition-all"
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                                        <Icon className="w-4 h-4" />
                                                                    </div>
                                                                    <span className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</span>
                                                                </Link>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-6 border-t border-border space-y-1">

                                            <Link href="#" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-secondary transition-colors font-bold text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                                                Support
                                                <LucideIcons.MessageSquare className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </nav>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 bg-secondary/10 border-t border-border shrink-0 mt-auto">
                                <div className="flex items-center justify-between">
                                    <div className="text-[12px] font-bold text-muted-foreground">
                                        Toggle Dark Mode
                                    </div>
                                    <button
                                        onClick={() => setIsDark(!isDark)}
                                        className="p-2.5 rounded-xl bg-secondary hover:bg-primary/10 transition-all text-foreground"
                                    >
                                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Fallback Install Instructions */}
            <AnimatePresence>
                {showInstructions && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowInstructions(false)}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-card border border-border rounded-3xl shadow-2xl z-[210] p-8"
                        >
                            <div className="text-center space-y-5">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                                    <LucideIcons.Download className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">Install App</h3>
                                    <p className="text-muted-foreground text-sm mt-1">To install, follow these steps in your browser:</p>
                                </div>
                                <div className="bg-secondary/50 rounded-2xl p-5 text-left space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                                        <p className="text-sm font-semibold">Tap the <span className="text-primary font-bold">Share</span> icon (iOS) or <span className="text-primary font-bold">⋮ Menu</span> (Android/Chrome).</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                                        <p className="text-sm font-semibold">Select <span className="text-primary font-bold">"Add to Home Screen"</span> or <span className="text-primary font-bold">"Install App"</span>.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowInstructions(false)}
                                    className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    Got it
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}





