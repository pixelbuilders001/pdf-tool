'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PercentCircle, RefreshCcw, IndianRupee, Info, CheckCircle2 } from 'lucide-react';
import SeoSection from '@/components/SeoSection';

export default function GstCalculator() {
    const [amount, setAmount] = useState<number>(10000);
    const [rate, setRate] = useState<number>(18);
    const [type, setType] = useState<'exclusive' | 'inclusive'>('exclusive');

    const [gstAmount, setGstAmount] = useState<number>(0);
    const [netAmount, setNetAmount] = useState<number>(0);
    const [grossAmount, setGrossAmount] = useState<number>(0);

    const calculateGst = () => {
        if (type === 'exclusive') {
            const gst = (amount * rate) / 100;
            setGstAmount(gst);
            setNetAmount(amount);
            setGrossAmount(amount + gst);
        } else {
            const gst = amount - (amount * (100 / (100 + rate)));
            setGstAmount(gst);
            setNetAmount(amount - gst);
            setGrossAmount(amount);
        }
    };

    useEffect(() => {
        calculateGst();
    }, [amount, rate, type]);

    const rates = [5, 12, 18, 28];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Taxation</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">GST <span className="text-primary italic">Calculator</span></h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Calculate Goods and Services Tax (GST) for Indian products and services. Toggle between Inclusive and Exclusive prices.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
                <div className="space-y-8 p-8 md:p-10 rounded-[2.5rem] bg-card border border-border/60 shadow-sm">
                    <div className="flex bg-secondary/50 p-1 rounded-2xl gap-1">
                        <button
                            onClick={() => setType('exclusive')}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${type === 'exclusive' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-secondary'}`}
                        >
                            GST Exclusive
                        </button>
                        <button
                            onClick={() => setType('inclusive')}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${type === 'inclusive' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-secondary'}`}
                        >
                            GST Inclusive
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Initial Amount (₹)</label>
                            <div className="relative group">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary outline-none text-2xl font-black tracking-tight"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">GST Rate (%)</label>
                            <div className="grid grid-cols-4 gap-3">
                                {rates.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRate(r)}
                                        className={`py-3 rounded-xl text-sm font-black transition-all border ${rate === r ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/30 border-border hover:border-primary/40'}`}
                                    >
                                        {r}%
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-10 rounded-[2.5rem] bg-card border border-border/60 shadow-sm space-y-8">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Total Price (Gross)</span>
                            <div className="text-6xl font-black tracking-tighter text-foreground">₹{Math.round(grossAmount).toLocaleString()}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BreakdownItem label="Net Amount" value={Math.round(netAmount).toLocaleString()} icon={CheckCircle2} />
                            <BreakdownItem label="Total GST" value={Math.round(gstAmount).toLocaleString()} icon={PercentCircle} color="text-primary" />
                        </div>

                        <div className="pt-6 border-t border-border space-y-4">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">GST Split (Intra-state)</h4>
                            <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-2xl">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-muted-foreground">CGST ({(rate / 2)}%) / SGST ({(rate / 2)}%)</span>
                                    <div className="text-lg font-black italic">₹{Math.round(gstAmount / 2).toLocaleString()} each</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-1 rounded">Tax Split</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SeoSection toolId="gst-calculator" />
        </div>
    );
}

function BreakdownItem({ label, value, icon: Icon, color = "text-foreground" }: any) {
    return (
        <div className="p-6 rounded-3xl bg-secondary/20 border border-border space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Icon className="w-3 h-3" /> {label}
            </span>
            <div className={`text-2xl font-black ${color}`}>₹{value}</div>
        </div>
    );
}
