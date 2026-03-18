"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "1. Corporate Structure & IP",
    status: "completed",
    tasks: ["Incorporate as Delaware C-Corp", "Assign IP to the company", "Set up option pool (20%)"]
  },
  {
    id: 2,
    title: "2. Financial Foundations",
    status: "in-progress",
    tasks: ["Clean up P&L statements", "Create 24-month financial model", "Establish automated book-keeping"]
  },
  {
    id: 3,
    title: "3. The Pitch Assets",
    status: "pending",
    tasks: ["Draft 10-slide deck", "Create 1-page executive summary", "Record 3-minute pitch video"]
  },
  {
    id: 4,
    title: "4. The Data Room",
    status: "pending",
    tasks: ["Upload cap table", "Upload legal formations", "Upload material contracts"]
  }
];

export default function FundraisingRoadmap() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Your Fundraising Roadmap
        </h1>
        <p className="text-slate-400 mt-2">
          A step-by-step guide to becoming investor-ready based on your current stage.
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-slate-800 ml-[-0.5px] z-0 hidden md:block" />

        <div className="space-y-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 md:ml-12 border ${
                step.status === 'in-progress' 
                  ? 'border-blaze-500/50 shadow-lg shadow-blaze-500/5' 
                  : 'border-slate-800'
              }`}
            >
              {/* Desktop Status Icon Indicator */}
              <div className="absolute left-0 mt-1 md:-ml-12 hidden md:flex items-center justify-center w-12 bg-slate-950">
                {step.status === 'completed' && <CheckCircle2 className="w-8 h-8 text-green-500 bg-slate-950" />}
                {step.status === 'in-progress' && <Clock className="w-8 h-8 text-blaze-400 bg-slate-950" />}
                {step.status === 'pending' && <Circle className="w-8 h-8 text-slate-700 bg-slate-950" />}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold flex items-center ${
                  step.status === 'in-progress' ? 'text-blaze-300' : 'text-slate-200'
                }`}>
                  <span className="md:hidden mr-3">
                    {step.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {step.status === 'in-progress' && <Clock className="w-6 h-6 text-blaze-400" />}
                    {step.status === 'pending' && <Circle className="w-6 h-6 text-slate-700" />}
                  </span>
                  {step.title}
                </h3>
                {step.status === 'in-progress' && (
                  <span className="mt-2 md:mt-0 px-3 py-1 bg-blaze-500/10 text-blaze-400 rounded-full text-xs font-semibold tracking-wide uppercase self-start">
                    Current Focus
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {step.tasks.map((task, i) => (
                  <div key={i} className="flex items-start group">
                    <button className="mt-0.5 mr-3 flex-shrink-0 text-slate-600 group-hover:text-blaze-400 transition-colors">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500/70" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <span className={`text-sm ${step.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      {task}
                    </span>
                  </div>
                ))}
              </div>

              {step.status === 'in-progress' && (
                <div className="mt-8 pt-5 border-t border-slate-800 flex flex-wrap gap-4">
                  <Link href="/education" className="text-sm font-medium text-slate-400 hover:text-white flex items-center transition-colors">
                    <FileText className="w-4 h-4 mr-2" /> Read: Financial Model Lesson
                  </Link>
                  <button className="text-sm font-medium text-blaze-400 hover:text-blaze-300 flex items-center transition-colors">
                    Download Finance Template <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
