import Link from 'next/link';
import { FileText, Shield, Eye, Database, Lock, Globe, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy – PDF Toolkit',
    description: 'Learn how PDF Toolkit protects your privacy. All file processing happens 100% locally in your browser — no uploads, no servers, no tracking.',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#020408] text-white">
            {/* Hero */}
            <div className="border-b border-white/5 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="container mx-auto px-4 py-20 max-w-4xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-primary text-sm font-semibold uppercase tracking-widest">Privacy Policy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Your Privacy is Our Priority
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                        PDF Toolkit is built on a simple principle: <strong className="text-white">your files never leave your device.</strong> All processing happens 100% locally in your browser using WebAssembly technology.
                    </p>
                    <p className="text-gray-500 text-sm mt-6">Last updated: February 23, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">

                {/* Key Promises */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Eye, title: 'No Tracking', desc: 'We don\'t track your file usage, browsing behaviour, or tool interactions.' },
                        { icon: Database, title: 'No Storage', desc: 'Your files are never uploaded to any server. Processing is done in your browser memory.' },
                        { icon: Lock, title: 'No Sharing', desc: 'We never share, sell, or transfer your personal data to third parties.' },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold text-white mb-2">{title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Sections */}
                <Section title="1. Information We Collect">
                    <p>PDF Toolkit is designed to collect as little information as possible.</p>
                    <ul>
                        <li><strong>Files you process:</strong> All PDF, image, and document processing happens entirely within your browser. Your files are loaded into browser memory, processed using WebAssembly, and never transmitted to any server.</li>
                        <li><strong>Usage analytics (anonymous):</strong> We may collect anonymised, aggregated analytics (e.g. page views, tool usage counts) to understand which tools are most useful. This data cannot be used to identify you.</li>
                        <li><strong>Contact information:</strong> If you contact us via email, we retain your email address solely to respond to your inquiry.</li>
                    </ul>
                </Section>

                <Section title="2. How We Use Your Information">
                    <p>The limited information we collect is used strictly to:</p>
                    <ul>
                        <li>Improve the performance and reliability of PDF Toolkit</li>
                        <li>Understand which tools and features are most valuable to our users</li>
                        <li>Respond to support or feedback requests</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                    <p>We do <strong>not</strong> use your information for advertising, profiling, or any commercial purpose beyond operating the service.</p>
                </Section>

                <Section title="3. File Processing & Data Security">
                    <p>This is the core of our privacy guarantee:</p>
                    <ul>
                        <li>All file processing (PDF merge, split, compress, convert, etc.) occurs entirely client-side using WebAssembly (WASM) running in your browser.</li>
                        <li>No file content is ever transmitted over the network to our servers or any third-party server.</li>
                        <li>Files are held temporarily in browser memory (RAM) and are discarded when you close the tab or navigate away.</li>
                        <li>We strongly recommend processing sensitive documents using PDF Toolkit precisely because of this architecture.</li>
                    </ul>
                </Section>

                <Section title="4. Cookies & Local Storage">
                    <p>PDF Toolkit uses minimal browser storage:</p>
                    <ul>
                        <li><strong>Essential cookies:</strong> Used to maintain basic site functionality and user preferences (e.g. dark/light mode).</li>
                        <li><strong>No advertising cookies:</strong> We do not use third-party advertising cookies or cross-site tracking.</li>
                        <li><strong>Service Worker:</strong> Our Progressive Web App (PWA) uses a service worker for offline functionality and caching of app assets — not your files.</li>
                    </ul>
                </Section>

                <Section title="5. Third-Party Services">
                    <p>PDF Toolkit may link to third-party websites (e.g. GitHub, social media). We are not responsible for the privacy practices of those sites. We do not embed third-party advertising or tracking scripts.</p>
                </Section>

                <Section title="6. Children's Privacy">
                    <p>PDF Toolkit is not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.</p>
                </Section>

                <Section title="7. Changes to This Policy">
                    <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The "Last updated" date at the top of this page will always reflect the most recent revision. Continued use of PDF Toolkit after changes constitutes your acceptance of the updated policy.</p>
                </Section>

                <Section title="8. Contact Us">
                    <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
                    <div className="flex items-center gap-2 mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] w-fit">
                        <Mail className="w-4 h-4 text-primary" />
                        <a href="mailto:support@pdftoolkit.com" className="text-primary hover:underline font-medium">support@pdftoolkit.com</a>
                    </div>
                </Section>

                {/* Back link */}
                <div className="pt-4 border-t border-white/5 flex items-center gap-6 text-sm">
                    <Link href="/" className="text-gray-500 hover:text-primary transition-colors">← Back to Home</Link>
                    <Link href="/terms-of-service" className="text-gray-500 hover:text-primary transition-colors">Terms of Service →</Link>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <div className="text-gray-400 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_strong]:text-white">
                {children}
            </div>
        </div>
    );
}
