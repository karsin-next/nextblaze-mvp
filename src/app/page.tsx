"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, BarChart3, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blaze-400 to-blaze-600">
                NextBlaze
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/dashboard" className="px-4 py-2 rounded-full bg-blaze-500 hover:bg-blaze-600 text-white text-sm font-medium transition-all shadow-lg shadow-blaze-500/25">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Background effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blaze-600/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-blaze-400 glass-card mb-8"
            >
              <Zap className="w-4 h-4 mr-2" />
              Introducing the Fundability OS
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              Become <span className="text-transparent bg-clip-text bg-gradient-to-r from-blaze-400 to-orange-300">Investor-Ready</span><br />
              Faster Than Ever
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
            >
              Bridge the fundability gap. Get an AI-powered diagnostic, an automated financial dashboard, and a personalized roadmap to raise your next round.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-blaze-500 hover:bg-blaze-600 text-white font-semibold transition-all shadow-lg shadow-blaze-500/30 flex items-center justify-center">
                Get Your Fundability Score <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-slate-400">Invest in your fundability. 7-day free trial on all plans.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Starter Plan */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 flex flex-col"
              >
                <h3 className="text-xl font-semibold mb-2">Fundability Starter</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-slate-400 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center text-slate-300"><ChevronRight className="w-5 h-5 text-blaze-500 mr-2" /> AI Fundability Score</li>
                  <li className="flex items-center text-slate-300"><ChevronRight className="w-5 h-5 text-blaze-500 mr-2" /> Educational Roadmap</li>
                  <li className="flex items-center text-slate-300"><ChevronRight className="w-5 h-5 text-blaze-500 mr-2" /> Basic Diagnostic</li>
                </ul>
                <button className="w-full py-3 rounded-xl border border-blaze-500/50 hover:bg-blaze-500/10 text-blaze-400 font-medium transition-colors">
                  Start 7-Day Trial
                </button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 border-blaze-500/30 relative flex flex-col"
              >
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-blaze-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Most Popular</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fundability Pro</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-slate-400 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center text-slate-300"><ChevronRight className="w-5 h-5 text-blaze-500 mr-2" /> Everything in Starter</li>
                  <li className="flex items-center text-slate-300"><ChevronRight className="w-5 h-5 text-blaze-500 mr-2" /> Automated Financial Dashboard</li>
                  <li className="flex items-center text-slate-300"><ChevronRight className="w-5 h-5 text-blaze-500 mr-2" /> Unlimited Investor Snapshots</li>
                  <li className="flex items-center text-slate-300"><ChevronRight className="w-5 h-5 text-blaze-500 mr-2" /> Priority Support</li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-blaze-500 hover:bg-blaze-600 text-white font-medium transition-colors shadow-lg shadow-blaze-500/25">
                  Start 7-Day Trial
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
