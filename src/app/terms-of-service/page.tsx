import Link from 'next/link';
import { Scale, AlertTriangle, CheckCircle2, XCircle, Globe, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service – PDF Toolkit',
    description: 'Read the Terms of Service for PDF Toolkit. Understand your rights and responsibilities when using our free browser-based PDF and image tools.',
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#020408] text-white">
            {/* Hero */}
            <div className="border-b border-white/5 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="container mx-auto px-4 py-20 max-w-4xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Scale className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-primary text-sm font-semibold uppercase tracking-widest">Terms of Service</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                        By using PDF Toolkit, you agree to these terms. Please read them carefully — they're written to be fair and easy to understand.
                    </p>
                    <p className="text-gray-500 text-sm mt-6">Last updated: February 23, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">

                {/* Quick summary */}
                <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                    <h2 className="font-bold text-white text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" /> Quick Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <p className="text-emerald-400 font-semibold">✓ You may:</p>
                            <ul className="text-gray-400 space-y-1 pl-4">
                                <li>Use all tools freely for personal and commercial purposes</li>
                                <li>Process any files you own or have rights to process</li>
                                <li>Install PDF Toolkit as a PWA on your device</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <p className="text-rose-400 font-semibold">✗ You may not:</p>
                            <ul className="text-gray-400 space-y-1 pl-4">
                                <li>Use the service for any illegal purpose</li>
                                <li>Attempt to reverse-engineer or misuse the service</li>
                                <li>Violate intellectual property rights of others</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <Section title="1. Acceptance of Terms">
                    <p>By accessing or using PDF Toolkit ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.</p>
                    <p>These Terms constitute a legally binding agreement between you and PDF Toolkit. We reserve the right to modify these Terms at any time, and your continued use of the Service constitutes acceptance of any modifications.</p>
                </Section>

                <Section title="2. Description of Service">
                    <p>PDF Toolkit provides free, browser-based tools for processing PDF documents and images. This includes, but is not limited to:</p>
                    <ul>
                        <li>PDF manipulation (merge, split, compress, convert, encrypt, decrypt)</li>
                        <li>Image editing and conversion tools</li>
                        <li>Utility tools (QR code generation, calculators, format converters)</li>
                    </ul>
                    <p>All processing occurs entirely within your web browser. PDF Toolkit servers do not receive, store, or process your files.</p>
                </Section>

                <Section title="3. Acceptable Use">
                    <p>You agree to use the Service only for lawful purposes. You must not:</p>
                    <ul>
                        <li>Use the Service to process, distribute, or reproduce any content that infringes upon intellectual property rights of others</li>
                        <li>Attempt to circumvent, disable, or interfere with security features of the Service</li>
                        <li>Use automated tools, bots, or scrapers to access the Service excessively</li>
                        <li>Use the Service for any illegal, harmful, threatening, abusive, or harassing purpose</li>
                        <li>Attempt to reverse-engineer, decompile, or extract source code from the Service</li>
                    </ul>
                </Section>

                <Section title="4. Intellectual Property">
                    <p><strong>Your files:</strong> You retain full ownership of any files you process using PDF Toolkit. We make no claim to your content.</p>
                    <p><strong>Our service:</strong> PDF Toolkit, including its design, code, trademarks, and branding, is owned by PDF Toolkit and protected by applicable intellectual property laws. You may not copy, reproduce, or redistribute the Service without express written permission.</p>
                    <p><strong>Open source components:</strong> PDF Toolkit uses various open-source libraries (e.g. pdf-lib, ffmpeg.wasm). Their respective licenses apply to those components.</p>
                </Section>

                <Section title="5. Disclaimer of Warranties">
                    <p>The Service is provided on an <strong>"AS IS" and "AS AVAILABLE"</strong> basis without warranties of any kind, either express or implied. PDF Toolkit does not warrant that:</p>
                    <ul>
                        <li>The Service will be uninterrupted, error-free, or secure</li>
                        <li>The results obtained from the Service will be accurate or reliable</li>
                        <li>Any defects will be corrected</li>
                    </ul>
                    <p>You use the Service at your own risk. Always keep backups of important files before processing them.</p>
                </Section>

                <Section title="6. Limitation of Liability">
                    <p>To the maximum extent permitted by law, PDF Toolkit shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
                    <ul>
                        <li>Loss of data, files, or documents</li>
                        <li>Loss of profits or revenue</li>
                        <li>Damage to your device or software</li>
                    </ul>
                    <p>Our total liability for any claim arising from your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim (which, for a free service, is zero).</p>
                </Section>

                <Section title="7. Privacy">
                    <p>Your use of the Service is also governed by our <Link href="/privacy-policy" className="text-primary hover:underline font-medium">Privacy Policy</Link>, which is incorporated into these Terms by reference. Please review it to understand our practices.</p>
                </Section>

                <Section title="8. Third-Party Links">
                    <p>The Service may contain links to third-party websites or services. PDF Toolkit is not responsible for the content, privacy policies, or practices of any third-party sites. We encourage you to review the terms and privacy policies of any third-party sites you visit.</p>
                </Section>

                <Section title="9. Termination">
                    <p>We reserve the right to suspend or terminate access to the Service at any time, for any reason, without notice, including for violations of these Terms. Upon termination, the provisions of these Terms that by their nature should survive will survive.</p>
                </Section>

                <Section title="10. Governing Law">
                    <p>These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Service shall be resolved through good-faith negotiation, and if necessary, through binding arbitration.</p>
                </Section>

                <Section title="11. Changes to Terms">
                    <p>We may revise these Terms from time to time. When we do, we'll update the "Last updated" date at the top. Your continued use of the Service after changes take effect constitutes your acceptance of the revised Terms.</p>
                </Section>

                <Section title="12. Contact Us">
                    <p>If you have any questions about these Terms of Service, please contact us:</p>
                    <div className="flex items-center gap-2 mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] w-fit">
                        <Mail className="w-4 h-4 text-primary" />
                        <a href="mailto:support@pdftoolkit.com" className="text-primary hover:underline font-medium">support@pdftoolkit.com</a>
                    </div>
                </Section>

                {/* Back link */}
                <div className="pt-4 border-t border-white/5 flex items-center gap-6 text-sm">
                    <Link href="/" className="text-gray-500 hover:text-primary transition-colors">← Back to Home</Link>
                    <Link href="/privacy-policy" className="text-gray-500 hover:text-primary transition-colors">Privacy Policy →</Link>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <div className="text-gray-400 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_strong]:text-white [&_a]:text-primary [&_a]:hover:underline">
                {children}
            </div>
        </div>
    );
}
