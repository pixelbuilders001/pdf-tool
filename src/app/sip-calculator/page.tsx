'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, RefreshCcw, Wallet, BarChart3, PieChart } from 'lucide-react';
import SeoSection from '@/components/SeoSection';

export default function SipCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
    const [returnRate, setReturnRate] = useState<number>(12);
    const [timePeriod, setTimePeriod] = useState<number>(10);

    const [totalInvestment, setTotalInvestment] = useState<number>(0);
    const [estimatedReturns, setEstimatedReturns] = useState<number>(0);
    const [totalValue, setTotalValue] = useState<number>(0);

    const calculateSip = () => {
        const p = monthlyInvestment;
        const i = returnRate / 12 / 100;
        const n = timePeriod * 12;

        // Formula: M = P * [ (1 + i)^n - 1 ] * (1 + i) / i
        const maturityValue = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const invested = p * n;
        const returns = maturityValue - invested;

        setTotalInvestment(invested);
        setEstimatedReturns(returns);
        setTotalValue(maturityValue);
    };

    useEffect(() => {
        calculateSip();
    }, [monthlyInvestment, returnRate, timePeriod]);

    const returnsPercentage = (estimatedReturns / totalValue) * 100;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Investment</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">SIP <span className="text-primary italic">Calculator</span></h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Visualize your long-term wealth creation. Calculate potential returns from Systematic Investment Plans (SIP).
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
                {/* Inputs */}
                <div className="lg:col-span-5 space-y-8 p-8 rounded-[2.5rem] bg-card border border-border/60 shadow-sm">
                    <div className="space-y-8">
                        <InputGroup label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} min={500} max={1000000} step={500} unit="₹" />
                        <InputGroup label="Expected Return Rate (p.a)" value={returnRate} onChange={setReturnRate} min={1} max={30} step={0.5} unit="%" />
                        <InputGroup label="Time Period" value={timePeriod} onChange={setTimePeriod} min={1} max={40} step={1} unit="Y" />
                    </div>
                </div>

                {/* Summary & Visualization */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SimpleCard label="Invested" value={Math.round(totalInvestment).toLocaleString()} color="text-muted-foreground" />
                        <SimpleCard label="Returns" value={Math.round(estimatedReturns).toLocaleString()} color="text-emerald-500" />
                        <SimpleCard label="Total Value" value={Math.round(totalValue).toLocaleString()} color="text-primary" highlight />
                    </div>

                    <div className="p-10 rounded-[2.5rem] bg-card border border-border/60 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-primary" />
                                Portfolio Mix
                            </h3>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-secondary-foreground/20"></div> Principal</div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Wealth Gained</div>
                            </div>
                        </div>

                        <div className="relative h-12 w-full bg-secondary/30 rounded-2xl overflow-hidden flex border border-border/50">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${100 - returnsPercentage}%` }}
                                className="h-full bg-slate-200 dark:bg-slate-800"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${returnsPercentage}%` }}
                                className="h-full bg-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8 text-center">
                            <div className="space-y-1">
                                <div className="text-3xl font-black italic">{(100 - returnsPercentage).toFixed(1)}%</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Original Capital</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-black text-emerald-500 italic">{returnsPercentage.toFixed(1)}%</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Return on Investment</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SeoSection toolId="sip-calculator" />
        </div>
    );
}

function InputGroup({ label, value, onChange, min, max, step, unit }: any) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</label>
                <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-lg border border-border">
                    <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="bg-transparent text-right font-black outline-none w-20 text-primary text-sm" />
                    <span className="text-[10px] font-bold text-muted-foreground">{unit}</span>
                </div>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" />
        </div>
    );
}

function SimpleCard({ label, value, color, highlight }: any) {
    return (
        <div className={`p-6 rounded-3xl border border-border/60 bg-card space-y-1 ${highlight ? 'ring-2 ring-primary/20 bg-primary/[0.02]' : ''}`}>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
            <div className={`text-xl font-black tracking-tight ${color}`}>₹{value}</div>
        </div>
    );
}
