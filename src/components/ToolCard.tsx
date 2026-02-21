'use client';

import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface ToolCardProps {
    name: string;
    description: string;
    path: string;
    icon: string;
}

export default function ToolCard({ name, description, path, icon }: ToolCardProps) {
    // @ts-ignore
    const Icon = LucideIcons[icon] as LucideIcon || LucideIcons.File;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Link
                href={path}
                className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all h-full"
            >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {description}
                </p>
                <div className="flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </div>
            </Link>
        </motion.div>
    );
}
