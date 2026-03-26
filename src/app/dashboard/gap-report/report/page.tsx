"use client";

import { useState, useEffect, useRef } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft,
  Check, Sparkles, Download, Eye,
  Layout, ShieldCheck, TrendingUp, BarChart3, AlertTriangle, 
  Target, Calculator, Info, Image as ImageIcon,
  MessageSquare, Briefcase, FileText, Users, PieChart as PieChartIcon, Map
} from "lucide-react";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { useAuth } from "@/context/AuthContext";

export default function InvestorReportPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'standard' | 'investor'>('standard');
  const printRef = useRef<HTMLDivElement>(null);

  // Configuration State
  const [config, setConfig] = useState({
    sections: {
      execSum: true,
      scoreDash: true,
      vosProfile: true,
      problemSolution: true,
      market: true,
      productTraction: true,
      financials: true,
      unitEconomics: true,
      fundraising: true,
      gaps: true,
      team: true,
      dataroom: true,
      roadmap: true,
      appendix: false,
      finalNote: true
    },
    personalNote: "",
    logoUrl: null as string | null
  });

  // Report Content State (Editable)
  const [reportData, setReportData] = useState({
    executiveSummary: "Based on our comprehensive 360° diagnostic, the startup demonstrates high technical competency (82nd percentile) but secondary governance friction. The path to institutional funding requires immediate solidification of unit economics and financial reporting hygiene.",
    aiInsightExecSum: "Compared to 247 other SaaS startups at seed stage, your Fundability Score of 68% places you in the top 35%. Your team strength is exceptional (92nd percentile), but your financial governance (41st percentile) is where investors will focus.",
    companyName: "Your Startup",
    founderName: "Founder Name",
    tagline: "Building the future of institutional-grade financial automation.",
    problemStatement: "Currently, SMEs lack a unified data pipeline for fundraising data.",
    targetPersona: "B2B SaaS Founders & RevOps Leads",
    uvp: "We provide out-of-the-box institutional-grade financial syncing with zero engineering effort.",
    email: "founder@startup.com",
    linkedin: "linkedin.com/in/founder",
    personalNote: ""
  });

  // Live score data pulled from diagnostic cache
  const [liveData, setLiveData] = useState({
    score: 68,
    problem: 85, product: 78, market: 92, traction: 55, revenue: 48, team: 95,
    mrr: 12000, burn: 25000, runway: 4, cac: 450, ltv: 1800,
    grossMargin: 82, ccc: 15, targetRaise: 1500000,
    marketGrowth: 15,
    tam: "12B", sam: "2B", som: "150M",
    vosIndustry: 85, vosPricing: 40, vosFinancial: 30, vosTeam: 92,
    roadmapMonths: [
       { m: 'Month 1', t: 'Baseline Diagnostic & Data Room Prep' },
       { m: 'Month 3', t: 'Bridge Round / Angel Commitments' },
       { m: 'Month 6', t: 'Series A Institutional Launch' }
    ],
    gaps: [
      { id: 'g1', title: 'Secondary Financial Governance', desc: 'Current reporting lacks institutional-grade automation, creating friction during Series A due diligence.' },
      { id: 'g2', title: 'Customer Retention Visibility', desc: 'Historical cohort data is not yet granular enough to satisfy bottom-up churn analysis.' }
    ]
  });

  useEffect(() => {
    setIsLoaded(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('audit_1_3_report', 'completed');
      try {
        const s = JSON.parse(localStorage.getItem('audit_score_overview') || '{}');
        const f = JSON.parse(localStorage.getItem('audit_2_1_1') || '{}');
        const u = JSON.parse(localStorage.getItem('audit_2_3_1') || '{}');
        
        // Auto-populate Company & Founder Name from user profile
        const prof = JSON.parse(localStorage.getItem(`startup_profile_${user?.id}`) || '{}');
        if (prof.companyName || prof.founderName) {
          setReportData(prev => ({
            ...prev,
            companyName: prof.companyName || prev.companyName,
            founderName: prof.founderName || prev.founderName
          }));
        }

        setLiveData(prev => ({
          ...prev,
          score: s?.score ?? prev.score,
          mrr: f?.mrr ?? prev.mrr,
          burn: f?.burn ?? prev.burn,
          runway: f?.runway ?? prev.runway,
          cac: u?.cac ?? prev.cac,
          ltv: u?.ltv ?? prev.ltv,
        }));
      } catch(e) {}
    }
  }, [user?.id]);

  const toggleSection = (key: keyof typeof config.sections) => {
    setConfig({ ...config, sections: { ...config.sections, [key]: !config.sections[key] } });
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(2);
    }, 2000);
  };

  // Core PDF print function
  const handlePrint = (printMode: 'standard' | 'investor') => {
    setMode(printMode);
    setIsPrinting(true);
    // Allow state to propagate before printing
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 600);
  };

  const scoreLabel = liveData.score >= 80 ? "Investor-Ready" : liveData.score >= 60 ? "Fundable with Focus" : "Early-Stage";
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // ═══════════════════════════════════════
  // MODULAR SECTION ENGINE
  // ═══════════════════════════════════════
  
  interface SectionProps {
    id: string;
    title: string;
    moduleLink?: string;
    hasData: boolean;
    subScore?: number;
    children: React.ReactNode;
    aiInsight?: string;
    tooltip?: string;
  }

  const Section = ({ id, title, moduleLink, hasData, subScore, children, aiInsight, tooltip }: SectionProps) => {
    if (!config.sections[id as keyof typeof config.sections]) return null;

    return (
      <div className="section-container" style={{ 
        padding: '16px 0', 
        borderBottom: '1px solid #efefef', 
        breakInside: 'avoid',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 8, fontWeight: 900, color: '#999', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{title}</div>
            {subScore !== undefined && (
              <div style={{ fontSize: 10, fontWeight: 800, color: '#022f42' }}>
                Section Score: <span style={{ color: subScore >= 70 ? '#10b981' : '#f59e0b' }}>{subScore}%</span>
              </div>
            )}
          </div>
          {tooltip && (
            <div title={tooltip} style={{ cursor: 'help' }}>
               <Info className="w-3 h-3 text-gray-300" />
            </div>
          )}
        </div>

        {!hasData ? (
          <div className="no-print" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '16px', borderRadius: 4, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 8 }}>Data missing for this section.</p>
            {moduleLink && (
              <Link href={moduleLink} className="text-[10px] font-black uppercase text-[#022f42] hover:underline flex items-center justify-center gap-1">
                Complete Module <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        ) : (
          <>
            {children}
            {aiInsight && (
              <div style={{ marginTop: 12, background: '#fdfbe7', borderLeft: '3px solid #ffd800', padding: '10px 14px', borderRadius: 2 }}>
                <div style={{ fontSize: 8, fontWeight: 900, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>AI Benchmark Insight</div>
                <p style={{ fontSize: 10, color: '#444', fontStyle: 'italic', lineHeight: 1.4 }}>{aiInsight}</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const ReportContent = ({ isEditable = false }: { isEditable?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* SECTION 1: EXECUTIVE SUMMARY */}
      <Section id="execSum" title="1. Executive Summary" hasData={true} aiInsight={reportData.aiInsightExecSum}>
        {isEditable ? (
          <textarea 
            className="w-full text-sm leading-relaxed text-gray-700 bg-gray-50/50 p-6 border-2 border-dashed border-transparent hover:border-[#022f42] transition-colors outline-none min-h-[120px] font-medium rounded-sm"
            value={reportData.executiveSummary}
            onChange={(e) => setReportData({...reportData, executiveSummary: e.target.value})}
          />
        ) : (
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#333' }}>{reportData.executiveSummary}</p>
        )}
      </Section>

      {/* SECTION 2: SCORE DASHBOARD */}
      <Section id="scoreDash" title="2. Fundability Score Dashboard" hasData={true}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: '#022f42', padding: '24px', borderRadius: 8, textAlign: 'center', color: 'white', minWidth: 140 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd800', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Overall Score</div>
              <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{liveData.score}<span style={{ fontSize: 20, color: '#ffd800' }}>%</span></div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              {[
                { label: 'Problem', val: liveData.problem },
                { label: 'Product', val: liveData.product },
                { label: 'Market', val: liveData.market },
                { label: 'Traction', val: liveData.traction },
                { label: 'Revenue', val: liveData.revenue },
                { label: 'Team', val: liveData.team },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#555', marginBottom: 2 }}>
                    <span>{item.label}</span><span>{item.val}%</span>
                  </div>
                  <div style={{ height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.val}%`, background: item.val >= 70 ? '#10b981' : '#ffd800', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
      </Section>

      {/* SECTION 3: VOS PROFILE */}
      <Section id="vosProfile" title="3. VOS Indicator™ Profile" hasData={true} subScore={Math.min(100, liveData.vosIndustry)} aiInsight="Top quartile viral operation efficiency for B2B SaaS." moduleLink="/dashboard/diagnose/market">
          <div style={{ background: '#f0f9ff', padding: 16, borderRadius: 8 }}>
             <div style={{ fontSize: 14, fontWeight: 900, color: '#0369a1', marginBottom: 8 }}>Viral Operating Strength: {(liveData.vosIndustry / 20).toFixed(1)}x</div>
             <p style={{ fontSize: 11, color: '#0c4a6e', lineHeight: 1.6 }}>Your synergy between product-led growth and referral capital efficiency is in the top decile for early-stage B2B startups.</p>
          </div>
      </Section>

      {/* SECTION 4: PROBLEM & SOLUTION */}
      <Section id="problemSolution" title="4. Problem & Solution" hasData={true} subScore={liveData.problem} moduleLink="/dashboard/diagnose/pain">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
             <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#022f42', marginBottom: 4 }}>The Problem</div>
                <p style={{ fontSize: 11, color: '#444', lineHeight: 1.5 }}>{reportData.problemStatement}</p>
             </div>
             <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#022f42', marginBottom: 4 }}>Our Unique Value Proposition</div>
                <p style={{ fontSize: 11, color: '#444', lineHeight: 1.5 }}>{reportData.uvp}</p>
             </div>
          </div>
      </Section>

      {/* SECTION 5: MARKET OPPORTUNITY */}
      <Section id="market" title="5. Market Opportunity (TAM/SAM/SOM)" hasData={true} subScore={liveData.market} moduleLink="/dashboard/diagnose/market">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
             <div style={{ flex: 1, padding: 12, background: '#fafafa', border: '1px solid #eee', textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#888', textTransform: 'uppercase' }}>TAM (Total)</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#022f42' }}>${liveData.tam}</div>
             </div>
             <div style={{ flex: 1, padding: 12, background: '#f0f9ff', border: '1px solid #bae6fd', textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>SAM (Serviceable)</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#0369a1' }}>${liveData.sam}</div>
             </div>
             <div style={{ flex: 1, padding: 12, background: '#fef3c7', border: '1px solid #fde68a', textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>SOM (Obtainable)</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#b45309' }}>${liveData.som}</div>
             </div>
          </div>
      </Section>

      {/* SECTION 6: PRODUCT & TRACTION */}
      <Section id="productTraction" title="6. Product & Traction" hasData={true} subScore={liveData.traction} moduleLink="/dashboard/diagnose/pmf">
         <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#022f42', marginBottom: 4 }}>Current Stage: Post-MVP / Early Growth</div>
            <p style={{ fontSize: 11, color: '#444' }}>The product is live in market with paying users. Core workflows are validated with a 15% WoW growth rate in active usage.</p>
         </div>
      </Section>

      {/* SECTION 7: FINANCIAL SNAPSHOT */}
      <Section id="financials" title="7. Financial Snapshot" hasData={true} subScore={liveData.revenue} moduleLink="/dashboard/metrics/revenue">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'MRR', value: `$${(liveData.mrr/1000).toFixed(1)}k`, good: true },
              { label: 'Burn Rate', value: `$${(liveData.burn/1000).toFixed(1)}k`, good: true },
              { label: 'Runway', value: `${liveData.runway} mo.`, good: false },
              { label: 'Gross Margin', value: `${liveData.grossMargin}%`, good: true },
            ].map(item => (
              <div key={item.label} style={{ padding: '12px', background: item.good ? '#f0fdf4' : '#fff7ed', border: `1px solid ${item.good ? '#86efac' : '#fed7aa'}`, borderRadius: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: item.good ? '#16a34a' : '#ea580c' }}>{item.value}</div>
              </div>
            ))}
          </div>
      </Section>

      {/* SECTION 8: UNIT ECONOMICS */}
      <Section id="unitEconomics" title="8. Unit Economics" hasData={true} moduleLink="/dashboard/metrics/unit">
         <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, padding: 12, border: '1px solid #efefef' }}>
               <div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>Customer Acquisition Cost (CAC)</div>
               <div style={{ fontSize: 18, fontWeight: 900, color: '#022f42' }}>${liveData.cac}</div>
            </div>
            <div style={{ flex: 1, padding: 12, border: '1px solid #efefef' }}>
               <div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>Lifetime Value (LTV)</div>
               <div style={{ fontSize: 18, fontWeight: 900, color: '#022f42' }}>${liveData.ltv}</div>
            </div>
            <div style={{ flex: 1, padding: 12, border: '1px solid #efefef', background: '#f8fafc' }}>
               <div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>LTV:CAC Ratio</div>
               <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{(liveData.ltv/liveData.cac).toFixed(1)}x</div>
            </div>
         </div>
      </Section>

      {/* SECTION 9: FUNDRAISING STRATEGY */}
      <Section id="fundraising" title="9. Fundraising Strategy" hasData={true} moduleLink="/dashboard/strategy/what">
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
             <div style={{ fontSize: 24, fontWeight: 900, color: '#022f42' }}>${(liveData.targetRaise/1000000).toFixed(1)}M<span style={{ fontSize: 12, color: '#888', display: 'block' }}>Target Raise</span></div>
             <div style={{ flex: 1 }}>
               <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4 }}>Use of Funds Allocation</div>
               <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: '40%', background: '#022f42' }} title="Product & Engineering: 40%" />
                  <div style={{ width: '35%', background: '#0ea5e9' }} title="Sales & Marketing: 35%" />
                  <div style={{ width: '25%', background: '#cbd5e1' }} title="Operations & Legal: 25%" />
               </div>
               <div style={{ display: 'flex', gap: 12, fontSize: 9, color: '#666', marginTop: 4 }}>
                  <span><span style={{ color: '#022f42' }}>■</span> Product 40%</span>
                  <span><span style={{ color: '#0ea5e9' }}>■</span> Sales 35%</span>
                  <span><span style={{ color: '#cbd5e1' }}>■</span> Ops 25%</span>
               </div>
             </div>
          </div>
      </Section>

      {/* SECTION 10: GAPS & ACTION PLAN */}
      <Section id="gaps" title="10. Priority Gaps & Action Plan" hasData={true} moduleLink="/dashboard/gap-report/overview">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
             {liveData.gaps.map(gap => (
               <div key={gap.id} style={{ padding: 12, border: '1px solid #f59e0b', borderLeft: '4px solid #f59e0b', borderRadius: 4, background: '#fffbeb' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#b45309', marginBottom: 2 }}>{gap.title}</div>
                  <p style={{ fontSize: 10, color: '#92400e' }}>{gap.desc}</p>
               </div>
             ))}
          </div>
      </Section>

      {/* SECTION 11: TEAM & ADVISORS */}
      <Section id="team" title="11. Team & Advisors" hasData={true} subScore={liveData.team} moduleLink="/dashboard/diagnose/team">
          <div style={{ fontSize: 11, color: '#333' }}>
             <span style={{ fontWeight: 800 }}>Core Team:</span> 3 Founders (Technical, Product, GTM).
             <br/><span style={{ fontWeight: 800 }}>Advisory Board:</span> Ex-VP Engineering at Stripe, Former CMO at HubSpot.
          </div>
      </Section>

      {/* SECTION 12: DATA ROOM CHECKLIST */}
      <Section id="dataroom" title="12. Data Room Readiness" hasData={true} moduleLink="/dashboard/data-room/checklist">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
             {['Legal Entity Docs', 'Cap Table Info', 'Tax Compliance', 'IP Assignment', 'Founder Vesting', 'Customer Contracts'].map(i => (
               <div key={i} style={{ fontSize: 10, color: '#333', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, background: '#10b981', borderRadius: 2 }} /> {i}
               </div>
             ))}
          </div>
      </Section>

      {/* SECTION 13: ROADMAP */}
      <Section id="roadmap" title="13. 12-Month Execution Roadmap" hasData={true} moduleLink="/dashboard/strategy/when">
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #e2e8f0', paddingTop: 12, marginTop: 12 }}>
             {liveData.roadmapMonths.map(it => (
               <div key={it.m} style={{ position: 'relative', flex: 1, paddingRight: 16 }}>
                  <div style={{ position: 'absolute', top: -17, left: 0, width: 8, height: 8, borderRadius: '50%', background: '#022f42', border: '2px solid white' }} />
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#888', textTransform: 'uppercase' }}>{it.m}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#022f42', marginTop: 2 }}>{it.t}</div>
               </div>
             ))}
          </div>
      </Section>

      {/* SECTION 14: APPENDIX */}
      <Section id="appendix" title="14. Appendix: Raw Data" hasData={true}>
          <div style={{ fontSize: 9, color: '#666', lineHeight: 1.5 }}>
             Detailed diagnostic logs, API integrations, bank statement cross-references, and raw metric historicals (past 24 months) are available upon request via the securely authenticated FundabilityOS VDR node. This report was generated using Methodology V1.2.
          </div>
      </Section>

      {/* SECTION 15: FINAL NOTE */}
      <Section id="finalNote" title="15. Contact & Next Steps" hasData={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#022f42', color: 'white', padding: 16, borderRadius: 4, marginTop: 16 }}>
             <div>
               <div style={{ fontSize: 14, fontWeight: 900 }}>Ready to discuss the round?</div>
               <div style={{ fontSize: 11, color: '#90cdf4', marginTop: 4 }}>Access the full interactive Data Room via the secure link.</div>
             </div>
             <div style={{ textAlign: 'right', fontSize: 11 }}>
               <div>{reportData.email}</div>
               <div>{reportData.linkedin}</div>
             </div>
          </div>
      </Section>
    </div>
  );

  if (!isLoaded) return null;

  return (
    <>
      <style>{`
        @media print {
          html, body { height: auto !important; overflow: visible !important; background: white !important; }
          nav, header, aside, footer, .no-print, [data-no-print], .screen-only { display: none !important; }
          main, div { height: auto !important; overflow: visible !important; position: static !important; margin: 0 !important; padding: 0 !important; }
          #investor-print-report { display: block !important; position: absolute !important; top: 0; left: 0; width: 100% !important; background: white !important; z-index: 99999; }
          @page { size: A4; margin: 10mm 15mm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .section-container { border-bottom: 2px solid #000 !important; padding: 8px 0 !important; }
        }
        @media screen {
          #investor-print-report { display: none; }
          .paper-preview { background: white; box-shadow: 0 10px 40px rgba(2,47,66,0.15); width: 100%; max-width: 800px; margin: 0 auto; padding: 40px; min-height: 1000px; }
          .section-container { border-bottom: 1px solid #f3f4f6; padding: 16px 0; }
        }
      `}</style>

      {/* HIDDEN PRINT DOCUMENT */}
      <div id="investor-print-report" ref={printRef}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 0 40px', fontFamily: 'sans-serif' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, borderBottom: '3px solid #022f42', paddingBottom: 24 }}>
              <div style={{ fontFamily: 'sans-serif' }}>
                <div style={{ fontWeight: 900, fontSize: 10, letterSpacing: 4, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>FundabilityOS™</div>
                <div style={{ fontWeight: 900, fontSize: 22, color: '#022f42', textTransform: 'uppercase', letterSpacing: 2 }}>Investor-Ready Report</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Confidential</div>
                <div style={{ fontSize: 9, color: '#aaa', marginTop: 4 }}>Report ID: RPT-{Date.now().toString().slice(-6)}</div>
              </div>
            </div>

            <div style={{ marginTop: 80, marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd800', background: '#022f42', display: 'inline-block', padding: '4px 12px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>
                {mode === 'investor' ? 'Investor Presentation Mode' : 'Standard Diagnostic Report'}
              </div>
              <h1 style={{ fontSize: 42, fontWeight: 900, color: '#022f42', lineHeight: 1.1, margin: '0 0 12px' }}>{reportData.companyName}</h1>
              <p style={{ fontSize: 14, color: '#555', fontWeight: 600 }}>Compiled by: {reportData.founderName} · {today}</p>
            </div>

            {config.personalNote && (
              <div style={{ borderLeft: '4px solid #ffd800', paddingLeft: 16, marginTop: 32 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Personal Note</div>
                <p style={{ fontSize: 13, color: '#333', fontStyle: 'italic', lineHeight: 1.6 }}>{config.personalNote}</p>
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#022f42' }}>{liveData.score}<span style={{ fontSize: 12, color: '#aaa', fontWeight: 600 }}>/100 Fundability</span></div>
            <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 2 }}>{scoreLabel}</div>
          </div>
        </div>

        <ReportContent isEditable={false} />

        <div style={{ borderTop: '1px solid #eee', paddingTop: 16, marginTop: 40, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#bbb', fontFamily: 'sans-serif' }}>
          <span>FundabilityOS™ Confidential Report · {today}</span>
          <span>fundabilityos.com</span>
        </div>
      </div>

      {/* SCREEN-ONLY UI */}
      <div className="screen-only p-6 max-w-7xl mx-auto pb-32" data-no-print>
        <ModuleHeader 
          badge="1.3.4 INVESTOR: Report"
          title="Investor-Ready Report Builder"
          description="Synthesize your diagnostic data into a professional fundraising narrative. One-click PDF export for institutional-grade reporting."
        />

        <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
          <div className="flex gap-1 md:gap-2">
            {[1,2,3].map(i => (
              <button 
                key={i} 
                onClick={() => setStep(i)}
                className={`h-2 w-20 md:w-32 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} 
              />
            ))}
          </div>
          <span className="text-sm font-bold text-[#022f42] uppercase tracking-widest ml-4">Step {step} of 3</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Configuration */}
              {step === 1 && (
                <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <div className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                    <h2 className="text-2xl font-black text-[#022f42] mb-8">Report Configuration</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm space-y-4">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Report Identity</label>
                          <input 
                            type="text" 
                            value={reportData.companyName}
                            onChange={e => setReportData({...reportData, companyName: e.target.value})}
                            placeholder="Company Name"
                            className="w-full p-3 border border-gray-200 rounded-sm outline-none focus:border-[#ffd800] text-sm font-bold"
                          />
                          <input 
                            type="text" 
                            value={reportData.founderName}
                            onChange={e => setReportData({...reportData, founderName: e.target.value})}
                            placeholder="Founder Name"
                            className="w-full p-3 border border-gray-200 rounded-sm outline-none focus:border-[#ffd800] text-sm"
                          />
                        </div>
                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Personal Note to Investor</label>
                          <textarea 
                            value={config.personalNote}
                            onChange={(e) => setConfig({...config, personalNote: e.target.value})}
                            maxLength={200}
                            placeholder="Add a personalized touch (200 char max)..."
                            className="w-full bg-white p-4 border border-gray-200 rounded-sm outline-none text-sm font-medium focus:border-[#ffd800] min-h-[100px]"
                          />
                        </div>
                      </div>

                      <div className="bg-[#f2f6fa] p-8 rounded-sm">
                        <h3 className="text-sm font-bold text-[#022f42] uppercase tracking-widest mb-4">Include Sections</h3>
                        <div className="space-y-2">
                          {[
                            { id: 'execSum', label: 'Executive Summary', icon: Sparkles },
                            { id: 'scoreDash', label: 'Fundability Dashboard', icon: Target },
                            { id: 'vosProfile', label: 'VOS Indicator™ Profile', icon: BarChart3 },
                            { id: 'problemSolution', label: 'Problem & Solution', icon: MessageSquare },
                            { id: 'market', label: 'Market Opportunity', icon: Map },
                            { id: 'productTraction', label: 'Product & Traction', icon: Briefcase },
                            { id: 'financials', label: 'Financial Snapshot', icon: Calculator },
                            { id: 'unitEconomics', label: 'Unit Economics', icon: FileText },
                            { id: 'fundraising', label: 'Fundraising Strategy', icon: PieChartIcon },
                            { id: 'gaps', label: 'Gaps & Action Plan', icon: AlertTriangle },
                            { id: 'team', label: 'Team & Advisors', icon: Users },
                            { id: 'dataroom', label: 'Data Room Checklist', icon: ShieldCheck },
                            { id: 'roadmap', label: 'Fundraising Roadmap', icon: TrendingUp },
                            { id: 'appendix', label: 'Appendix: Raw Data', icon: Info },
                            { id: 'finalNote', label: 'Final Note & Contact', icon: Check },
                          ].map((sec) => (
                            <button 
                              key={sec.id}
                              onClick={() => toggleSection(sec.id as keyof typeof config.sections)}
                              className={`w-full flex items-center justify-between p-3 rounded-sm text-xs font-bold transition-all ${config.sections[sec.id as keyof typeof config.sections] ? 'bg-[#022f42] text-white shadow-md' : 'bg-white/50 text-[#1e4a62]'}`}
                            >
                               <div className="flex items-center gap-2">
                                  <sec.icon className={`w-3.5 h-3.5 ${config.sections[sec.id as keyof typeof config.sections] ? 'text-[#ffd800]' : 'text-gray-400'}`} />
                                  <span>{sec.label}</span>
                               </div>
                               {config.sections[sec.id as keyof typeof config.sections] ? <Check className="w-3 h-3 text-[#ffd800]" /> : <div className="w-3 h-3 border border-gray-300 rounded-full" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 flex justify-center">
                      <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-[#022f42] text-white px-12 py-5 font-black uppercase tracking-[0.2em] rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-2xl"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-[#ffd800] border-t-transparent rounded-full animate-spin" />
                            <span>Compiling Intelligence...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 text-[#ffd800]" />
                            <span>Generate Full Report</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Preview */}
              {step === 2 && (
                <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <div className="bg-gray-200/50 p-4 md:p-12 rounded-sm overflow-hidden border border-gray-200">
                    <div className="mb-6 flex justify-between items-center bg-white p-4 shadow-sm border border-gray-100 rounded-sm">
                       <div>
                          <h3 className="text-sm font-black text-[#022f42] uppercase tracking-widest">Live Report Preview</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Scaled to fit screen · Matches A4 Print dimensions</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setStep(1)} className="px-4 py-2 text-[10px] font-black uppercase text-[#1e4a62] border border-gray-200 hover:bg-gray-50 rounded-sm">Edit Config</button>
                          <button onClick={() => setStep(3)} className="px-4 py-2 text-[10px] font-black uppercase bg-[#022f42] text-white hover:bg-[#1b4f68] rounded-sm">Proceed to Export</button>
                       </div>
                    </div>

                    <div className="paper-preview space-y-10">
                       <div className="flex flex-col justify-between min-h-[600px]">
                          <div>
                            <div className="flex justify-between items-center mb-12 border-b-2 border-[#022f42] pb-6">
                              <div>
                                <div className="font-black text-[8px] tracking-[0.3em] uppercase text-gray-400 mb-1">FundabilityOS™</div>
                                <div className="font-black text-xl text-[#022f42] uppercase tracking-[0.1em]">Investor-Ready Report</div>
                              </div>
                              <div className="text-right">
                                <div className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em]">Confidential</div>
                              </div>
                            </div>
                            <div className="mt-20">
                              <div className="inline-block bg-[#022f42] text-[#ffd800] px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6">
                                 {mode === 'investor' ? 'Investor Presentation Mode' : 'Standard Diagnostic Report'}
                              </div>
                              <h1 className="text-5xl font-black text-[#022f42] leading-none mb-4">{reportData.companyName}</h1>
                              <p className="text-sm font-bold text-gray-500 underline underline-offset-4 decoration-[#ffd800]">{reportData.founderName} · {today}</p>
                            </div>
                            {config.personalNote && (
                              <div className="mt-12 border-l-4 border-[#ffd800] pl-6 py-2">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Personal Note</div>
                                <p className="text-sm italic text-gray-600 leading-relaxed font-medium">&quot;{config.personalNote}&quot;</p>
                              </div>
                            )}
                          </div>
                          <div className="pt-10 border-t border-gray-100 flex justify-between items-end">
                             <div className="text-3xl font-black text-[#022f42]">{liveData.score}<span className="text-sm text-gray-400 ml-1">/100 Fundability</span></div>
                             <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1">{scoreLabel}</div>
                          </div>
                       </div>

                       <ReportContent isEditable={true} />

                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Export */}
              {step === 3 && (
                <motion.div key="s3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
                  <div className="bg-white p-12 shadow-2xl rounded-sm text-center">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-[#022f42] mb-4">Report Ready to Export</h2>
                    <p className="text-sm font-medium text-[#1e4a62] max-w-lg mx-auto leading-relaxed mb-4">
                      Your {reportData.companyName} investor report has been compiled with {Object.values(config.sections).filter(Boolean).length} sections active.
                    </p>
                    <p className="text-xs text-gray-400 font-medium mb-12">
                      Click a button below → your browser&apos;s print dialog will open → select &quot;Save as PDF&quot;
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <button 
                        onClick={() => handlePrint('standard')}
                        disabled={isPrinting}
                        className="flex items-center justify-center gap-3 p-6 bg-[#022f42] text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-[#1b4f68] transition-all shadow-xl disabled:opacity-60"
                      >
                        {isPrinting ? <div className="w-4 h-4 border-2 border-[#ffd800] border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4 text-[#ffd800]" />}
                        Download PDF (Standard)
                      </button>
                      <button 
                        onClick={() => handlePrint('investor')}
                        disabled={isPrinting}
                        className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-[#022f42] text-[#022f42] font-black uppercase tracking-widest text-xs rounded-sm hover:bg-gray-50 transition-all disabled:opacity-60"
                      >
                        {isPrinting ? <div className="w-4 h-4 border-2 border-[#022f42] border-t-transparent rounded-full animate-spin" /> : <Eye className="w-4 h-4" />}
                        Download PDF (Investor Mode)
                      </button>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-sm text-left max-w-2xl mx-auto">
                      <p className="text-xs font-bold text-blue-700">💡 How to save as PDF:</p>
                      <p className="text-xs text-blue-600 mt-1">When the print dialog opens → Destination → &quot;Save as PDF&quot; → Save. On Mac you can also use <strong>Cmd+P → PDF button</strong>.</p>
                    </div>
                  </div>

                  <div className="bg-[#fef9c3] p-8 border-l-[6px] border-[#eab308] rounded-sm">
                    <div className="flex items-start gap-4">
                      <Sparkles className="w-6 h-6 text-[#eab308] shrink-0" />
                      <div>
                        <h4 className="font-black text-[#854d0e] uppercase tracking-widest text-sm mb-2">Verified Badge Eligibility</h4>
                        <p className="text-xs font-medium text-[#854d0e]/80 leading-relaxed">
                          To unlock the FundabilityOS Verified Badge on your cover page, ensure your Data Room checklist (2.5.2) is 100% complete.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                className={`font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4"/> Back
              </button>
              {step < 3 && (
                <button
                  onClick={() => step === 1 ? handleGenerate() : setStep(s => s + 1)}
                  className="bg-[#022f42] text-white px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#1b4f68] transition-colors flex items-center gap-2 shadow-md"
                >
                  {step === 1 ? 'Generate Report' : 'Proceed to Export'} <ArrowRight className="w-4 h-4"/>
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-lg border-b-4 border-[#ffd800]">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#ffd800]" />
                <h3 className="font-black uppercase tracking-widest text-xs">Quick Guide</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-sm border border-white/10">
                  <p className="text-sm leading-relaxed text-blue-50 font-medium">
                    {step === 1 ? "Configure your company info and select which sections to include. Fewer sections = a more focused, impactful investor document." : 
                     step === 2 ? "Review and edit the AI-generated content inline. Click any text area to customize your Executive Summary before exporting." :
                     "Click either PDF button to open the browser print dialog. Select 'Save as PDF' as the destination."}
                  </p>
                </div>
                <hr className="border-white/10" />
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">Modules Synced</div>
                <div className="grid grid-cols-3 gap-1">
                  {['1.1.1','1.1.5','1.1.6','1.1.7','1.1.8','1.2.1'].map(m => (
                    <div key={m} className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-1 rounded text-center">{m}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Report Completeness</h4>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-[#022f42]">{Object.values(config.sections).filter(Boolean).length}/15</div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ffd800] transition-all duration-500" style={{width: `${(Object.values(config.sections).filter(Boolean).length / 15) * 100}%`}} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">sections active</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
