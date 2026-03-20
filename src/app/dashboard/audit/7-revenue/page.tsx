"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCcw, DollarSign, ShoppingCart, Percent, Box, Banknote, Sparkles, Plus, X, Info, BookOpen, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ALL_MODELS = [
  {
    id: "saas",
    name: "B2B SaaS / Subscription",
    icon: RefreshCcw,
    desc: "Recurring revenue for software access.",
    grossMargin: "70-85%",
    investorNote: "SaaS investors expect 75%+ gross margins. ARR and NRR are the primary metrics VCs will scrutinize. Target >120% NRR.",
    tip: "Tiered pricing (Starter / Growth / Enterprise) dramatically expands your addressable market and creates natural upsell paths.",
    checkmarks: ["Monthly Recurring Revenue (MRR)", "Annual Contract Value (ACV)", "Net Revenue Retention (NRR)", "Churn Rate", "Expansion MRR"],
    redFlags: ["High support costs eroding margins", "No upsell path from free tier", "Month-to-month contracts with easy cancel"],
    color: "#3b82f6"
  },
  {
    id: "transactional",
    name: "Transactional / Usage-Based",
    icon: Banknote,
    desc: "Pay per use, API calls, or transaction volume.",
    grossMargin: "40-70%",
    investorNote: "Usage-based is attractive because revenue scales with customer success. Show Gross Merchandise Volume (GMV) trends and per-transaction unit economics.",
    tip: "Usage-based pricing lowers the barrier to entry but creates variable revenue. Build in minimum commitments or prepay discounts to stabilize cash flow.",
    checkmarks: ["GMV Growth Rate", "Revenue per Transaction", "Active User Trend", "API Call Volume", "Monthly Active Units"],
    redFlags: ["Negative unit economics at scale", "Zero floor contracts (entirely variable)", "No data on usage predictability"],
    color: "#10b981"
  },
  {
    id: "marketplace",
    name: "Marketplace / Commission",
    icon: Percent,
    desc: "Taking a cut of GMV between buyers and sellers.",
    grossMargin: "60-80%",
    investorNote: "Marketplaces require high liquidity. Investors will look closely at your Take Rate (usually 10-20%) and GMV growth. Solve the chicken-and-egg problem first.",
    tip: "The trap: marketplaces often subsidize early sides (buyers or sellers). Track each side's CAC separately. Platform leakage (transactions happening off-platform) is a critical danger signal.",
    checkmarks: ["Take Rate (%)", "Gross Merchandise Volume (GMV)", "Supply/Demand Ratio", "Repeat Transaction Rate", "Liquidity Score"],
    redFlags: ["Platform leakage (off-platform transactions)", "Single-side dependency", "Negative take rate economics"],
    color: "#8b5cf6"
  },
  {
    id: "ecommerce",
    name: "E-Commerce / Retail",
    icon: ShoppingCart,
    desc: "Direct sale of physical or digital goods.",
    grossMargin: "30-60%",
    investorNote: "E-commerce investors focus heavily on LTV:CAC ratio, Average Order Value (AOV), and repeat purchase rates. Branded DTC businesses command higher multiples than unbranded resellers.",
    tip: "The key to e-commerce fundability is Contribution Margin per order after accounting for COGS, shipping, returns, and fulfillment. If this is negative, scaling destroys value.",
    checkmarks: ["Average Order Value (AOV)", "LTV:CAC Ratio", "Repeat Purchase Rate", "Return Rate", "Inventory Turnover"],
    redFlags: ["CAC exceeds LTV", "High return rates (>15%)", "Over-reliance on paid ads for acquisition"],
    color: "#f59e0b"
  },
  {
    id: "hardware",
    name: "Hardware + Subscription",
    icon: Box,
    desc: "One-off hardware sale paired with recurring software.",
    grossMargin: "20-50% hardware / 70%+ software",
    investorNote: "Hardware + Sub is capital intensive but highly defensible. Make sure your LTV from software covers the initial hardware development CAC. Investors love the razors-and-blades model (e.g., Peloton, Nest).",
    tip: "The blended gross margin is what matters. If hardware ships at break-even and software at 80%, your blended margin improves over time as the installed base grows.",
    checkmarks: ["Blended Gross Margin", "Attached Service Rate (%)", "Hardware BOM vs. MSRP", "Software ARR per Device", "Customer Lifetime (Years)"],
    redFlags: ["Hardware shipped at loss with no guaranteed software attach", "Long product development cycles eating runway", "Supply chain concentration risk"],
    color: "#ef4444"
  },
  {
    id: "licensing",
    name: "IP / Licensing",
    icon: DollarSign,
    desc: "Licensing proprietary technology, data, or brand.",
    grossMargin: "80-95%",
    investorNote: "Licensing is the highest gross margin model that exists. If you have defensible IP, you can generate revenue without proportional cost increases. Common in deep tech, biotech, and media.",
    tip: "The monetization challenge: licensing is often lumpy (big deals, long cycles). Investors want to see a pipeline of licensees, not dependence on a single contract.",
    checkmarks: ["Number of Active Licensees", "Royalty Rate (%)", "Deal Pipeline Value", "IP Protection (Patent/Trade Secret)", "Exclusivity Terms"],
    redFlags: ["Single licensee concentration risk", "Weak IP protection", "Industry-standard technology with no defensibility"],
    color: "#06b6d4"
  },
];

type RevenueStream = {
  modelId: string;
  percentage: number;
};

export default function RevenueExplorerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [streams, setStreams] = useState<RevenueStream[]>([{ modelId: "", percentage: 100 }]);
  const [pricingPower, setPricingPower] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [showTip, setShowTip] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`audit_7-revenue_data_${user?.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.streams) setStreams(parsed.streams);
          if (parsed.pricingPower) setPricingPower(parsed.pricingPower);
        } catch(e) {}
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`audit_7-revenue_data_${user?.id}`, JSON.stringify({ streams, pricingPower }));
    }
  }, [streams, pricingPower, user?.id]);

  const addStream = () => {
    if (streams.length >= 4) return;
    setStreams(prev => [...prev, { modelId: "", percentage: 0 }]);
  };

  const removeStream = (idx: number) => {
    setStreams(prev => prev.filter((_, i) => i !== idx));
  };

  const updateStream = (idx: number, field: keyof RevenueStream, value: string | number) => {
    setStreams(prev => {
      const updated = [...prev];
      (updated[idx] as any)[field] = value;
      if (field === 'modelId') setActiveModel(value as string);
      return updated;
    });
  };

  const totalPct = streams.reduce((s, r) => s + (r.percentage || 0), 0);
  const primaryModel = ALL_MODELS.find(m => m.id === streams[0]?.modelId);
  const hasValidConfig = streams.some(s => s.modelId !== "") && totalPct <= 100;

  const submitModule = async () => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined') localStorage.setItem(`audit_7-revenue_${user?.id}`, 'completed');
    setTimeout(() => { router.push("/dashboard"); }, 1500);
  };

  const activeDetails = ALL_MODELS.find(m => m.id === activeModel);

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
            Module 1.1.7
          </div>
          <h1 className="text-2xl font-bold text-[#022f42]">Revenue Model Explorer</h1>
          <p className="text-[#1e4a62] text-sm mt-1 max-w-2xl leading-relaxed">
            Define your income streams, pricing power, and gross margin positioning. Investors evaluate your revenue model&apos;s scalability and defensibility as a key funding signal.
          </p>
        </div>
        <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42] shrink-0 ml-4">
          Back to Hub
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Income Stream Builder */}
        <div className="lg:col-span-2 space-y-5">

          {/* Stream Builder */}
          <div className="bg-white border border-[#1e4a62]/10 rounded-sm p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-base font-bold text-[#022f42]">Income Streams</h2>
                <p className="text-[10px] text-[#1e4a62] mt-0.5">Most fundable startups have 1-2 primary revenue streams. Add up to 4.</p>
              </div>
              {streams.length < 4 && (
                <button onClick={addStream} className="flex items-center px-3 py-2 bg-[#f2f6fa] border border-[#1e4a62]/20 text-[#022f42] text-[10px] font-bold uppercase tracking-widest hover:bg-[#022f42] hover:text-white transition-colors rounded-sm">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Stream
                </button>
              )}
            </div>

            <div className="space-y-4">
              {streams.map((stream, idx) => {
                const model = ALL_MODELS.find(m => m.id === stream.modelId);
                return (
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 border-2 rounded-sm transition-all ${stream.modelId ? 'border-[#022f42]/20 bg-[#f2f6fa]/50' : 'border-dashed border-[#1e4a62]/20 bg-white'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-[9px] font-black uppercase tracking-widest text-[#1e4a62] shrink-0">
                        Stream {idx + 1} {idx === 0 ? "(Primary)" : "(Secondary)"}
                      </div>
                      {idx > 0 && (
                        <button onClick={() => removeStream(idx)} className="ml-auto text-[#1e4a62]/40 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <select
                          value={stream.modelId}
                          onChange={e => updateStream(idx, 'modelId', e.target.value)}
                          className="w-full p-3 bg-white border border-[#1e4a62]/15 text-sm font-bold text-[#022f42] outline-none rounded-sm focus:border-[#022f42] appearance-none"
                        >
                          <option value="">Select revenue model...</option>
                          {ALL_MODELS.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <div className="flex border border-[#1e4a62]/15 rounded-sm overflow-hidden focus-within:border-[#022f42]">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={stream.percentage}
                            onChange={e => updateStream(idx, 'percentage', Number(e.target.value))}
                            className="w-full p-3 bg-white outline-none font-bold text-[#022f42] text-sm"
                            placeholder="% of Revenue"
                          />
                          <div className="bg-[#f2f6fa] px-2 flex items-center border-l border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">%</div>
                        </div>
                      </div>
                    </div>

                    {model && (
                      <div className="mt-3 flex items-center gap-3 text-[10px]">
                        <span className="font-bold text-[#1e4a62]">Typical Gross Margin:</span>
                        <span className="font-black text-[#022f42]">{model.grossMargin}</span>
                        <button onClick={() => setActiveModel(stream.modelId)} className="ml-auto text-[#1e4a62] hover:text-[#022f42] flex items-center gap-1 font-bold">
                          <Info className="w-3 h-3" /> View Insights
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Revenue split validation */}
            {streams.length > 1 && (
              <div className={`mt-4 p-3 border rounded-sm text-xs font-bold flex items-center gap-2 ${totalPct === 100 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                {totalPct === 100 ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                Revenue split: {totalPct}% {totalPct === 100 ? "— Perfect allocation" : totalPct < 100 ? `— ${100 - totalPct}% unallocated` : `— ${totalPct - 100}% over-allocated`}
              </div>
            )}
          </div>

          {/* Pricing Power Slider */}
          <div className="bg-white border border-[#1e4a62]/10 rounded-sm p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#022f42] mb-1">Pricing Power Assessment</h2>
            <p className="text-[10px] text-[#1e4a62] mb-6 uppercase tracking-widest font-semibold flex items-center">
              <DollarSign className="w-3.5 h-3.5 text-green-600 mr-1" /> How easily can you raise prices without losing customers?
            </p>
            <div className="mb-2 flex justify-between text-xs font-bold text-[#022f42]">
              <span>Commodity (Race to bottom)</span>
              <span className="font-black text-2xl text-[#022f42] mx-4">{pricingPower}</span>
              <span>Monopoly (Price Maker)</span>
            </div>
            <input
              type="range"
              min="0" max="100"
              value={pricingPower}
              onChange={e => setPricingPower(Number(e.target.value))}
              className="w-full h-2 bg-[#f2f6fa] appearance-none outline-none rounded-full cursor-pointer"
              style={{ backgroundImage: `linear-gradient(to right, #022f42 ${pricingPower}%, #e2e8f0 ${pricingPower}%)` }}
            />
            <div className="flex justify-between text-[10px] text-[#1e4a62] mt-2 font-medium">
              <span>High churn pressure</span>
              <span>{pricingPower >= 70 ? "Strong moat — high funding signal" : pricingPower >= 40 ? "Moderate defensibility" : "Highly commoditized — risk flag"}</span>
              <span>Inelastic demand</span>
            </div>

            <div className="mt-5">
              <button
                onClick={submitModule}
                disabled={isSubmitting || !hasValidConfig}
                className={`w-full p-4 font-bold tracking-widest uppercase text-sm border-2 transition-all flex items-center justify-center rounded-sm ${
                  hasValidConfig
                    ? "bg-[#022f42] text-white border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] shadow-lg cursor-pointer"
                    : "bg-[#f2f6fa] text-[rgba(2,47,66,0.4)] border-transparent cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Generating Economic Profile..." : <><span className="mr-2">Confirm Revenue Model</span> <ArrowRight className="w-4 h-4" /></>}
              </button>
              {!hasValidConfig && <p className="text-[10px] text-[#1e4a62] text-center mt-2">Select at least one revenue model to continue</p>}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Model Details + Education */}
        <div className="space-y-4">

          {/* AI Model Insights */}
          <AnimatePresence mode="wait">
            {activeDetails ? (
              <motion.div key={activeDetails.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#022f42] p-5 rounded-sm border-l-4 border-[#ffd800] shadow-lg">
                <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-[#ffd800] mb-3">
                  <Sparkles className="w-3 h-3 mr-1.5" /> AI Assisted — {activeDetails.name}
                </div>
                <p className="text-xs text-[#b0d0e0] leading-relaxed mb-4">{activeDetails.investorNote}</p>
                <div className="border-t border-white/10 pt-3">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#ffd800] mb-2">Strategy Tip</div>
                  <p className="text-xs text-[#b0d0e0] leading-relaxed">{activeDetails.tip}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#f2f6fa] p-5 rounded-sm border border-dashed border-[#1e4a62]/20 text-center">
                <Sparkles className="w-8 h-8 text-[#1e4a62]/30 mx-auto mb-2" />
                <p className="text-xs text-[#1e4a62] font-medium">Select a revenue model to see AI-powered investor insights and strategic tips.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Key Metrics Checklist */}
          {activeDetails && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#1e4a62]/10 p-5 rounded-sm shadow-sm">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-3 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-[#ffd800]" /> Metrics Investors Will Ask For
              </div>
              <div className="space-y-1.5">
                {activeDetails.checkmarks.map(c => (
                  <div key={c} className="flex items-center gap-2 text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span className="text-[#1e4a62]">{c}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Red Flags */}
          {activeDetails && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-100 p-5 rounded-sm">
              <div className="text-[9px] font-black uppercase tracking-widest text-red-700 mb-3 flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> VC Red Flags for This Model
              </div>
              <div className="space-y-1.5">
                {activeDetails.redFlags.map(f => (
                  <div key={f} className="flex items-start gap-2 text-[10px]">
                    <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-red-700 leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education Panel */}
          <div className="bg-white border border-[#1e4a62]/10 p-5 rounded-sm shadow-sm">
            <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-3 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Why Revenue Model Matters
            </div>
            <p className="text-xs text-[#1e4a62] leading-relaxed">
              Your revenue model determines your gross margin ceiling, which in turn determines your maximum valuation multiple. SaaS at 80% margins can command 10-20x ARR multiples. E-commerce at 30% margins typically sees 1-3x revenue multiples. Choosing the right model is as important as the product itself.
            </p>
          </div>

          {/* Gross Margin Benchmarks */}
          <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-4 rounded-sm">
            <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-3">Gross Margin Benchmarks</div>
            <div className="space-y-2">
              {ALL_MODELS.slice(0, 4).map(m => (
                <div key={m.id} className="flex justify-between text-[10px] items-center">
                  <span className="text-[#1e4a62]">{m.name.split('/')[0].trim()}</span>
                  <span className="font-bold text-[#022f42] text-right">{m.grossMargin}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
