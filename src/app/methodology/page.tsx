"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  CheckCircle2, Presentation, Target, Handshake
} from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="bg-[#f2f6fa] text-[#022f42] min-h-screen pb-20">
      {/* HEADER DIV */}
      <div className="bg-[#022f42] text-white py-16 px-6 relative overflow-hidden text-center">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ffd800] rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         <div className="max-w-5xl mx-auto relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">The FundabilityOS</h1>
            <p className="text-xl text-[#b0d0e0] max-w-3xl mx-auto leading-relaxed mb-6">
              A dual-sided subscription platform designed to bridge the <strong>&quot;fundability gap&quot;</strong> for SMEs/startups and the <strong>&quot;deal flow gap&quot;</strong> for investors.
            </p>
         </div>
      </div>

      {/* DUAL WORKFLOW LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-4 relative">
          
           {/* LEFT COLUMN: STARTUPS */}
           <div className="flex-1 bg-white shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-t-[6px] border-[#022f42] relative z-10">
              <div className="p-8 md:p-10 bg-[#f8fafc] border-b border-[rgba(2,47,66,0.1)]">
                 <h2 className="text-3xl font-bold text-[#022f42] mb-3 leading-tight">
                   FundabilityOS Method™:<br/>
                   <span className="text-[#1e4a62] text-2xl">Your 4-Week Sprint to Investor-Ready.</span>
                 </h2>
                 <p className="text-sm font-semibold text-[#1e4a62] uppercase tracking-widest mt-4 flex items-center">
                   <Presentation className="w-4 h-4 mr-2" /> For Startups
                 </p>
              </div>

              <div className="p-8 md:p-10 space-y-12">
                 {/* Week 1 */}
                 <div>
                    <h3 className="text-xl font-bold text-[#022f42] flex items-center mb-2">
                       <span className="w-8 h-8 rounded-full bg-[#022f42] text-[#ffd800] flex items-center justify-center mr-3 text-sm shrink-0">W1</span>
                       DIAGNOSE - The Baseline & The Gap
                    </h3>
                    <p className="text-[#1e4a62] font-semibold mb-4 ml-11 text-sm bg-blue-50 py-1 px-3 inline-block">Focus: Stop guessing. Start measuring.</p>
                    <ul className="space-y-4 ml-11 text-sm text-[#1e4a62]">
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 1.1: The 360° Fundability Audit.</strong> An AI-driven questionnaire covering team, market, traction, financials, and IP. No data entry, just smart questions.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 1.2: Your Live Fundability Score.</strong> A dynamic, percentage-based score (e.g., &quot;You are 42% fundable&quot;). This is the &quot;North Star&quot; metric.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 1.3: The Gap Analysis Report.</strong> A clear, AI-generated PDF report detailing the top 3 weaknesses holding the score back.</div></li>
                    </ul>
                 </div>

                 {/* Week 2 */}
                 <div>
                    <h3 className="text-xl font-bold text-[#022f42] flex items-center mb-2">
                       <span className="w-8 h-8 rounded-full bg-[#022f42] text-[#ffd800] flex items-center justify-center mr-3 text-sm shrink-0">W2</span>
                       ACTIVATE - The Data-Driven Foundation
                    </h3>
                    <p className="text-[#1e4a62] font-semibold mb-4 ml-11 text-sm bg-blue-50 py-1 px-3 inline-block">Focus: Connect your reality to the platform.</p>
                    <ul className="space-y-4 ml-11 text-sm text-[#1e4a62]">
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 2.1: The Financials Connect.</strong> Securely connect business bank account(s) via API. The platform ingests 12-24 months of transaction history.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 2.2: The Investor Dashboard.</strong> Automated generation of live, visual dashboards for Runway, Burn Rate, Revenue Growth, and SaaS metrics.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 2.3: One-Click Unit Economics.</strong> The AI automatically calculates your LTV, CAC, and Gross Margin from your transaction data.</div></li>
                    </ul>
                 </div>

                 {/* Week 3 */}
                 <div>
                    <h3 className="text-xl font-bold text-[#022f42] flex items-center mb-2">
                       <span className="w-8 h-8 rounded-full bg-[#022f42] text-[#ffd800] flex items-center justify-center mr-3 text-sm shrink-0">W3</span>
                       ACCELERATE - The Strategic Roadmap
                    </h3>
                    <p className="text-[#1e4a62] font-semibold mb-4 ml-11 text-sm bg-blue-50 py-1 px-3 inline-block">Focus: Execute the plan to close the gap.</p>
                    <ul className="space-y-4 ml-11 text-sm text-[#1e4a62]">
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 3.1: The Personalized Action Plan.</strong> An interactive, step-by-step checklist generated from the Gap Analysis. Specific tasks targeting weaknesses.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 3.2: The Toolbox & Templates.</strong> Direct access to exact templates needed: cap tables, financial models, pitch deck outlines, IP checklists.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 3.3: Micro-Lessons (Education Hub).</strong> 5-minute video lessons or articles linked to each task (e.g., &quot;Understanding Term Sheets&quot;).</div></li>
                    </ul>
                 </div>

                 {/* Week 4 */}
                 <div>
                    <h3 className="text-xl font-bold text-[#022f42] flex items-center mb-2">
                       <span className="w-8 h-8 rounded-full bg-[#022f42] text-[#ffd800] flex items-center justify-center mr-3 text-sm shrink-0">W4</span>
                       ACTIVATE - The Investor-Facing Profile
                    </h3>
                    <p className="text-[#1e4a62] font-semibold mb-4 ml-11 text-sm bg-blue-50 py-1 px-3 inline-block">Focus: Package your progress for the market.</p>
                    <ul className="space-y-4 ml-11 text-sm text-[#1e4a62]">
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 4.1: The One-Page Investor Snapshot.</strong> A beautifully designed, one-click PDF summary of key metrics, team, and fundability score.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 4.2: The FundabilityOS Verified Badge.</strong> A digital badge indicating completion of the OS process, signaling quality to investors.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module 4.3: Investor Visibility Toggle.</strong> Founder chooses to make profile visible on the Deal Flow Portal.</div></li>
                    </ul>
                 </div>

                 <div className="pt-8 border-t border-[rgba(2,47,66,0.1)]">
                    <Link href="/login" className="w-full block text-center bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] py-4 font-bold uppercase tracking-widest text-sm transition-all shadow-md">
                       Start Your Fundability Journey
                    </Link>
                 </div>
              </div>
           </div>

           {/* VISUAL CONNECTOR: THE VERIFIED HANDSHAKE */}
           <div className="hidden lg:flex flex-col items-center py-20 relative z-0 shrink-0 w-32 shrink-0">
               {/* Horizontal connecting line wrapping underneath the middle column */}
               <div className="absolute top-[350px] left-0 right-0 h-[4px] bg-[#ffd800] z-0 hidden lg:block" style={{ width: 'calc(100% + 2rem)', marginLeft: '-1rem' }}></div>
               
               <div className="bg-[#ffd800] border-4 border-[#f2f6fa] rounded-full w-28 h-28 flex flex-col items-center justify-center z-10 shadow-xl mt-[285px] relative">
                  <Handshake className="w-10 h-10 text-[#022f42] mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-tighter text-[#022f42] leading-tight text-center px-2">The Verified Handshake</span>
               </div>
               <div className="text-center mt-4 w-40 absolute top-[430px] z-10 bg-[#f2f6fa] p-2 rounded text-xs font-bold text-[#1e4a62]">
                  Fundable Startups <br/>↓<br/> Curated Deal Flow
               </div>
           </div>
           
           {/* Mobile Handshake spacer */}
           <div className="lg:hidden flex flex-col items-center justify-center py-10 relative z-0">
               <div className="w-[4px] h-32 bg-[#ffd800] absolute inset-y-0 z-0"></div>
               <div className="bg-[#ffd800] border-4 border-[#f2f6fa] rounded-full w-24 h-24 flex flex-col items-center justify-center z-10 shadow-xl">
                  <Handshake className="w-8 h-8 text-[#022f42] mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-[#022f42] leading-tight text-center px-2">Verified Handshake</span>
               </div>
           </div>

           {/* RIGHT COLUMN: INVESTORS */}
           <div className="flex-1 bg-white shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-t-[6px] border-[#ffd800] relative z-10 h-fit">
              <div className="p-8 md:p-10 bg-[#f8fafc] border-b border-[rgba(2,47,66,0.1)]">
                 <h2 className="text-3xl font-bold text-[#022f42] mb-3 leading-tight">
                   FundabilityOS Method™:<br/>
                   <span className="text-[#1e4a62] text-2xl">Your 3-Step Path to Proprietary Deal Flow.</span>
                 </h2>
                 <p className="text-sm font-semibold text-[#1e4a62] uppercase tracking-widest mt-4 flex items-center">
                   <Target className="w-4 h-4 mr-2" /> For Investors
                 </p>
              </div>

              <div className="p-8 md:p-10 space-y-12">
                 {/* Step 1 */}
                 <div>
                    <h3 className="text-xl font-bold text-[#022f42] flex items-center mb-2">
                       <span className="w-8 h-8 rounded-full bg-[#022f42] text-[#ffd800] flex items-center justify-center mr-3 text-sm shrink-0">1</span>
                       CURATE - Define Your Perfect Deal
                    </h3>
                    <p className="text-[#1e4a62] font-semibold mb-4 ml-11 text-sm bg-blue-50 py-1 px-3 inline-block">Focus: Stop looking at everything. See only what matters.</p>
                    <ul className="space-y-4 ml-11 text-sm text-[#1e4a62]">
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module A: Smart Filtering & Criteria Setting.</strong> Advanced interface for hyper-specific filters: Geography, Industry, Stage, Traction, and Fundability Score (&gt;70%).</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module B: The Automated Deal Alert.</strong> Save criteria and receive instant notifications when matching startups complete the framework and opt into visibility.</div></li>
                    </ul>
                 </div>

                 {/* Step 2 */}
                 <div>
                    <h3 className="text-xl font-bold text-[#022f42] flex items-center mb-2">
                       <span className="w-8 h-8 rounded-full bg-[#022f42] text-[#ffd800] flex items-center justify-center mr-3 text-sm shrink-0">2</span>
                       VALIDATE - See Through the Noise
                    </h3>
                    <p className="text-[#1e4a62] font-semibold mb-4 ml-11 text-sm bg-blue-50 py-1 px-3 inline-block">Focus: Get the signal, skip the marketing fluff.</p>
                    <ul className="space-y-4 ml-11 text-sm text-[#1e4a62]">
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module C: The AI-Generated Deal Memo.</strong> Auto-generated data-rich one-pager tracking Runway, Burn, Revenue, and AI analysis. No polished pitch decks, just data.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module D: The &quot;Verified&quot; Data Room.</strong> Access the underlying financial dashboards the startup used in the OS. Raw, validated data, not investor-specific projections.</div></li>
                    </ul>
                 </div>

                 {/* Step 3 */}
                 <div>
                    <h3 className="text-xl font-bold text-[#022f42] flex items-center mb-2">
                       <span className="w-8 h-8 rounded-full bg-[#022f42] text-[#ffd800] flex items-center justify-center mr-3 text-sm shrink-0">3</span>
                       CONNECT & EXECUTE - Move from Screen to Term Sheet
                    </h3>
                    <p className="text-[#1e4a62] font-semibold mb-4 ml-11 text-sm bg-blue-50 py-1 px-3 inline-block">Focus: Seamless, secure engagement.</p>
                    <ul className="space-y-4 ml-11 text-sm text-[#1e4a62]">
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module E: Secure Introductions.</strong> Built-in messaging system connecting with founders directly within the platform.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module F: The Digital Data Room.</strong> A secure space to request and share additional due diligence documents.</div></li>
                       <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-[#ffd800] mr-2 shrink-0 mt-0.5" /> <div><strong>Module G (Future Phase): Deal Execution Hub.</strong> Tools to co-create term sheets, manage allocations, and close rounds directly on-platform.</div></li>
                    </ul>
                 </div>

                 <div className="pt-8 border-t border-[rgba(2,47,66,0.1)]">
                    <Link href="/login" className="w-full block text-center bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] py-4 font-bold uppercase tracking-widest text-sm transition-all shadow-md">
                       Get Early Access to Deals
                    </Link>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
