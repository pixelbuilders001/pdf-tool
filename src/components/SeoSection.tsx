import { SEO_CONFIG } from "@/seo/config";

interface SeoSectionProps {
    toolId: string;
}

export default function SeoSection({ toolId }: SeoSectionProps) {
    const tool = SEO_CONFIG.tools.find(t => t.id === toolId);
    if (!tool) return null;

    return (
        <div className="mt-24 pt-24 border-t border-border prose prose-invert max-w-none pb-24">
            <h2 className="text-3xl font-bold mb-8">Ultimate Guide to {tool.name} - 100% Private & Free</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-muted-foreground leading-relaxed">
                <div className="space-y-6">
                    <section>
                        <h3 className="text-xl font-bold text-foreground mb-4">Why our {tool.name.toLowerCase()} tool is different</h3>
                        <p>
                            Most online PDF editors require you to upload your files to their remote servers. This poses a significant security risk, especially when dealing with legal contracts, financial statements, or private identification documents. Our <strong>PDF Toolkit</strong> tools use cutting-edge browser technologies like <strong>WebAssembly</strong> and <strong>pdf-lib</strong> to process your files directly on your own computer.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-foreground mb-4">Maximum Security & Privacy</h3>
                        <p>
                            When you use our {tool.name.toLowerCase()} tool, your document data never traverses the internet. The "upload" process is actually just a local file read into browser memory. This means even if you have a slow internet connection, the processing is instantaneous once the file is selected. Once you close the tab or refresh the page, all sensitive data is wiped from your browser's RAM.
                        </p>
                    </section>
                </div>

                <div className="space-y-6">
                    <section>
                        <h3 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-foreground">Is it really free?</h4>
                                <p>Yes, all our tools are 100% free with no daily limits, no file size caps (up to 50MB per file), and no watermark on the final output.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground">Do I need to install anything?</h4>
                                <p>No. Our application is a PWA (Progressive Web App) that works in any modern browser without plugins. You can even "install" it to your desktop for offline use.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground">Does it work on mobile?</h4>
                                <p>Absolutely. The interface is mobile-first and responsive, meaning you can {tool.name.toLowerCase()} on your iPhone or Android device anywhere, even without an internet connection once the page is loaded.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
