'use client';

import { motion } from 'framer-motion';
import ToolCard from '@/components/ToolCard';
import { SEO_CONFIG } from '@/seo/config';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {/* Hero Section */}
      <section className="text-center mb-20 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
            Professional PDF & <br /> Image Toolkit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Merge, split, resize, and convert your files without uploading them to any server.
            100% client-side, fast, and completely private.
          </p>


          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Offline First</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" />
              <span>No Cloud Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Instant Processing</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tools Grid - Categorized */}
      <section className="mb-20 space-y-24">
        {SEO_CONFIG.categories?.map((category) => (
          <div key={category.id} className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground whitespace-nowrap">
                {category.name}
              </h2>
              <div className="h-px w-full bg-gradient-to-r from-border to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SEO_CONFIG.tools
                .filter(t => t.category === category.id)
                .map((tool, idx) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ToolCard {...tool} />
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </section>


      {/* SEO Section (Preview) */}
      <section className="max-w-4xl mx-auto space-y-12 py-16 border-t border-border">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Why Use Our Offline PDF Toolkit?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Unlike many online PDF editors that require you to upload your sensitive documents to their servers,
            our tool runs entirely in your browser using WebAssembly and Javascript. This means your files
            never leave your computer, providing unmatched security and privacy for your business and personal documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-secondary/30">
            <h3 className="text-xl font-bold mb-3">Is it really private?</h3>
            <p className="text-muted-foreground">
              Yes. We use <strong>pdf-lib</strong> and <strong>PDF.js</strong> to handle all processing on your local CPU.
              The "upload" you see is just loading the file into browser memory. No data is sent to our servers.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/30">
            <h3 className="text-xl font-bold mb-3">Fast Processing</h3>
            <p className="text-muted-foreground">
              Processing local files is often faster than uploading large PDFs, waiting for server processing,
              and then downloading them again. Instant local execution saves time and bandwidth.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
