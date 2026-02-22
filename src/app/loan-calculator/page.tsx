'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Banknote, RefreshCcw, Table, ListChecks, PieChart } from 'lucide-react';
import SeoSection from '@/components/SeoSection';

export default function LoanCalculator() {
    const [loanAmount, setLoanAmount] = useState<number>(5000000);
    const [interestRate, setInterestRate] = useState<number>(9.5);
    const [tenure, setTenure] = useState<number>(20);

    const [emi, setEmi] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [schedule, setSchedule] = useState<any[]>([]);

    const calculateLoan = () => {
        const p = loanAmount;
        const r = interestRate / 12 / 100;
        const n = tenure * 12;

        const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalAmt = emiValue * n;
        const totalInt = totalAmt - p;

        setEmi(emiValue);
        setTotalAmount(totalAmt);
        setTotalInterest(totalInt);

        // Simple amortization schedule (annual)
        let balance = p;
        const yearlySchedule = [];
        for (let i = 1; i <= tenure; i++) {
            let yearlyInterest = 0;
            let yearlyPrincipal = 0;
            for (let j = 0; j < 12; j++) {
                const interest = balance * r;
                const principal = emiValue - interest;
                yearlyInterest += interest;
                yearlyPrincipal += principal;
                balance -= principal;
            }
            yearlySchedule.push({
                year: i,
                principal: yearlyPrincipal,
                interest: yearlyInterest,
                balance: Math.max(0, balance)
            });
        }
        setSchedule(yearlySchedule);
    };

    useEffect(() => {
        calculateLoan();
    }, [loanAmount, interestRate, tenure]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Finances</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Loan <span className="text-primary italic">Calculator</span></h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    A comprehensive tool to estimate your loan repayments, total interest, and annual schedule.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
                {/* Inputs & Summary */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="p-8 rounded-[2rem] bg-card border border-border/60 shadow-sm space-y-8">
                        <InputGroup label="Principal Amount" value={loanAmount} onChange={setLoanAmount} min={100000} max={200000000} step={100000} unit="₹" />
                        <InputGroup label="Interest Rate" value={interestRate} onChange={setInterestRate} min={1} max={40} step={0.1} unit="%" />
                        <InputGroup label="Tenure" value={tenure} onChange={setTenure} min={1} max={40} step={1} unit="Y" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SummarySmall label="Monthly EMI" value={Math.round(emi).toLocaleString()} color="primary" />
                        <SummarySmall label="Total Interest" value={Math.round(totalInterest).toLocaleString()} color="amber" />
                    </div>
                </div>

                {/* Schedule & Visuals */}
                <div className="lg:col-span-7 space-y-12">
                    <div className="p-8 rounded-[2.5rem] bg-primary text-white space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Total Repayment Amount</span>
                                <div className="text-5xl font-black tabular-nums">₹{Math.round(totalAmount).toLocaleString()}</div>
                            </div>
                            <div className="text-right opacity-60">
                                <span className="text-xs font-bold uppercase block">{loanAmount.toLocaleString()} Principal</span>
                                <span className="text-xs font-bold uppercase block">{Math.round(totalInterest).toLocaleString()} Interest</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Table className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold">Amortization Schedule (Annual)</h3>
                        </div>
                        <div className="rounded-[2rem] border border-border overflow-hidden bg-card">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4">Year</th>
                                        <th className="px-6 py-4 text-right">Principal</th>
                                        <th className="px-6 py-4 text-right">Interest</th>
                                        <th className="px-6 py-4 text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {schedule.map((item) => (
                                        <tr key={item.year} className="hover:bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4 font-bold">{item.year}</td>
                                            <td className="px-6 py-4 text-right tabular-nums">₹{Math.round(item.principal).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right tabular-nums text-amber-600">₹{Math.round(item.interest).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right tabular-nums font-bold">₹{Math.round(item.balance).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <SeoSection toolId="loan-calculator" />
        </div>
    );
}

function InputGroup({ label, value, onChange, min, max, step, unit }: {
    label: string, value: number, onChange: (val: number) => void, min: number, max: number, step: number, unit: string
}) {
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

function SummarySmall({ label, value, color }: any) {
    const colors: any = {
        primary: "text-primary border-primary/20 bg-primary/5",
        amber: "text-amber-600 border-amber-500/20 bg-amber-500/5",
    };
    return (
        <div className={`p-6 rounded-2xl border ${colors[color]} space-y-1`}>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
            <div className="text-2xl font-black tracking-tight">₹{value}</div>
        </div>
    );
}
