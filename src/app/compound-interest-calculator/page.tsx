'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, RefreshCcw, TrendingUp, Landmark, Calculator } from 'lucide-react';
import SeoSection from '@/components/SeoSection';

export default function CompoundInterestCalculator() {
    const [principal, setPrincipal] = useState<number>(100000);
    const [rate, setRate] = useState<number>(8);
    const [time, setTime] = useState<number>(5);
    const [frequency, setFrequency] = useState<number>(1); // 1 = Yearly, 2 = Half, 4 = Quarter, 12 = Monthly

    const [maturityAmount, setMaturityAmount] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);

    const calculateCi = () => {
        // Formula: A = P(1 + r/n)^(nt)
        const p = principal;
        const r = rate / 100;
        const n = frequency;
        const t = time;

        const amount = p * Math.pow(1 + r / n, n * t);
        setMaturityAmount(amount);
        setTotalInterest(amount - p);
    };

    useEffect(() => {
        calculateCi();
    }, [principal, rate, time, frequency]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Wealth Building</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Compound <span className="text-primary italic">Interest</span></h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    The eighth wonder of the world. Calculate how your investments grow exponentially over time with compounding.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
                <div className="space-y-8 p-8 md:p-10 rounded-[2.5rem] bg-card border border-border/60 shadow-sm">
                    <div className="space-y-8">
                        <InputGroup label="Principal Amount (₹)" value={principal} onChange={setPrincipal} min={1000} max={100000000} step={1000} unit="₹" />
                        <InputGroup label="Interest Rate (p.a)" value={rate} onChange={setRate} min={1} max={50} step={0.1} unit="%" />
                        <InputGroup label="Time Period (Years)" value={time} onChange={setTime} min={1} max={50} step={1} unit="Y" />

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Compounding Frequency</label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(parseInt(e.target.value))}
                                className="w-full p-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary outline-none font-bold text-sm appearance-none cursor-pointer"
                            >
                                <option value={1}>Yearly</option>
                                <option value={2}>Half-Yearly</option>
                                <option value={4}>Quarterly</option>
                                <option value={12}>Monthly</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-10 rounded-[2.5rem] bg-primary border border-primary/20 text-white shadow-xl shadow-primary/20 space-y-8">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Maturity Amount (A)</span>
                            <div className="text-6xl font-black tracking-tighter tabular-nums">₹{Math.round(maturityAmount).toLocaleString()}</div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Interest Earned</span>
                                <div className="text-2xl font-black text-white/90 italic">₹{Math.round(totalInterest).toLocaleString()}</div>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/10">
                                <Landmark className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Growth Insight
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                            In {time} years, your wealth increases by <span className="font-bold text-foreground">{((maturityAmount / principal - 1) * 100).toFixed(1)}%</span>.
                            The more frequently you compound, the more your money works for you.
                        </p>
                    </div>
                </div>
            </div>

            <SeoSection toolId="compound-interest-calculator" />
        </div>
    );
}

function InputGroup({ label, value, onChange, min, max, step, unit }: any) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</label>
                <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-lg border border-border">
                    <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="bg-transparent text-right font-black outline-none w-24 text-primary text-sm" />
                    <span className="text-[10px] font-bold text-muted-foreground">{unit}</span>
                </div>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" />
        </div>
    );
}
