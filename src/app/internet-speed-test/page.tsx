"use client"

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Wifi, ArrowDown, ArrowUp, Activity, Play, Square, ChevronDown, Monitor, MapPin, Server } from 'lucide-react';
import { useSpeedTest } from '@/hooks/useSpeedTest';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

export default function InternetSpeedTest() {
    const { status, results, progress, startTest, stopTest } = useSpeedTest();
    const [currentSpeed, setCurrentSpeed] = useState(0);

    // Smooth speed display during download/upload
    useEffect(() => {
        if (status === 'downloading' || status === 'uploading') {
            const targetSpeed = results.download || results.upload || 0;
            setCurrentSpeed(prev => prev + (targetSpeed - prev) * 0.1);
        } else if (status === 'complete') {
            setCurrentSpeed(results.download || 0);
        } else {
            setCurrentSpeed(0);
        }
    }, [status, results]);

    const getRecommendation = (speed: number) => {
        if (speed > 100) return "Excellent for 4K streaming & heavy gaming";
        if (speed > 50) return "Great for HD streaming & multiple devices";
        if (speed > 20) return "Good for standard usage & work from home";
        if (speed > 5) return "Stable for basic browsing & video calls";
        return "Low speed, might experience buffering";
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">


            {/* Speedometer Section */}
            <section className="py-8 px-6 flex flex-col items-center border-y border-border/40 bg-secondary/10">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
                        {/* Background Dial */}
                        <svg className="w-full h-full -rotate-90 transform">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="42%"
                                className="stroke-muted fill-none"
                                strokeWidth="12"
                                strokeDasharray="264%"
                                strokeDashoffset="0"
                            />
                            {/* Static notches */}
                            {[...Array(20)].map((_, i) => (
                                <line
                                    key={i}
                                    x1="50%" y1="8%" x2="50%" y2="12%"
                                    className="stroke-muted-foreground/30"
                                    strokeWidth="2"
                                    transform={`rotate(${i * 18} ${450 / 2} ${450 / 2})`}
                                />
                            ))}
                            {/* Progress Arc */}
                            <motion.circle
                                cx="50%"
                                cy="50%"
                                r="42%"
                                className={cn(
                                    "fill-none transition-colors duration-700",
                                    status === 'downloading' ? "stroke-primary" :
                                        status === 'uploading' ? "stroke-emerald-500" : "stroke-muted"
                                )}
                                strokeWidth="12"
                                strokeDasharray="264%"
                                strokeDashoffset={`${264 - (progress * 2.64)}%`}
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Central Display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={status}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-0"
                                >
                                    <span className="text-8xl md:text-[120px] font-black tabular-nums tracking-tighter text-foreground leading-none">
                                        {status === 'idle' ? '0' : Math.floor(currentSpeed)}
                                    </span>
                                    <div className="text-2xl md:text-3xl font-bold text-muted-foreground tracking-widest uppercase pb-2">
                                        Mbps
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-widest uppercase">
                                {status === 'idle' && "STANDBY"}
                                {status === 'pinging' && "PINGING..."}
                                {status === 'downloading' && "DOWNLOADING"}
                                {status === 'uploading' && "UPLOADING"}
                                {status === 'complete' && "FINISH"}
                                {status === 'error' && "ERROR"}
                            </div>
                        </div>
                    </div>


                </div>
                <div className="flex justify-center gap-4">
                    {status === 'idle' || status === 'complete' || status === 'error' ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={startTest}
                            className="btn-primary flex items-center gap-2 text-sm py-3 px-8 shadow-lg shadow-primary/20"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{status === 'complete' ? 'Run Again' : 'Start Speed Test'}</span>
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={stopTest}
                            className="px-8 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive font-bold text-sm flex items-center gap-2"
                        >
                            <Square className="w-4 h-4 fill-current" />
                            <span>Stop Test</span>
                        </motion.button>
                    )}
                </div>
            </section>

            {/* Detailed Results Section */}
            <section className="py-10 px-6 container mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <DetailedResultCard
                        label="Latency"
                        value={results.ping ? `${Math.round(results.ping)} ms` : '--'}
                        icon={<Activity className="w-6 h-6" />}
                        description="Time taken for a small packet of data to travel to the server and back."
                        color="amber"
                        active={status === 'pinging'}
                    />
                    <DetailedResultCard
                        label="Download Speed"
                        value={results.download ? `${results.download.toFixed(1)} Mbps` : '--'}
                        icon={<ArrowDown className="w-6 h-6" />}
                        description="The speed at which data is transferred from the internet to your device."
                        color="blue"
                        active={status === 'downloading'}
                    />
                    <DetailedResultCard
                        label="Upload Speed"
                        value={results.upload ? `${results.upload.toFixed(1)} Mbps` : '--'}
                        icon={<ArrowUp className="w-6 h-6" />}
                        description="The speed at which data is sent from your device to the internet."
                        color="emerald"
                        active={status === 'uploading'}
                    />
                </div>

                {/* Rating Banner */}
                <AnimatePresence>
                    {status === 'complete' && results.download && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-10 rounded-[2rem] glass border border-primary/20 bg-primary/[0.03] text-center space-y-4 shadow-2xl shadow-primary/5"
                        >
                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                                <Wifi className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs">Connection Quality</h3>
                            <p className="text-3xl md:text-4xl font-extrabold text-foreground">
                                {getRecommendation(results.download)}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Network Provider Details */}
            <section className="pb-32 px-6">
                <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-card border border-border/80 p-8 md:p-12 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-secondary flex items-center justify-center">
                                    <Server className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Service Provider</h4>
                                    <p className="text-xl font-bold text-foreground mt-1">{results.isp || (status === 'idle' ? 'Ready to analyze' : 'Searching...')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-secondary flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Server Location</h4>
                                    <p className="text-xl font-bold text-foreground mt-1">{results.location || (status === 'idle' ? 'Pending test' : 'Locating...')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/50 rounded-3xl p-6 border border-border/40 flex flex-col justify-center">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Our speed test uses high-performance nodes to ensure maximum accuracy.
                                <br /><br />
                                <span className="text-xs font-medium">Measurement conducted via secure XHR protocols.</span>
                            </p>
                            <div className="mt-6 flex gap-2">
                                <span className="px-2 py-1 rounded bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-tighter">Safe</span>
                                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase tracking-tighter">Private</span>
                                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-tighter">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer space */}
            <footer className="py-12 border-t border-border/40 text-center">
                <p className="text-muted-foreground text-sm">Powered by Cloudflare Infrastructure & libtoolkit</p>
            </footer>
        </div>
    );
}

function DetailedResultCard({ label, value, icon, description, color, active }: any) {
    const colorClasses: any = {
        amber: "text-amber-500 bg-amber-500/10",
        blue: "text-blue-500 bg-blue-500/10",
        emerald: "text-emerald-500 bg-emerald-500/10"
    };

    return (
        <div className={cn(
            "p-8 rounded-[2rem] bg-card border border-border/60 transition-all duration-500 relative overflow-hidden",
            active && "ring-2 ring-primary border-transparent shadow-2xl shadow-primary/10"
        )}>
            {active && (
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                />
            )}

            <div className="flex justify-between items-start mb-6">
                <div className={cn("p-4 rounded-2xl flex items-center justify-center", colorClasses[color])}>
                    {icon}
                </div>
                {active && (
                    <span className="text-[10px] font-bold text-primary animate-pulse tracking-widest uppercase">Measuring</span>
                )}
            </div>

            <div className="space-y-1 mb-4">
                <h4 className="text-muted-foreground font-bold tracking-widest text-[11px] uppercase">{label}</h4>
                <div className="text-4xl font-extrabold text-foreground tracking-tight tabular-nums">
                    {value}
                </div>
            </div>

            <p className="text-muted-foreground/70 text-sm leading-relaxed border-t border-border/40 pt-4 mt-4">
                {description}
            </p>
        </div>
    );
}
