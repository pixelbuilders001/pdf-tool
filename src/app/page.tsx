'use client';

import { motion } from 'framer-motion';
import ToolCard from '@/components/ToolCard';
import { SEO_CONFIG } from '@/seo/config';
import { Shield, Clock, Brain, CheckCircle2, ArrowRight, Zap, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const categories = [
    { id: 'pdf', name: 'PDF Tools' },
    { id: 'image', name: 'Image Tools' },
    { id: 'utility', name: 'Utility Tools' },
    { id: 'calculators', name: 'Financial & Health Calculators' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-10 pb-10 md:pt-10 md:pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Powerful PDF & <br />
              <span className="text-primary">Image Editing </span> <br />
              Made Simple
            </h1>
            <p className="text-xl text-muted-foreground/80 max-w-xl leading-relaxed">
              Unlock your productivity with easy to use PDF and image tools.
              Process everything locally in your browser for total privacy.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto group">
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-500" />

              <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                <img
                  src="/hero-illustration.png"
                  alt="Hellofixo Hero Illustration"
                  className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Small floating elements for added depth */}
              <div className="absolute top-20 right-10 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 transform rotate-12 group-hover:rotate-0 transition-all duration-700">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute bottom-20 left-10 p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 transform -rotate-12 group-hover:rotate-0 transition-all duration-700">
                <Lock className="w-10 h-10 text-emerald-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Sections */}
      <section className="bg-secondary/30 py-24">
        <div className="container mx-auto px-4 space-y-24">
          {categories.map((category) => (
            <div key={category.id} className="space-y-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                  {category.name}
                </h2>
                <div className="h-1.5 w-20 bg-primary rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {SEO_CONFIG.tools
                  .filter(t => t.category === category.id || (category.id === 'utility' && (t.category === 'utility' || t.category === 'advanced' || t.category === 'security')))
                  .map((tool, idx) => (
                    <ToolCard key={tool.id} {...tool} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight">Security & Privacy</h2>
            <p className="text-lg text-muted-foreground">We prioritize your data security above all else.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Privacy', icon: Shield, desc: 'Your files never leave your device. All processing happens locally in your browser memory.' },
              { title: 'Smart Processing', icon: Clock, desc: 'Ultra-fast execution using WebAssembly technology. No waiting for server uploads or downloads.' },
              { title: 'Secure & Smart', icon: Brain, desc: 'Intelligent algorithms handle complex PDF and image operations without any external dependencies.' }
            ].map((item, idx) => (
              <div key={idx} className="p-10 rounded-[32px] bg-secondary/20 border border-border/50 text-center space-y-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-border">
                  <item.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Section - Why Us */}
      <section className="bg-[#05070a] text-white py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-4xl font-extrabold">Why Use PDF Toolkit Offline?</h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Most online editors upload your sensitive files. We don't. Our toolkit uses cutting-edge
                browser technology to process everything on your computer, making it faster and 100% private.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Is it really private?
                </h3>
                <p className="text-gray-400">
                  Yes. We use standard libraries to handle processing on your local CPU.
                  No data is sent to our servers, guaranteed.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Fast Processing
                </h3>
                <p className="text-gray-400">
                  Instant local execution saves time and bandwidth. No more waiting for uploads
                  large PDFs or images.
                </p>
              </div>
            </div>

            <div className="flex justify-center md:justify-end pt-8">
              <button className="px-10 py-4 bg-primary rounded-xl font-bold hover:bg-primary/90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
