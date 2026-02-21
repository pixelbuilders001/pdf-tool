import { Github, Twitter, ShieldCheck } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background mt-auto py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">PDF Toolkit</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Fast, Private, Offline. Professional PDF tools that run 100% in your browser.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                            <ShieldCheck className="w-4 h-4" />
                            Files never leave your device
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/merge-pdf" className="hover:text-primary">Merge PDF</a></li>
                            <li><a href="/split-pdf" className="hover:text-primary">Split PDF</a></li>
                            <li><a href="/compress-pdf" className="hover:text-primary">Compress PDF</a></li>
                            <li><a href="/pdf-to-jpg" className="hover:text-primary">PDF to JPG</a></li>
                            <li><a href="/jpg-to-pdf" className="hover:text-primary">JPG to PDF</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-secondary hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="p-2 rounded-full bg-secondary hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                        </div>
                        <p className="mt-8 text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} PDF Toolkit. Built for privacy.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
