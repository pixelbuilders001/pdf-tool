'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, RefreshCcw, Landmark, PieChart } from 'lucide-react';
import SeoSection from '@/components/SeoSection';

export default function EmiCalculator() {
    const [loanAmount, setLoanAmount] = useState<number>(1000000);
    const [interestRate, setInterestRate] = useState<number>(8.5);
    const [tenure, setTenure] = useState<number>(10);
    const [emi, setEmi] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const calculateEmi = () => {
        const p = loanAmount;
        const r = interestRate / 12 / 100;
        const n = tenure * 12;

        const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalAmt = emiValue * n;
        const totalInt = totalAmt - p;

        setEmi(emiValue);
        setTotalAmount(totalAmt);
        setTotalInterest(totalInt);
    };

    useEffect(() => {
        calculateEmi();
    }, [loanAmount, interestRate, tenure]);

    const interestPercentage = (totalInterest / totalAmount) * 100;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Calculators</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">EMI <span className="text-primary italic">Calculator</span></h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Plan your loans smarter. Calculate your Monthly Installments and see a detailed breakdown of your repayment.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
                {/* Inputs */}
                <div className="lg:col-span-5 space-y-8 p-8 rounded-[2rem] bg-card border border-border/60 shadow-sm">
                    <div className="space-y-6">
                        <InputGroup
                            label="Loan Amount"
                            value={loanAmount}
                            onChange={(val) => setLoanAmount(val)}
                            min={1000}
                            max={100000000}
                            step={1000}
                            unit="₹"
                        />
                        <InputGroup
                            label="Interest Rate (p.a)"
                            value={interestRate}
                            onChange={(val) => setInterestRate(val)}
                            min={1}
                            max={30}
                            step={0.1}
                            unit="%"
                        />
                        <InputGroup
                            label="Tenure (Years)"
                            value={tenure}
                            onChange={(val) => setTenure(val)}
                            min={1}
                            max={30}
                            step={1}
                            unit="Y"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultCard label="Monthly EMI" value={Math.round(emi).toLocaleString()} subValue="Payable every month" highlight />
                        <ResultCard label="Total Interest" value={Math.round(totalInterest).toLocaleString()} subValue="Over the full tenure" color="amber" />
                        <ResultCard label="Total Principal" value={loanAmount.toLocaleString()} subValue="Loan amount requested" color="emerald" />
                        <ResultCard label="Total Amount" value={Math.round(totalAmount).toLocaleString()} subValue="Principal + Interest" color="blue" />
                    </div>

                    {/* Visual Breakdown */}
                    <div className="p-8 rounded-[2rem] bg-card border border-border/60 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-primary" />
                                Payment Breakdown
                            </h3>
                            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Principal</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Interest</span>
                            </div>
                        </div>

                        <div className="relative h-4 w-full bg-amber-500 rounded-full overflow-hidden flex">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${100 - interestPercentage}%` }}
                                className="h-full bg-primary"
                            />
                        </div>

                        <div className="flex justify-between text-sm">
                            <div className="space-y-1">
                                <span className="text-muted-foreground block">Principal Amount</span>
                                <span className="font-bold text-foreground">{(100 - interestPercentage).toFixed(1)}%</span>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="text-muted-foreground block">Total Interest</span>
                                <span className="font-bold text-foreground">{interestPercentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SeoSection toolId="emi-calculator" />
        </div>
    );
}

function InputGroup({ label, value, onChange, min, max, step, unit }: {
    label: string, value: number, onChange: (val: number) => void, min: number, max: number, step: number, unit: string
}) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{label}</label>
                <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-lg border border-border">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        className="bg-transparent text-right font-black outline-none w-24 text-primary"
                    />
                    <span className="text-[10px] font-bold text-muted-foreground">{unit}</span>
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
    );
}

function ResultCard({ label, value, subValue, highlight, color = "primary" }: any) {
    const colors: any = {
        primary: "text-primary bg-primary/5 border-primary/20",
        amber: "text-amber-600 bg-amber-500/5 border-amber-500/20",
        emerald: "text-emerald-600 bg-emerald-500/5 border-emerald-500/20",
        blue: "text-blue-600 bg-blue-500/5 border-blue-500/20",
    };

    return (
        <div className={`p-6 rounded-2xl border ${colors[color]} space-y-2 relative overflow-hidden`}>
            {highlight && <div className="absolute top-0 right-0 p-2 bg-primary/10 rounded-bl-xl text-[10px] font-bold uppercase tracking-tighter">Recommended</div>}
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
            <div className="text-3xl font-black tracking-tight">₹{value}</div>
            <p className="text-[10px] uppercase font-bold opacity-40">{subValue}</p>
        </div>
    );
}
