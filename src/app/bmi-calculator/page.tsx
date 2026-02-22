'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RefreshCcw, Scale, Ruler, Info } from 'lucide-react';
import SeoSection from '@/components/SeoSection';

export default function BmiCalculator() {
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
    const [weight, setWeight] = useState<number>(70);
    const [heightCm, setHeightCm] = useState<number>(170);
    const [heightFt, setHeightFt] = useState<number>(5);
    const [heightIn, setHeightIn] = useState<number>(7);

    const [bmi, setBmi] = useState<number | null>(null);
    const [category, setCategory] = useState<string>('');
    const [color, setColor] = useState<string>('');

    const calculateBmi = () => {
        let h = 0;
        let w = weight;

        if (unit === 'metric') {
            h = heightCm / 100;
        } else {
            h = ((heightFt * 12) + heightIn) * 0.0254;
            w = weight * 0.453592;
        }

        const bmiValue = w / (h * h);
        setBmi(bmiValue);

        if (bmiValue < 18.5) {
            setCategory('Underweight');
            setColor('text-blue-500');
        } else if (bmiValue < 25) {
            setCategory('Normal Weight');
            setColor('text-emerald-500');
        } else if (bmiValue < 30) {
            setCategory('Overweight');
            setColor('text-amber-500');
        } else {
            setCategory('Obese');
            setColor('text-destructive');
        }
    };

    useEffect(() => {
        calculateBmi();
    }, [unit, weight, heightCm, heightFt, heightIn]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Health & Wellness</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">BMI <span className="text-primary italic">Calculator</span></h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Check your Body Mass Index (BMI) to see if you're in a healthy weight range for your height.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
                <div className="space-y-8 p-8 rounded-[2.5rem] bg-card border border-border/60 shadow-sm">
                    <div className="flex bg-secondary/50 p-1 rounded-xl gap-1">
                        <button
                            onClick={() => setUnit('metric')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${unit === 'metric' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-secondary'}`}
                        >
                            Metric (kg/cm)
                        </button>
                        <button
                            onClick={() => setUnit('imperial')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${unit === 'imperial' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-secondary'}`}
                        >
                            Imperial (lb/ft)
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <Scale className="w-3.5 h-3.5" /> Weight ({unit === 'metric' ? 'kg' : 'lb'})
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range" min={unit === 'metric' ? 20 : 50} max={unit === 'metric' ? 200 : 450}
                                    value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))}
                                    className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <input
                                    type="number" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                                    className="w-20 p-2 rounded-xl bg-secondary/50 border border-border text-center font-bold outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <Ruler className="w-3.5 h-3.5" /> Height {unit === 'metric' ? '(cm)' : '(ft/in)'}
                            </label>
                            {unit === 'metric' ? (
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range" min={50} max={250}
                                        value={heightCm} onChange={(e) => setHeightCm(parseFloat(e.target.value))}
                                        className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <input
                                        type="number" value={heightCm} onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                                        className="w-20 p-2 rounded-xl bg-secondary/50 border border-border text-center font-bold outline-none"
                                    />
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
                                        <input type="number" value={heightFt} onChange={(e) => setHeightFt(parseFloat(e.target.value) || 0)} className="w-full bg-transparent font-bold outline-none text-center" />
                                        <span className="text-[10px] font-black opacity-40">FT</span>
                                    </div>
                                    <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
                                        <input type="number" value={heightIn} onChange={(e) => setHeightIn(parseFloat(e.target.value) || 0)} className="w-full bg-transparent font-bold outline-none text-center" />
                                        <span className="text-[10px] font-black opacity-40">IN</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-10 rounded-[2.5rem] bg-primary border border-primary/20 text-white shadow-xl shadow-primary/20 text-center space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Your BMI Result</span>
                        <div className="text-7xl font-black tabular-nums">{bmi?.toFixed(1)}</div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold backdrop-blur-sm">
                            Category: <span className="underline decoration-2 underline-offset-4">{category}</span>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-card border border-border/60 space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" />
                            Health Category Scale
                        </h3>
                        <div className="space-y-3">
                            <ScaleItem label="Underweight" range="< 18.5" color="bg-blue-500" active={category === 'Underweight'} />
                            <ScaleItem label="Normal" range="18.5 - 24.9" color="bg-emerald-500" active={category === 'Normal Weight'} />
                            <ScaleItem label="Overweight" range="25.0 - 29.9" color="bg-amber-500" active={category === 'Overweight'} />
                            <ScaleItem label="Obese" range="> 30.0" color="bg-destructive" active={category === 'Obese'} />
                        </div>
                    </div>
                </div>
            </div>

            <SeoSection toolId="bmi-calculator" />
        </div>
    );
}

function ScaleItem({ label, range, color, active }: any) {
    return (
        <div className={`flex justify-between items-center p-3 rounded-xl border transition-all ${active ? `ring-2 ring-primary/20 border-primary/20 bg-primary/[0.02]` : 'border-transparent'}`}>
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className={`text-sm font-bold ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </div>
            <span className="text-xs font-black text-muted-foreground/60">{range}</span>
        </div>
    );
}
