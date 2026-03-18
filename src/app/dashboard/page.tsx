"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, BarChart, Target, Zap } from "lucide-react";
import Link from "next/link";

export default function FundabilityScorePage() {
  const [step, setStep] = useState(1);
  const [score, setScore] = useState<null | number>(null);

  const calculateScore = () => {
    // Simulated calculation
    setTimeout(() => {
      setScore(68);
    }, 1500);
    setStep(3);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Fundability Score & Diagnostic
        </h1>
        <p className="text-slate-400 mt-2">
          Discover your startup&apos;s investor readiness and get a prioritized action plan.
        </p>
      </div>

      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 border border-blaze-500/20 max-w-2xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-blaze-500/20 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-blaze-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Let&apos;s analyze your readiness</h2>
          <p className="text-slate-300 mb-8">
            Tell us a bit about your current traction, burn rate, and documentation. Our AI will analyze your metrics against successful fundraises in your industry.
          </p>
          <button 
            onClick={() => setStep(2)}
            className="px-6 py-3 rounded-xl bg-blaze-500 hover:bg-blaze-600 text-white font-medium transition-all shadow-lg flex items-center"
          >
            Start Diagnostic <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 max-w-2xl border border-slate-700 w-full"
        >
          <h2 className="text-xl font-semibold mb-6">Company Metrics</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Current Monthly Revenue (MRR)</label>
              <input type="text" placeholder="$10,000" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blaze-500 transition-colors" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Monthly Burn Rate</label>
              <input type="text" placeholder="$15,000" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blaze-500 transition-colors" />
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-400 mb-2">Do you have a financial model covering the next 24 months?</label>
               <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blaze-500">
                 <option>No, I need to build one</option>
                 <option>Yes, a basic template</option>
                 <option>Yes, a robust custom model</option>
               </select>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button 
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-medium transition-colors"
            >
              Back
            </button>
            <button 
              onClick={calculateScore}
              className="px-6 py-3 rounded-xl bg-blaze-500 hover:bg-blaze-600 text-white font-medium transition-all shadow-lg shadow-blaze-500/20 flex-grow text-center"
            >
              Analyze Metrics
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && score === null && (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-slate-800 border-t-blaze-500 rounded-full mb-6"
          />
          <h3 className="text-xl font-medium">AI is analyzing your profile...</h3>
          <p className="text-slate-400">Comparing against 10,000+ funded startups</p>
        </div>
      )}

      {step === 3 && score !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Main Score Card */}
          <div className="md:col-span-1 glass-card p-8 border border-blaze-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blaze-500/10 rounded-full blur-3xl" />
            
            <h3 className="text-lg font-medium text-slate-300 mb-2">Fundability Score</h3>
            <div className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-blaze-300">
              {score}
            </div>
            <div className="mt-4 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-medium flex items-center">
               Needs Improvement
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              You are in the 42nd percentile. Investors typically look for a score of 80+ before engaging deeply.
            </p>
          </div>

          {/* Action Plan */}
          <div className="md:col-span-2 glass-card p-8 border border-slate-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
               <Target className="w-6 h-6 text-blaze-400 mr-2" /> AI Prioritized Action Plan
            </h2>
            
            <div className="space-y-4">
              <div className="flex bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mr-4" />
                <div>
                  <h4 className="font-medium text-white mb-1">Fix High Burn Rate Anomaly</h4>
                  <p className="text-sm text-slate-400">Your burn rate of $15k/mo on $10k MRR leaves you with less than 6 months runway. Create a path to profitability or secure bridge funding.</p>
                </div>
              </div>
              
              <div className="flex bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <AlertCircle className="w-6 h-6 text-yellow-400 shrink-0 mr-4" />
                <div>
                  <h4 className="font-medium text-white mb-1">Create 24-Month Financial Model</h4>
                  <p className="text-sm text-slate-400">You indicated lacking a robust model. Investors require this to understand how you will deploy their capital.</p>
                  <Link href="/dashboard/roadmap" className="inline-flex mt-2 text-sm text-blaze-400 hover:text-blaze-300">
                    Go to Financial Model Lesson &rarr;
                  </Link>
                </div>
              </div>

              <div className="flex bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mr-4" />
                <div>
                  <h4 className="font-medium text-white mb-1">Strong Revenue Traction</h4>
                  <p className="text-sm text-slate-400">Hitting $10k MRR is an excellent milestone and puts you in the top tier of early-stage startups.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800">
              <Link href="/dashboard/financials" className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                Setup Automated Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
