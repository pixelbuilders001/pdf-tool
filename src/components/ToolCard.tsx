'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
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
        <Link
            href={path}
            className="group block p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all h-full"
        >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-[17px] font-bold mb-2 text-foreground group-hover:text-primary transition-colors tracking-tight">{name}</h3>
            <p className="text-muted-foreground/80 text-[13px] leading-relaxed">
                {description}
            </p>
        </Link>
    );
}
