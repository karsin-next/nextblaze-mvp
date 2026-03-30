"use client";

import { AlertTriangle, Play, RefreshCw, Smartphone, TrendingUp, Zap } from "lucide-react";

export default function UATDemoPage() {
  const loadScenario = (id: number) => {
    const scenarios: any = {
      1: {
        name: "PayFlow",
        stage: "Seed",
        industry: "FinTech",
        audit_1_1_1: { data: { problem: "SMEs struggle to predict cash flow accurately, leading to unexpected shortfalls.", severity: 8, frequency: 7, solutions: "Manual spreadsheets", alternatives: 7 }, status: "completed" },
        audit_1_1_2: { data: { segment: "CFOs of SMEs (10-50 employees) in E-commerce/Retail", channel: "LinkedIn, Accounting APIs (Xero/QuickBooks)", trigger: "Post-cash crunch or funding prep" }, status: "completed" },
        audit_1_1_3: { data: { strengths: "AI predictions, Real-time bank integration, Simple UX", weaknesses: "No brand recognition, Small team, Limited integrations", opportunities: "Growing SME digitisation, Open banking APIs", threats: "Large accounting software adding forecasting features" }, status: "completed" },
        audit_1_1_4: { data: { stage: "Beta", features: "Predictive AI trained on anonymised transactional data", gaps: "Bank API integration, Mobile app" }, status: "completed" },
        audit_1_1_5: { data: { tam: 2000000000, sam: 200000000, som: 10000000, growth: 15 }, status: "completed" },
        audit_1_1_6: { data: { pay2x: 60, pmf: "early-stage" }, status: "completed" },
        audit_1_1_7: { data: { model: "Subscription", pricing: 199, margin: 80 }, status: "completed" },
        audit_1_1_8: { data: { team: "CEO (founder), CTO (AI), Sales (None)" }, status: "completed" },
        financial_snapshot_v2: { metrics: { mrr: 0, burn: 25000, cash: 300000, cac: 0, ltv: 0 } },
        audit_2_4: { data: { what: "$1.2M seed", why: "$500k ARR in 24mo", who: "Seed VCs" }, status: "completed" }
      },
      2: {
        name: "SkillBridge",
        stage: "Series A",
        industry: "EdTech",
        audit_1_1_1: { data: { problem: "Students and professionals lack access to affordable, high-quality, personalised career training.", severity: 9, frequency: 8, solutions: "Universities, Free online courses", alternatives: 5 }, status: "completed" },
        audit_1_1_2: { data: { segment: "College students (18-25), professionals (30-45)", channel: "Social Ads, Campus ambassadors, Organic search", trigger: "Job change, promotion, or layoff" }, status: "completed" },
        audit_1_1_3: { data: { strengths: "Curated vetted tutors, Flexible scheduling, Career outcome guarantee", weaknesses: "Limited geographic coverage, Low brand awareness", opportunities: "Remote work boom, Corporate upskilling budgets", threats: "Large MOOCs (Coursera, Udemy)" }, status: "completed" },
        audit_1_1_4: { data: { stage: "Growth", features: "AI matching algorithm, Integrated video, Progress tracking", gaps: "Mobile app stability, Offline mode" }, status: "completed" },
        audit_1_1_5: { data: { tam: 10000000000, sam: 2000000000, som: 50000000, growth: 20 }, status: "completed" },
        audit_1_1_6: { data: { pay2x: 70, pmf: "strong" }, status: "completed" },
        audit_1_1_7: { data: { model: "Marketplace Command", pricing: 50, margin: 75 }, status: "completed" },
        audit_1_1_8: { data: { team: "CEO (ex-Udemy), CTO (ex-Lyft), VP Marketing (ex-Duolingo), Head of Sales (new hire)" }, status: "completed" },
        financial_snapshot_v2: { metrics: { mrr: 170000, burn: 150000, cash: 2000000, cac: 50, ltv: 450 } },
        audit_2_4: { data: { what: "$6M Series A", why: "$8M ARR in 24mo", who: "Series A VCs" }, status: "completed" }
      },
      3: {
        name: "SensoriX",
        stage: "Series D",
        industry: "Industrial IoT",
        audit_1_1_1: { data: { problem: "Manufacturers lose $50B annually due to unplanned downtime. Existing sensors are expensive and complex.", severity: 10, frequency: 10, solutions: "Legacy sensors, manual inspections", alternatives: 8 }, status: "completed" },
        audit_1_1_2: { data: { segment: "Plant managers, maintenance directors in Automotive, Aerospace, and Heavy Machinery", channel: "Direct sales force, machinery OEM partnerships", trigger: "Major downtime event or corporate efficiency goals" }, status: "completed" },
        audit_1_1_3: { data: { strengths: "Proprietary sensor hardware, Patented AI algorithms, Global support network", weaknesses: "High upfront cost for customers, Long sales cycles", opportunities: "Industry 4.0 push, Government incentives", threats: "Large automation vendors, Commoditisation" }, status: "completed" },
        audit_1_1_4: { data: { stage: "Scale", features: "Self-powered sensors, predictive AI with 95% accuracy, cloud and on-prem options", gaps: "Reduce hardware unit cost" }, status: "completed" },
        audit_1_1_5: { data: { tam: 20000000000, sam: 5000000000, som: 200000000, growth: 12 }, status: "completed" },
        audit_1_1_6: { data: { pay2x: 80, pmf: "dominant" }, status: "completed" },
        audit_1_1_7: { data: { model: "Hardware + SaaS Subscription", pricing: 25000, margin: 60 }, status: "completed" },
        audit_1_1_8: { data: { team: "CEO (ex-Siemens), CTO (PhD AI), CFO (ex-IPO), VP Sales (ex-GE)" }, status: "completed" },
        financial_snapshot_v2: { metrics: { mrr: 4200000, burn: 3500000, cash: 80000000, cac: 25000, ltv: 300000 } },
        audit_2_4: { data: { what: "$50M for R&D and expansion", why: "Market leadership / IPO", who: "Growth equity / Pre-IPO specialists" }, status: "completed" }
      }
    };

    const scenario = scenarios[id];
    if (!scenario) return;

    localStorage.clear();
    Object.keys(scenario).forEach(key => {
      if (['name', 'stage', 'industry'].includes(key)) return;
      localStorage.setItem(key, JSON.stringify(scenario[key]));
    });

    localStorage.setItem('startup_profile', JSON.stringify({
      name: scenario.name,
      stage: scenario.stage,
      industry: scenario.industry
    }));

    window.location.href = "/dashboard/score/overview";
  };

  return (
    <div className="p-12 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-[#022f42] mb-4">UAT Diagnostic Demo Mode</h1>
        <p className="text-gray-500 font-medium">Inject standardized test scenarios to validate the scoring engine and AI insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Scenario 1 */}
        <div className="bg-white p-8 shadow-xl border-t-4 border-[#ffd800] rounded-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#ffd800]/10 rounded-full flex items-center justify-center mb-6">
             <Zap className="w-8 h-8 text-[#ffd800]" />
          </div>
          <h2 className="text-xl font-black mb-2 text-[#022f42]">Scenario 1</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">PayFlow (Seed Stage)</p>
          <button 
            onClick={() => loadScenario(1)}
            className="w-full py-4 bg-[#022f42] text-white font-black uppercase tracking-widest text-xs hover:bg-[#ffd800] hover:text-[#022f42] transition-colors rounded-sm flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" /> Load Scenario
          </button>
        </div>

        {/* Scenario 2 */}
        <div className="bg-white p-8 shadow-xl border-t-4 border-emerald-500 rounded-sm flex flex-col items-center text-center text-emerald-500">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
             <TrendingUp className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black mb-2 text-[#022f42]">Scenario 2</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">SkillBridge (Series A)</p>
          <button 
            onClick={() => loadScenario(2)}
            className="w-full py-4 bg-[#022f42] text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-colors rounded-sm flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" /> Load Scenario
          </button>
        </div>

        {/* Scenario 3 */}
        <div className="bg-white p-8 shadow-xl border-t-4 border-purple-600 rounded-sm flex flex-col items-center text-center text-purple-600">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-6">
             <Smartphone className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black mb-2 text-[#022f42]">Scenario 3</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">SensoriX (Series D)</p>
          <button 
            onClick={() => loadScenario(3)}
            className="w-full py-4 bg-[#022f42] text-white font-black uppercase tracking-widest text-xs hover:bg-purple-600 transition-colors rounded-sm flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" /> Load Scenario
          </button>
        </div>
      </div>

      <div className="mt-12 bg-rose-50 border border-rose-100 p-6 rounded-sm flex gap-4">
        <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
        <div>
          <h4 className="font-bold text-rose-700 mb-1 uppercase tracking-widest text-xs">Warning: Data Reset</h4>
          <p className="text-xs text-rose-600">Loading a scenario will **DELETE** all existing local data to ensure a clean state for validation. Use with caution on production-bound testing.</p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-600 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Reset Local Vault (Clear All)
        </button>
      </div>
    </div>
  );
}
