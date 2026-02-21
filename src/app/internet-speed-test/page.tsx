"use client"

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, ArrowDown, ArrowUp, Activity, Play, Square, RefreshCw } from 'lucide-react';
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
            // Just a simple smoothing for the UI
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
        <div className="min-h-screen bg-[#0a0a0b] text-white p-6 md:p-12 font-sans overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium"
                    >
                        <Wifi className="w-4 h-4" />
                        <span>Network Diagnostic Tool</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent"
                    >
                        Internet Speed Test
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-xl mx-auto"
                    >
                        Get accurate insights into your upload, download, and connection stability in seconds.
                    </motion.p>
                </div>

                {/* Speedometer Area */}
                <div className="relative flex flex-col items-center">
                    <div className="relative w-72 h-72 md:w-96 md:h-96">
                        {/* Background Circle */}
                        <svg className="w-full h-full -rotate-90 transform">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="stroke-white/5 fill-none"
                                strokeWidth="8"
                            />
                            {/* Progress Arc */}
                            <motion.circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className={cn(
                                    "fill-none transition-colors duration-1000",
                                    status === 'downloading' ? "stroke-blue-500" :
                                        status === 'uploading' ? "stroke-emerald-500" : "stroke-white/10"
                                )}
                                strokeWidth="8"
                                strokeDasharray="282%"
                                strokeDashoffset={`${282 - (progress * 2.82)}%`}
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Central Display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={status}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="space-y-1"
                                >
                                    <span className="text-7xl md:text-8xl font-black tabular-nums tracking-tighter">
                                        {status === 'idle' ? '0' : Math.floor(currentSpeed)}
                                    </span>
                                    <div className="text-xl md:text-2xl font-medium text-gray-500 tracking-widest uppercase">
                                        Mbps
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-gray-400">
                                {status === 'idle' && "READY TO TEST"}
                                {status === 'pinging' && "MEASURING LATENCY..."}
                                {status === 'downloading' && "TESTING DOWNLOAD..."}
                                {status === 'uploading' && "TESTING UPLOAD..."}
                                {status === 'complete' && "TEST COMPLETE"}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-8">
                        {status === 'idle' || status === 'complete' || status === 'error' ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startTest}
                                className="group relative flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-bold text-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-shadow hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                            >
                                <Play className="w-6 h-6 fill-current" />
                                <span>{status === 'complete' ? 'Test Again' : 'Start Test'}</span>
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={stopTest}
                                className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xl"
                            >
                                <Square className="w-6 h-6 fill-current" />
                                <span>Stop Test</span>
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ResultCard
                        label="Ping"
                        value={results.ping ? `${Math.round(results.ping)} ms` : '--'}
                        icon={<Activity className="w-5 h-5 text-amber-500" />}
                        active={status === 'pinging'}
                    />
                    <ResultCard
                        label="Download"
                        value={results.download ? `${results.download.toFixed(1)} Mbps` : '--'}
                        icon={<ArrowDown className="w-5 h-5 text-blue-500" />}
                        active={status === 'downloading'}
                    />
                    <ResultCard
                        label="Upload"
                        value={results.upload ? `${results.upload.toFixed(1)} Mbps` : '--'}
                        icon={<ArrowUp className="w-5 h-5 text-emerald-500" />}
                        active={status === 'uploading'}
                    />
                </div>

                {/* ISP & Location Info */}
                {(results.isp || results.location) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap justify-center gap-8 py-6 px-8 rounded-3xl bg-white/[0.02] border border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Operator</span>
                            <span className="text-white font-medium">{results.isp || 'Searching...'}</span>
                        </div>
                        <div className="w-px h-6 bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Server</span>
                            <span className="text-white font-medium">{results.location || 'Locating...'}</span>
                        </div>
                    </motion.div>
                )}

                {/* Recommendations */}
                {status === 'complete' && results.download && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center"
                    >
                        <h3 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-2">Connection Rating</h3>
                        <p className="text-2xl font-semibold text-blue-400">
                            {getRecommendation(results.download)}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function ResultCard({ label, value, icon, active }: { label: string, value: string, icon: React.ReactNode, active: boolean }) {
    return (
        <div className={cn(
            "relative p-6 rounded-3xl bg-white/[0.03] border border-white/10 transition-all duration-500",
            active && "bg-white/[0.08] border-white/20 ring-1 ring-white/20 scale-[1.02]"
        )}>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    {icon}
                </div>
                <span className="text-gray-400 font-medium">{label}</span>
            </div>
            <div className="text-3xl font-bold tabular-nums">
                {value}
            </div>
            {active && (
                <motion.div
                    layoutId="active-glow"
                    className="absolute inset-0 rounded-3xl bg-blue-500/5 blur-xl pointer-events-none"
                />
            )}
        </div>
    );
}
