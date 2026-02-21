'use client';

import { useState, useRef, useEffect } from 'react';
import SeoSection from '@/components/SeoSection';
import { downloadFile } from '@/utils/worker-helper';
import { Download, QrCode, RefreshCcw, Copy, Check, Link as LinkIcon, Wifi, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';

export default function QrGeneratorPage() {
    const [text, setText] = useState('https://google.com');
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [type, setType] = useState<'url' | 'text' | 'wifi'>('url');

    // Wi-Fi states
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA');

    const generateQR = async () => {
        let content = text;
        if (type === 'wifi') {
            content = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
        }

        try {
            const url = await QRCode.toDataURL(content, {
                width: 800,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });
            setQrUrl(url);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        generateQR();
    }, [text, type, ssid, password, encryption]);

    const handleDownload = async () => {
        if (!qrUrl) return;
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        downloadFile(blob, `qrcode_${Date.now()}.png`);
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">QR Code Generator</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Create high-quality QR codes for URLs, Wi-Fi, and text instantly. 100% private and ready for print.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    <div className="p-8 rounded-3xl bg-secondary/10 border border-border flex flex-col items-center justify-center space-y-8">
                        {qrUrl ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-white rounded-2xl shadow-2xl relative group"
                            >
                                <img src={qrUrl} className="w-64 h-64" alt="QR Code" />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                    <QrCode className="w-12 h-12 text-black/20" />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="w-64 h-64 bg-secondary/20 animate-pulse rounded-2xl" />
                        )}

                        <div className="flex gap-4 w-full max-w-md">
                            <button
                                onClick={handleDownload}
                                className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Download className="w-5 h-5" /> Download PNG
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border sticky top-24">
                        <h3 className="font-bold text-lg mb-6">QR Content</h3>

                        <div className="flex gap-2 p-1 bg-secondary rounded-xl mb-6">
                            {[
                                { id: 'url', icon: LinkIcon, label: 'URL' },
                                { id: 'text', icon: Type, label: 'Text' },
                                { id: 'wifi', icon: Wifi, label: 'Wi-Fi' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setType(t.id as any)}
                                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-bold transition-all ${type === t.id ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <t.icon className="w-4 h-4" />
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {type === 'url' && (
                                <div>
                                    <label className="text-xs uppercase font-bold text-muted-foreground block mb-2">Website URL</label>
                                    <input
                                        type="url"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary outline-none transition-all font-mono text-xs"
                                    />
                                </div>
                            )}

                            {type === 'text' && (
                                <div>
                                    <label className="text-xs uppercase font-bold text-muted-foreground block mb-2">Plain Text</label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Enter any secret message..."
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary outline-none transition-all font-mono text-xs h-32 resize-none"
                                    />
                                </div>
                            )}

                            {type === 'wifi' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div>
                                        <label className="text-xs uppercase font-bold text-muted-foreground block mb-2">Network Name (SSID)</label>
                                        <input
                                            type="text"
                                            value={ssid}
                                            onChange={(e) => setSsid(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary outline-none transition-all text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase font-bold text-muted-foreground block mb-2">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary outline-none transition-all text-xs"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SeoSection toolId="qr-generator" />
        </div>
    );
}
