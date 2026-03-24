"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, ArrowRight, BookOpen, Sparkles, ListChecks, XCircle, ChevronDown, ChevronUp, Link2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// AI-Assisted badge component
const AiBadge = () => (
  <span className="inline-flex items-center bg-[#022f42] text-[#ffd800] px-2 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-sm ml-2">
    <Sparkles className="w-2.5 h-2.5 mr-1" /> AI Assisted
  </span>
);

const allGaps = [
  {
    id: "missing_tech_cofounder",
    severity: "critical",
    title: "Missing Technical Co-founder",
    source: "Module 1.1.8 - Team",
    sourceHref: "/dashboard/audit/8-team",
    description: "You are building a Deep Tech product but lack an in-house technical lead. Investors view outsourced core development at this stage as a critical risk that signals the team cannot build the product independently.",
    whyItMatters: "A technical co-founder eliminates the #1 reason early-stage startups fail: the inability to ship and iterate on the core product without massive dependency on contractors. 70% of top VCs will not invest pre-Series A without at least one technical founder.",
    action: "Begin executive search for a CTO or strong Lead Engineer. Consider fractional equity (0.5-2%) compensated via a vesting schedule. Alternatively, enroll in an accelerator program that provides technical co-founder matching.",
    aiInsight: "Based on your sector and stage, the most defensible path is to recruit from local university networks or global talent platforms like Braintrust, Toptal, or AngelList Talent with an equity-first offer.",
    checklist: [
      "Search AngelList, LinkedIn, and university alumni networks for CTO candidates",
      "Prepare a Technical Co-founder Offer Term Sheet (equity range: 5-20%)",
      "Complete Module 1.1.8 Team Composition Check to update your score",
      "Attend at least 2 startup networking events to expand your technical network",
    ],
    lesson: "Structuring Early Startup Teams"
  },
  {
    id: "vitamin_product",
    severity: "critical",
    title: "'Vitamin' Product Positioning",
    source: "Module 1.1.6 - PMF",
    sourceHref: "/dashboard/audit/6-pmf",
    description: "Your PMF probe indicates your solution is a 'nice to have' (Vitamin) rather than a 'must have' (Painkiller). Vitamins are the first subscription cancelled in a budget crunch.",
    whyItMatters: "Investors discount Vitamin products by 30-50% in valuation models because the retention curves are weak, churn is high, and pricing power is limited. Painkillers command premium pricing because removal causes immediate, quantifiable pain.",
    action: "Refine your persona in Module 1.1.2 to narrow to the user where your product is essential. Consider pivoting features to address an acute, budget-approved pain point that your current user is losing sleep over.",
    aiInsight: "The fastest fix is to interview your top 10% most engaged users and ask: 'What would happen to your business if you lost access to our product tomorrow?' Their answers reveal where the Painkiller positioning lives.",
    checklist: [
      "Interview your top 10 most engaged users about switching costs",
      "Re-complete Module 1.1.6 Traction & PMF Validator after interviews",
      "Identify one workflow that breaks completely without your product",
      "Rewrite your product's hero statement to lead with the pain, not the feature",
    ],
    lesson: "The Vitamin vs Painkiller Framework"
  },
  {
    id: "narrow_white_space",
    severity: "warning",
    title: "Narrow Competitive White Space",
    source: "Module 1.1.3 - Competitors",
    sourceHref: "/dashboard/audit/3-competitor",
    description: "Your position on the pricing/features matrix places you in the path of well-funded incumbents without a clear differentiation moat. This creates a commodity competition dynamic.",
    whyItMatters: "Being caught in the 'land of the living dead' between incumbents is a VC red flag. Investors want to see a clear 10x differentiation from the dominant player, not a marginal improvement.",
    action: "Re-evaluate your positioning in Module 1.1.3. Can you go further upmarket with enterprise features, or radically cheaper with a self-serve model?",
    aiInsight: "The most defensible positions are at the extremes: either radically cheaper (10x lower price) or radically differentiated (10x better at one specific thing). The middle is where startups go to die.",
    checklist: [
      "Map your top 5 competitors on a 2x2 Price vs. Feature Depth matrix",
      "Identify the one dimension where you can be 10x better than the market leader",
      "Re-complete Module 1.1.3 Competitor Positioning Check",
      "Update your pitch deck positioning slide to reflect the new differentiation",
    ],
    lesson: "Finding Defensible White Space"
  },
  {
    id: "small_tam",
    severity: "warning",
    title: "Total Addressable Market (TAM) Under $1B",
    source: "Module 1.1.5 - Market",
    sourceHref: "/dashboard/audit/5-market",
    description: "Your calculated TAM is under $1B. While your SOM is more important for near-term execution, venture-scale returns require a massive potential ceiling for a VC's fund math to work.",
    whyItMatters: "A top-tier VC fund needs a 10-30x return on every investment to make fund math work. If your TAM is $500M and you capture 20% at a 5x multiple, that's still only a $500M outcome — too small for most institutional funds. $1B+ TAM is a minimum threshold.",
    action: "Expand your market definition or identify adjacent markets you can enter later. Use the 'Expand, Adjacent, New' framework: define your core SOM, your 3-year SAM expansion, and a 10-year TAM narrative.",
    aiInsight: "Consider whether you are defining your market too narrowly. Often, the real TAM is the total spend your customers currently use to solve the problem you address — not just direct competitors.",
    checklist: [
      "Re-run Module 1.1.5 Market Sizer with revised TAM definition",
      "Research 2-3 adjacent market verticals you could enter by year 3",
      "Build a 'market expansion' slide for your pitch deck",
      "Include CAGR data to show market growth momentum",
    ],
    lesson: "Venture Math & Market Sizing"
  },
  {
    id: "strong_revenue",
    severity: "good",
    title: "Strong Revenue Model Strategy",
    source: "Module 1.1.7 - Revenue",
    sourceHref: "/dashboard/audit/7-revenue",
    description: "Your subscription model with high pricing power suggests excellent future gross margins and strong LTV:CAC potential. This is one of the most fundable revenue architectures.",
    whyItMatters: "SaaS businesses with 75%+ gross margins are valued at 5-15x ARR. This model creates predictable revenue, reduces CAC payback period, and is highly legible to institutional investors.",
    action: "Highlight your LTV potential and NRR path in your pitch deck. Build a 3-year ARR forecast model showing expansion revenue from upsells and seat additions.",
    aiInsight: "The next step is to define your tier architecture: Starter (self-serve), Growth (team), Enterprise (custom). This tier map creates a natural upsell flywheel that improves NRR over time.",
    checklist: [
      "Define your 3-tier pricing architecture (Starter / Growth / Enterprise)",
      "Calculate your target LTV:CAC ratio (aim for >3:1)",
      "Build a NRR projection showing expansion revenue path",
      "Include MRR growth chart in investor materials",
    ],
    lesson: "Pricing Power and Gross Margins"
  },
  {
    id: "live_mvp",
    severity: "good",
    title: "Live Product with Prototype Evidence",
    source: "Module 1.1.4 - Product",
    sourceHref: "/dashboard/audit/4-product",
    description: "Having a functioning MVP sets you ahead of 70% of pre-seed applicants. Execution capability signals to investors that you ship — the most underrated founder quality.",
    whyItMatters: "Ideas are worthless without execution. A live product, even with zero revenue, proves your team can build. This is worth 20-30 additional points on your Fundability Score.",
    action: "Ensure your analytics are tracking user retention correctly. Instrument your product with Mixpanel, Amplitude, or PostHog before your next investor meeting so you can show behavioral data.",
    aiInsight: "Investors are moving from 'show me the product' to 'show me the usage data'. Retention cohort charts are now as important as the demo itself at pre-seed and seed rounds.",
    checklist: [
      "Install Mixpanel, Amplitude, or PostHog for event tracking",
      "Create a day-1, day-7, day-30 retention cohort report",
      "Record a 2-minute product demo video for your pitch deck",
      "Get 3 customer testimonials or case studies on record",
    ],
    lesson: "Show, Don't Tell: The MVP Demo"
  },
];

function GapCard({ gap, index }: { gap: typeof allGaps[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);

  const toggleCheck = (item: string) => {
    setChecked(prev => prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]);
  };

  const borderColor = gap.severity === "critical" ? "border-red-500" : gap.severity === "warning" ? "border-yellow-500" : "border-green-500";
  const badgeBg = gap.severity === "critical" ? "bg-red-100 text-red-800" : gap.severity === "warning" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800";
  const headerBg = gap.severity === "critical" ? "bg-red-50" : gap.severity === "warning" ? "bg-yellow-50" : "bg-green-50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`bg-white border border-[#1e4a62]/10 border-l-4 ${borderColor} rounded-sm shadow-sm overflow-hidden`}
    >
      {/* Card Header */}
      <div
        className={`p-5 cursor-pointer flex items-start justify-between gap-4 ${headerBg}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${badgeBg}`}>
              {gap.severity === "critical" ? "Critical Gap" : gap.severity === "warning" ? "Improvement Needed" : "Strength"}
            </span>
            <Link href={gap.sourceHref} className="text-[9px] font-bold uppercase tracking-widest text-[#1e4a62] hover:text-[#022f42] flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-sm border border-[#1e4a62]/10">
              <Link2 className="w-2.5 h-2.5" /> {gap.source}
            </Link>
          </div>
          <h3 className="text-base font-bold text-[#022f42] leading-tight">{gap.title}</h3>
          <p className="text-sm text-[#1e4a62] mt-1 leading-relaxed">{gap.description}</p>
        </div>
        <button className="shrink-0 text-[#1e4a62] mt-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-5 border-t border-[#1e4a62]/10">

              {/* Why it Matters */}
              <div className="bg-[#f2f6fa] p-4 rounded-sm border-l-4 border-[#1e4a62]/20">
                <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-2 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Why This Matters to Investors
                </div>
                <p className="text-xs text-[#1e4a62] leading-relaxed">{gap.whyItMatters}</p>
              </div>

              {/* AI Insight */}
              <div className="bg-[#022f42] p-4 rounded-sm border-l-4 border-[#ffd800]">
                <div className="text-[9px] font-black uppercase tracking-widest text-[#ffd800] mb-2 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1.5" /> AI Assisted — Personalised Recommendation
                </div>
                <p className="text-xs text-[#b0d0e0] leading-relaxed">{gap.aiInsight}</p>
              </div>

              {/* Recommended Action */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-2">Recommended Action</div>
                <p className="text-sm text-[#1e4a62] leading-relaxed border-l-4 border-[#ffd800] pl-3">{gap.action}</p>
              </div>

              {/* Closure Checklist */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-3 flex items-center">
                  <ListChecks className="w-3.5 h-3.5 mr-1.5 text-[#ffd800]" /> Gap Closure Checklist
                </div>
                <div className="space-y-2">
                  {gap.checklist.map((item, i) => (
                    <label key={i} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checked.includes(item)}
                        onChange={() => toggleCheck(item)}
                        className="mt-0.5 w-4 h-4 accent-[#022f42] shrink-0"
                      />
                      <span className={`text-xs leading-relaxed transition-colors ${checked.includes(item) ? "line-through text-[#1e4a62]/50" : "text-[#1e4a62] group-hover:text-[#022f42]"}`}>{item}</span>
                    </label>
                  ))}
                </div>
                {checked.length === gap.checklist.length && (
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-2 rounded-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> All actions completed — re-run your audit to update your score!
                  </div>
                )}
              </div>

              {/* Related Lesson */}
              <div className="flex items-center text-xs text-[#1e4a62] font-medium border-t border-[#1e4a62]/10 pt-4">
                <BookOpen className="w-4 h-4 mr-2 text-[#ffd800] shrink-0" />
                <span className="font-bold mr-2 text-[#022f42]">Related Lesson:</span> {gap.lesson}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AllGapsPage() {
  const critical = allGaps.filter(g => g.severity === "critical");
  const warnings = allGaps.filter(g => g.severity === "warning");
  const strengths = allGaps.filter(g => g.severity === "good");
  const totalActions = allGaps.reduce((s, g) => s + g.checklist.length, 0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('audit_1_3_all', 'completed');
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-3 text-[10px] uppercase tracking-widest">
          Module 1.3
        </div>
        <h1 className="text-3xl font-black text-[#022f42] mb-2 tracking-tight flex items-center flex-wrap gap-2">
          Full Gap Analysis List
          <AiBadge />
        </h1>
        <p className="text-[#1e4a62] text-sm leading-relaxed max-w-2xl">
          Comprehensive inventory of all identified funding gaps, improvements, and strengths based on your 360° Audit footprint.
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 border border-red-200 border-t-4 border-t-red-500 p-4 rounded-sm shadow-sm text-center">
          <div className="text-3xl font-black text-red-600">{critical.length}</div>
          <div className="text-[9px] uppercase tracking-widest font-bold text-red-700 mt-1">Critical Gaps</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 border-t-4 border-t-yellow-500 p-4 rounded-sm shadow-sm text-center">
          <div className="text-3xl font-black text-yellow-700">{warnings.length}</div>
          <div className="text-[9px] uppercase tracking-widest font-bold text-yellow-700 mt-1">Improvements</div>
        </div>
        <div className="bg-green-50 border border-green-200 border-t-4 border-t-green-500 p-4 rounded-sm shadow-sm text-center">
          <div className="text-3xl font-black text-green-600">{strengths.length}</div>
          <div className="text-[9px] uppercase tracking-widest font-bold text-green-700 mt-1">Strengths</div>
        </div>
      </div>

      {/* Critical Gaps */}
      {critical.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-red-600 mb-3 flex items-center">
            <XCircle className="w-4 h-4 mr-2" /> Critical Gaps — Address These First
          </h2>
          <div className="space-y-3">
            {critical.map((gap, i) => <GapCard key={gap.id} gap={gap} index={i} />)}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-yellow-700 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" /> Areas Needing Improvement
          </h2>
          <div className="space-y-3">
            {warnings.map((gap, i) => <GapCard key={gap.id} gap={gap} index={i} />)}
          </div>
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-green-700 mb-3 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Your Fundability Strengths
          </h2>
          <div className="space-y-3">
            {strengths.map((gap, i) => <GapCard key={gap.id} gap={gap} index={i} />)}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/gap-report" className="inline-flex items-center px-8 py-4 bg-[#022f42] text-white font-bold uppercase tracking-widest text-sm border-2 border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] transition-all">
          Back to Hub <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
