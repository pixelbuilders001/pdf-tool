'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, RefreshCcw, ArrowRight } from 'lucide-react';
import SeoSection from '@/components/SeoSection';

export default function PercentageCalculator() {
    // Mode 1: What is X% of Y?
    const [val1_X, setVal1_X] = useState('');
    const [val1_Y, setVal1_Y] = useState('');
    const [res1, setRes1] = useState<number | null>(null);

    // Mode 2: X is what % of Y?
    const [val2_X, setVal2_X] = useState('');
    const [val2_Y, setVal2_Y] = useState('');
    const [res2, setRes2] = useState<number | null>(null);

    // Mode 3: Percentage Increase/Decrease
    const [val3_X, setVal3_X] = useState('');
    const [val3_Y, setVal3_Y] = useState('');
    const [res3, setRes3] = useState<number | null>(null);

    const calc1 = () => {
        const x = parseFloat(val1_X);
        const y = parseFloat(val1_Y);
        if (!isNaN(x) && !isNaN(y)) setRes1((x / 100) * y);
    };

    const calc2 = () => {
        const x = parseFloat(val2_X);
        const y = parseFloat(val2_Y);
        if (!isNaN(x) && !isNaN(y) && y !== 0) setRes2((x / y) * 100);
    };

    const calc3 = () => {
        const initial = parseFloat(val3_X);
        const final = parseFloat(val3_Y);
        if (!isNaN(initial) && !isNaN(final) && initial !== 0) {
            setRes3(((final - initial) / initial) * 100);
        }
    };

    const resetAll = () => {
        setVal1_X(''); setVal1_Y(''); setRes1(null);
        setVal2_X(''); setVal2_Y(''); setRes2(null);
        setVal3_X(''); setVal3_Y(''); setRes3(null);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                    <Percent className="w-3.5 h-3.5" />
                    <span>Calculators</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Percentage <span className="text-primary italic">Calculator</span></h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Quickly calculate percentages, find proportions, and measure percentage changes without complex math.
                </p>
                <div className="pt-4">
                    <button onClick={resetAll} className="btn-secondary text-xs px-4 py-2 flex items-center gap-2 mx-auto">
                        <RefreshCcw className="w-3 h-3" /> Reset All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Mode 1 */}
                <CalculatorCard title="What is X% of Y?">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                value={val1_X}
                                onChange={(e) => setVal1_X(e.target.value)}
                                placeholder="X"
                                className="flex-1 p-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-center font-bold"
                            />
                            <span className="font-bold text-muted-foreground">% of</span>
                            <input
                                type="number"
                                value={val1_Y}
                                onChange={(e) => setVal1_Y(e.target.value)}
                                placeholder="Y"
                                className="flex-1 p-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-center font-bold"
                            />
                        </div>
                        <button onClick={calc1} className="w-full btn-primary py-3">Calculate</button>
                        {res1 !== null && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                                <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Result</span>
                                <div className="text-3xl font-black text-primary">{res1.toLocaleString()}</div>
                            </motion.div>
                        )}
                    </div>
                </CalculatorCard>

                {/* Mode 2 */}
                <CalculatorCard title="X is what % of Y?">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                value={val2_X}
                                onChange={(e) => setVal2_X(e.target.value)}
                                placeholder="X"
                                className="flex-1 p-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-center font-bold"
                            />
                            <span className="font-bold text-muted-foreground">is what % of</span>
                            <input
                                type="number"
                                value={val2_Y}
                                onChange={(e) => setVal2_Y(e.target.value)}
                                placeholder="Y"
                                className="flex-1 p-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-center font-bold"
                            />
                        </div>
                        <button onClick={calc2} className="w-full btn-primary py-3">Calculate</button>
                        {res2 !== null && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                                <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Result</span>
                                <div className="text-3xl font-black text-primary">{res2.toFixed(2)}%</div>
                            </motion.div>
                        )}
                    </div>
                </CalculatorCard>

                {/* Mode 3 */}
                <CalculatorCard title="Percentage Change">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="w-20 text-xs font-bold text-muted-foreground uppercase">Initial</span>
                                <input
                                    type="number"
                                    value={val3_X}
                                    onChange={(e) => setVal3_X(e.target.value)}
                                    placeholder="Value"
                                    className="flex-1 p-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-20 text-xs font-bold text-muted-foreground uppercase">Final</span>
                                <input
                                    type="number"
                                    value={val3_Y}
                                    onChange={(e) => setVal3_Y(e.target.value)}
                                    placeholder="Value"
                                    className="flex-1 p-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none font-bold"
                                />
                            </div>
                        </div>
                        <button onClick={calc3} className="w-full btn-primary py-3">Calculate Change</button>
                        {res3 !== null && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                                <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Difference</span>
                                <div className={cn(
                                    "text-3xl font-black",
                                    res3 > 0 ? "text-emerald-500" : res3 < 0 ? "text-destructive" : "text-primary"
                                )}>
                                    {res3 > 0 ? '+' : ''}{res3.toFixed(2)}%
                                </div>
                            </motion.div>
                        )}
                    </div>
                </CalculatorCard>
            </div>

            <SeoSection toolId="percentage-calculator" />
        </div>
    );
}

function CalculatorCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="p-8 rounded-[2rem] bg-card border border-border/60 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            {children}
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
