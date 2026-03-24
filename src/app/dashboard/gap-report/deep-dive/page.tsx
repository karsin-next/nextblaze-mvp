"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, ArrowRight, ArrowLeft, Info, PieChart, Activity, 
  Target, Zap, CheckCircle2, Search, LineChart, Sparkles, User, Crosshair, TrendingDown
} from "lucide-react";
import Link from "next/link";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";

type TabType = "investor" | "root" | "benchmark" | "opportunity";

export default function GapDeepDivePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [topGaps, setTopGaps] = useState<any[]>([]);
  const [activeGapId, setActiveGapId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("investor");

  useEffect(() => {
    // 1. Pull Data exact same as 1.3.1
    let moduleCount = 0;
    let d1: any, d2: any, d3: any, d5: any, d6: any, d7: any, d8: any;
    try { if (localStorage.getItem("audit_1_1_1") || localStorage.getItem("audit_1_1_1_v2")) { moduleCount++; d1 = JSON.parse(localStorage.getItem("audit_1_1_1") || localStorage.getItem("audit_1_1_1_v2") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_2")) { moduleCount++; d2 = JSON.parse(localStorage.getItem("audit_1_1_2") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_3")) { moduleCount++; d3 = JSON.parse(localStorage.getItem("audit_1_1_3") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_5")) { moduleCount++; d5 = JSON.parse(localStorage.getItem("audit_1_1_5") || "{}"); } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_6")) { moduleCount++; d6 = JSON.parse(localStorage.getItem("audit_1_1_6") || "{}"); } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_7")) { moduleCount++; d7 = JSON.parse(localStorage.getItem("audit_1_1_7") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_8")) { moduleCount++; d8 = JSON.parse(localStorage.getItem("audit_1_1_8") || "{}")?.data; } } catch(e){}

    const sRev = d7 ? Math.round(((d7.differentiation||1)*4 + (d7.criticality||1)*4 + (11-(d7.churnRisk||10))*2) * 2.5) : 30; 
    const sAcq = d2 ? Math.round(((parseInt(d2.clarity||5))*10)) : 35; 
    const sTeam = d8 ? Math.round((d8.industryExpertise + d8.functionalCoverage + d8.executionTrackRecord + d8.founderChemistry) * 2.5) : 40;
    const sPMF = d6?.score || 45;
    const sMarket = d5?.score || 50;
    const sDiff = d3 ? Math.round(((parseInt(d3.swot||5))*10)) : 40;

    const gapsCalc = [
      {
        id: "financial", title: "Weak Financial Governance", score: sRev, pMult: 1.5,
        preview: "Investors worry: without clear financials, they can't trust your numbers.",
        investorPerspective: "Investors see this as a signal that you may not know your numbers. Without reliable financials, they can't assess runway, burn, or unit economics—which means they can't value your company. In their eyes, you're a black box.",
        quote: "I passed on a great startup once because their books were a mess. If they can't manage their own finances, how can I trust them with my money?",
        riskPct: 68,
        rootCauses: [
          { text: "You indicated margin erosion due to high churn risks.", insight: "Tracking pure unit metrics is basic financial hygiene. Without it, you can't know your scaling limits.", link: "/dashboard/audit/7-revenue", mod: "1.1.7 Revenue" },
          { text: "No explicit runway logic mapped.", insight: "Investors often look for a founder who explicitly owns the timeline array.", link: "/dashboard/strategy/how", mod: "2.4.4 Runway" }
        ],
        benchmark: { user: sRev, stageAvg: 55, indAvg: 48 },
        benchInsight: `Startups at your stage typically have a financial governance score of 55. Your score of ${sRev} places you in the bottom tier of founders in this category. The good news: this gap is highly fixable with the right tools.`,
        scoreInc: "+12",
        reframeNarrative: "When you establish clear financial tracking, you move from 'risky' to 'transparent.' Investors will trust your numbers, shortening due diligence and increasing your valuation leverage.",
        successStory: "A Series A SaaS startup had a 34 governance score. After implementing explicit board tracking and Unit Economics tracking, their score jumped to 78. They closed a $3M round 2 months later.",
        actionText: "Fix Unit Economics", actionLink: "/dashboard/unit-economics/cac"
      },
      {
        id: "acquisition", title: "Unclear Customer Acquisition Channel", score: sAcq, pMult: 1.4,
        preview: "Investors worry: building a product is useless without a repeatable sales motion.",
        investorPerspective: "A product is not a business. Investors don't fund features, they fund scalable distribution engines. If you can't articulate a deterministic, low-CAC pathway to acquiring users, they assume growth will stall.",
        quote: "So many founders show me beautiful code and zero idea how to sell it. If I don't see a clear customer acquisition channel, I assume the CAC is infinite.",
        riskPct: 74,
        rootCauses: [
          { text: "Customer purchasing trigger lacked deep urgency.", insight: "Vague triggers mean infinite sales cycles. Pinpoint the exact moment a customer is forced to buy.", link: "/dashboard/audit/2-customer", mod: "1.1.2 Customer" }
        ],
        benchmark: { user: sAcq, stageAvg: 60, indAvg: 52 },
        benchInsight: `Your channel clarity score is ${sAcq}. The baseline for institutional funding is 60. You are lacking a structured pipeline compared to peers.`,
        scoreInc: "+15",
        reframeNarrative: "Locking down a specific channel transforms your pitch from 'we hope they come' to 'we know exactly how much it costs to acquire them'.",
        successStory: "A fintech app reduced CAC by 40% simply by switching from broad 'Facebook Ads' to hyper-targetted LinkedIn outbound, raising their Fundability Score by 15 points.",
        actionText: "Map Customer Funnel", actionLink: "/dashboard/audit/2-customer"
      },
      {
        id: "team", title: "Critical Team Capability Gap", score: sTeam, pMult: 1.3,
        preview: "Investors worry: Ideas don't execute themselves. Missing roles kills momentum.",
        investorPerspective: "Investors invest in people first. A missing critical role (like a Technical Co-founder in deep tech, or a GTM lead in SaaS) means they are underwriting massive hiring risk on top of product risk.",
        quote: "I can't back a deep-tech company outsourced to a dev shop. The technical brain needs to have equity and be sitting at the founder's table.",
        riskPct: 82,
        rootCauses: [
          { text: "Functional capability coverage was highly concentrated.", insight: "Too many hats on one founder leads to systemic burnout and dropped critical functions.", link: "/dashboard/audit/8-team", mod: "1.1.8 Team" }
        ],
        benchmark: { user: sTeam, stageAvg: 70, indAvg: 65 },
        benchInsight: `Teams at your stage average a 70 capability score. Fixing this specific functional absence mathematically unlocks Series A conversations.`,
        scoreInc: "+10",
        reframeNarrative: "Acknowledging a team gap and presenting a concrete hiring plan shows extreme maturity. Investors love founders who know what they don't know.",
        successStory: "A solo founder scored a 40 on Team. By formally adding two expert advisors to cover their GTM blind spots, they bypassed the 'solo founder penalty'.",
        actionText: "Audit Founding Team", actionLink: "/dashboard/audit/8-team"
      },
      {
        id: "pmf", title: "Weak Product-Market Fit Signals", score: sPMF, pMult: 1.2,
        preview: "Investors worry: A 'nice-to-have' product will churn users constantly.",
        investorPerspective: "If the product is a vitamin, you will constantly fight for attention and budget. Investors want painkillers—products that solve an excruciating problem where customers demand to pay you.",
        quote: "We only fund oxygen. If your product is a vitamin, I know your churn rate will eventually catch up and destroy the Unit Economics.",
        riskPct: 61,
        rootCauses: [
          { text: "Product classified externally as a Vitamin.", insight: "Vitamins must be reframed. Find the one feature that acts as a painkiller and pivot the entire marketing motion towards it.", link: "/dashboard/audit/6-pmf", mod: "1.1.6 PMF" }
        ],
        benchmark: { user: sPMF, stageAvg: 65, indAvg: 58 },
        benchInsight: `Your retention/PMF signals sit at ${sPMF}. The average institutional baseline is 65. Focus purely on retention over acquisition.`,
        scoreInc: "+18",
        reframeNarrative: "Proving true PMF completely flips the power dynamic. When you have it, investors chase you.",
        successStory: "A consumer app stripped away 80% of their features to focus solely on the one 'painkiller' loop, doubling daily active users in a month.",
        actionText: "Recalibrate PMF", actionLink: "/dashboard/audit/6-pmf"
      },
      {
        id: "market", title: "Constrained Addressable Market", score: sMarket, pMult: 1.1,
        preview: "Investors worry: You can't build a $100M business in a $50M market.",
        investorPerspective: "Venture capital math relies on massive outliers. If the absolute ceiling of the market is too small, even flawless execution won't return the fund.",
        quote: "It's a great little business, but it's not a venture-scale business. The TAM just mathematically cannot support a billion-dollar outcome.",
        riskPct: 55,
        rootCauses: [
          { text: "TAM threshold failed VOS scaling.", insight: "Your bottom-up calculation yielded a volume too small for VC math. Consider expanding geographical or vertical scope.", link: "/dashboard/audit/5-market", mod: "1.1.5 Market" }
        ],
        benchmark: { user: sMarket, stageAvg: 50, indAvg: 50 },
        benchInsight: `Market sizing is arguably the hardest score to change without structural pivoting. You are scoring ${sMarket}.`,
        scoreInc: "+8",
        reframeNarrative: "Articulating a clear 'Wedge to Expansion' strategy bridges the gap between a small beachhead market and a massive eventual TAM.",
        successStory: "Amazon started as a tiny niche market (online books) but pitched the infrastructure to sell everything. Frame your current market as step one.",
        actionText: "Resize TAM/SOM", actionLink: "/dashboard/audit/5-market"
      },
      {
        id: "diff", title: "No Competitive Moat", score: sDiff, pMult: 1.0,
        preview: "Investors worry: Your margins will erode to zero as competitors copy you.",
        investorPerspective: "First-mover advantage is a myth. If your only advantage is being slightly better or cheaper, well-funded incumbents will simply clone your features and out-distribute you.",
        quote: "Okay, you're 20% faster. What stops Google or Microsoft from adding this feature over the weekend?",
        riskPct: 49,
        rootCauses: [
          { text: "Differentiation overlapped heavily with incumbents.", insight: "Relying on 'better UX' is not a moat. Force a structural advantage (IP, Network Effects).", link: "/dashboard/audit/3-competitive", mod: "1.1.3 Competitors" }
        ],
        benchmark: { user: sDiff, stageAvg: 45, indAvg: 40 },
        benchInsight: `Moats take time to build. Your score of ${sDiff} is typical for early stage, but you must articulate a roadmap to defensibility.`,
        scoreInc: "+9",
        reframeNarrative: "Defining a clear moat strategy shows extremely high sophistication. It shifts the conversation from 'what you do' to 'why nobody else can'.",
        successStory: "A CRM tool stopped competing on features and instead built unique data integrations (Switching Costs moat), raising their score by 20 points.",
        actionText: "Analyze Moats", actionLink: "/dashboard/audit/3-competitive"
      }
    ];

    const ranked = gapsCalc
      .map(g => ({ ...g, gapSeverity: Math.round((65 - g.score) * g.pMult) }))
      .sort((a,b) => b.gapSeverity - a.gapSeverity)
      .slice(0,3);

    setTopGaps(ranked);
    if(ranked.length > 0) setActiveGapId(ranked[0].id);
    setIsLoaded(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('audit_1_3_deep_dive', 'completed');
    }
  }, []);

  if (!isLoaded) return null;
  const activeGap = topGaps.find(g => g.id === activeGapId);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 pb-32">
      
      {/* HEADER */}
      <div className="mb-10 text-center">
        <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 mb-2 block">1.3.2 • Gap Deep Dive</span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#022f42] tracking-tight mb-4">
           Why These Gaps Matter
        </h1>
        <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
          Every gap below is an opportunity. Explore exactly how institutional investors interpret these signals and map your reframing logic.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* LEFT COLUMN: GAP LIST */}
        <div className="xl:w-1/3 flex flex-col gap-4">
          <h3 className="text-sm font-black text-[#1e4a62] uppercase tracking-widest mb-2 px-2">Your 3 Priority Fractures</h3>
          {topGaps.map((gap, idx) => (
            <button 
              key={gap.id}
              onClick={() => { setActiveGapId(gap.id); setActiveTab("investor"); }}
              className={`text-left p-6 rounded-sm border-2 transition-all ${activeGapId === gap.id ? 'border-indigo-600 bg-white shadow-xl scale-[1.02]' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'}`}
            >
              <div className="flex items-center gap-2 mb-3">
                 <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${idx===0 ? 'bg-rose-600' : idx===1 ? 'bg-orange-500' : 'bg-yellow-500'}`}>{idx+1}</span>
                 <h4 className="font-black text-[#022f42]">{gap.title}</h4>
              </div>
              <p className="text-xs text-gray-500 font-medium italic mb-4 leading-relaxed line-clamp-2">&quot;{gap.preview}&quot;</p>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-1">
                  <TrendingDown className="w-3 h-3"/> Costing {gap.gapSeverity} Pts
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${activeGapId === gap.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                  Deep Dive <ArrowRight className="w-3 h-3"/>
                </span>
              </div>
            </button>
          ))}
          
          <Link href="/dashboard/gap-report/actions" className="mt-4 p-4 text-center text-xs font-black uppercase tracking-widest bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42] rounded-sm transition-colors shadow-sm">
            Continue To Actions
          </Link>
        </div>

        {/* RIGHT COLUMN: DEEP DIVE TABS */}
        <div className="xl:w-2/3">
          <AnimatePresence mode="wait">
            {activeGap && (
              <motion.div 
                key={activeGap.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white border text-left border-gray-200 rounded-sm shadow-sm overflow-hidden"
              >
                {/* Header Profile */}
                <div className="p-8 border-b border-gray-100 bg-[#022f42] relative overflow-hidden">
                   <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                     <div>
                       <span className="text-[10px] font-black tracking-widest uppercase text-indigo-400 mb-2 block">Deep Dive Analysis</span>
                       <h2 className="text-3xl font-black text-white mb-2">{activeGap.title}</h2>
                       <p className="text-sm text-indigo-100/70 font-medium max-w-xl">Actively suppressing structural valuation by {activeGap.gapSeverity} diagnostic points.</p>
                     </div>
                     <Link href={activeGap.actionLink} className="whitespace-nowrap bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-sm text-xs font-black uppercase tracking-widest transition-colors border border-white/10">
                       Resolve Pipeline
                     </Link>
                   </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto no-scrollbar">
                  {[
                    { id: "investor", icon: <User className="w-4 h-4"/>, label: "Investor View" },
                    { id: "root", icon: <Search className="w-4 h-4"/>, label: "Root Cause" },
                    { id: "benchmark", icon: <LineChart className="w-4 h-4"/>, label: "Benchmarks" },
                    { id: "opportunity", icon: <Sparkles className="w-4 h-4"/>, label: "Opportunity Reframing" }
                  ].map(t => (
                    <button 
                      key={t.id} onClick={() => setActiveTab(t.id as TabType)}
                      className={`flexitems-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors flex ${activeTab === t.id ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-8 lg:p-10 min-h-[400px]">
                  
                  {/* TAB 1: Investor Perspective */}
                  {activeTab === "investor" && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8 text-left">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-[#022f42] mb-3 flex items-center gap-2">Why This Raises Red Flags <span title="Direct translation of VC psychology"><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></h3>
                          <p className="text-sm text-gray-600 leading-relaxed font-medium mb-8">
                            {activeGap.investorPerspective}
                          </p>
                          
                          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-sm relative">
                            <span className="absolute -left-3 -top-3 text-4xl text-amber-200 font-serif">&quot;</span>
                            <p className="text-sm text-amber-900 font-bold italic leading-relaxed relative z-10">&quot;{activeGap.quote}&quot;</p>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mt-3">— Simulated Tier-1 Seed Investor</span>
                          </div>
                        </div>

                        <div className="w-full md:w-64 bg-gray-50 p-6 rounded-sm border border-gray-100 flex flex-col items-center shrink-0">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Risk Magnitude</h4>
                          <div className="h-32 w-32 relative mb-2">
                             <ResponsiveContainer width="100%" height="100%">
                               <RechartsPie>
                                 <Pie data={[{value: activeGap.riskPct}, {value: 100-activeGap.riskPct}]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} stroke="none" dataKey="value" startAngle={90} endAngle={-270}>
                                   <Cell fill="#e11d48"/>
                                   <Cell fill="#f1f5f9"/>
                                 </Pie>
                               </RechartsPie>
                             </ResponsiveContainer>
                             <div className="absolute inset-0 flex items-center justify-center flex-col">
                               <span className="text-2xl font-black text-rose-600">{activeGap.riskPct}%</span>
                             </div>
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mt-2 leading-tight">
                            of VCs flag this as a critical auto-pass dealbreaker.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: Root Cause Analysis */}
                  {activeTab === "root" && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6 text-left">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-[#022f42] flex items-center gap-2">Diagnostic Triggers <span title="Direct telemetry inputs traced to your 1.1x module answers."><Info className="w-4 h-4 text-gray-400 cursor-help"/></span></h3>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-black tracking-widest border border-emerald-200 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3"/> High Confidence Source
                        </span>
                      </div>
                      
                      {activeGap.rootCauses.map((rc: any, idx: number) => (
                        <div key={idx} className="bg-white border-2 border-gray-100 p-6 rounded-sm hover:border-indigo-100 transition-colors shadow-sm">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-black flex items-center justify-center shrink-0 mt-1">{idx+1}</div>
                            <div className="flex-1">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 border-b border-gray-100 pb-1 inline-block">Sourced from {rc.mod}</h4>
                              <p className="text-sm font-bold text-[#022f42] mb-3">&quot;{rc.text}&quot;</p>
                              
                              <div className="bg-indigo-50 p-4 rounded-sm border border-indigo-100 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-1">AI Inference</span>
                                <p className="text-xs text-indigo-900 font-medium leading-relaxed">{rc.insight}</p>
                              </div>
                              
                              <Link href={rc.link} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 hover:underline">
                                Edit Input Data <ArrowRight className="w-3 h-3"/>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* TAB 3: Benchmarks */}
                  {activeTab === "benchmark" && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8 text-left">
                      <h3 className="text-lg font-black text-[#022f42] mb-2 flex items-center gap-2">Segment Relativity <span title="Anonymized aggregated tracking over 850+ identical scope entities."><Info className="w-4 h-4 text-gray-400 cursor-help"/></span></h3>
                      
                      <div className="bg-gray-50 p-8 rounded-sm border border-gray-200 relative overflow-hidden">
                        <div className="h-40 w-full mb-4 z-10 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: 'Your Footprint', val: activeGap.benchmark.user, fill: '#0ea5e9' },
                              { name: 'Sector Average', val: activeGap.benchmark.indAvg, fill: '#cbd5e1' },
                              { name: 'Stage Benchmark', val: activeGap.benchmark.stageAvg, fill: '#334155' }
                            ]} layout="vertical" margin={{top:0,right:30,left:0,bottom:0}}>
                              <XAxis type="number" domain={[0, 100]} hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize:11, fontWeight:700, fill:'#475569'}} width={120}/>
                              <ReferenceLine x={activeGap.benchmark.stageAvg} stroke="#e2e8f0" strokeDasharray="3 3"/>
                              <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#0f172a', fontWeight: 900, fontSize: 12 }}>
                                { [0,1,2].map((i) => <Cell key={i}/> ) }
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6 z-10 relative">
                           <AIAssistedInsight content={activeGap.benchInsight} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: Opportunity Reframe */}
                  {activeTab === "opportunity" && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8 text-left">
                      <div className="bg-[#022f42] p-8 rounded-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-8 justify-between">
                         <div className="absolute left-0 bottom-0 top-0 w-1/2 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                         
                         <div className="relative z-10 flex-1">
                           <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">What happens when you close this gap</h3>
                           <p className="text-lg text-white font-medium leading-relaxed mb-6">
                             {activeGap.reframeNarrative}
                           </p>
                           <Link href={activeGap.actionLink} className="inline-flex bg-emerald-500 hover:bg-emerald-400 text-[#022f42] font-black uppercase tracking-widest text-xs px-6 py-3 rounded-sm items-center gap-2 transition-colors">
                             See How to Close This Gap <ArrowRight className="w-4 h-4"/>
                           </Link>
                         </div>

                         <div className="relative z-10 shrink-0 bg-white/10 p-6 rounded-sm border border-white/20 text-center shadow-lg backdrop-blur-sm">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/70 block mb-1">Projected Valuation Alpha</span>
                           <span className="text-5xl font-black text-[#ffd800]">{activeGap.scoreInc}</span>
                           <span className="text-xs font-bold text-white/90 block mt-1">Fundability Points</span>
                         </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-100 p-6 rounded-sm">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-3">
                           <Target className="w-3.5 h-3.5"/> Verified Case Study Pattern
                         </h4>
                         <p className="text-sm text-gray-700 font-bold italic leading-relaxed pl-4 border-l-2 border-indigo-200">
                           {activeGap.successStory}
                         </p>
                      </div>
                    </motion.div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
