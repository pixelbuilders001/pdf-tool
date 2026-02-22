import { Github, Twitter, Mail, MapPin, FileText } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full bg-[#020408] text-gray-400 py-20 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
                            <FileText className="w-8 h-8 text-primary" />
                            <span>PDF Toolkit</span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Fast, Private, Offline. Professional PDF tools that run 100% in your browser using the latest WebAssembly technology.
                        </p>
                        <div className="space-y-3 text-sm">

                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>support@pdftoolkit.com</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/" className="hover:text-primary transition-colors">About Us</Link></li>
                            {/* <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li> */}
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Resources</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-white/10">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-white/10">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-xs">
                            &copy; {new Date().getFullYear()} PDF Toolkit. Built with ❤️ for privacy and security.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
