'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, RefreshCcw, Cake, Baby, Clock } from 'lucide-react';
import SeoSection from '@/components/SeoSection';

export default function AgeCalculator() {
    const [birthDate, setBirthDate] = useState('');
    const [age, setAge] = useState<any>(null);

    const calculateAge = () => {
        if (!birthDate) return;

        const birth = new Date(birthDate);
        const now = new Date();

        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Next Birthday calculation
        const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBirthday < now) {
            nextBirthday.setFullYear(now.getFullYear() + 1);
        }
        const diffTime = nextBirthday.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const remainingDays = diffDays % 30;

        setAge({ years, months, days, nextBirthdayDays: diffDays, nextBirthdayMonths: diffMonths, remainingDays });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Calculators</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Age <span className="text-primary italic">Calculator</span></h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Determine your exact age in years, months, and days. Perfect for forms, applications, or just curious moments.
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="p-8 md:p-12 rounded-[2.5rem] bg-card border border-border/60 shadow-sm flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Date of Birth</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary outline-none font-bold text-lg"
                            />
                        </div>
                        <button
                            onClick={calculateAge}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg"
                        >
                            <Clock className="w-5 h-5" /> Calculate Age
                        </button>
                    </div>

                    <div className="w-full md:w-64 aspect-square rounded-3xl bg-primary/5 border border-primary/20 flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <Baby className="w-12 h-12 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                            Select your date of birth to reveal your temporal footprints.
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {age && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <AgeBox label="Years" value={age.years} />
                                <AgeBox label="Months" value={age.months} />
                                <AgeBox label="Days" value={age.days} />
                            </div>

                            <div className="p-8 rounded-[2rem] glass bg-emerald-500/5 border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                        <Cake className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Next Birthday In</h3>
                                        <p className="text-2xl font-black text-foreground">{age.nextBirthdayDays} Days</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-muted-foreground uppercase">{age.nextBirthdayMonths} months & {age.remainingDays} days to go</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <SeoSection toolId="age-calculator" />
        </div>
    );
}

function AgeBox({ label, value }: { label: string, value: number }) {
    return (
        <div className="p-8 rounded-3xl bg-secondary/30 border border-border flex flex-col items-center justify-center space-y-1">
            <span className="text-4xl font-black text-primary">{value}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        </div>
    );
}
