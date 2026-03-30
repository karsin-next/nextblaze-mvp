/**
 * FundabilityOS UAT Data Injection Utility
 * Usage: Copy-paste to browser console and call loadScenario(1|2|3)
 */

window.loadScenario = (id) => {
  const scenarios = {
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
  if (!scenario) return console.error("Invalid Scenario ID");

  console.log(`Loading Scenario ${id}: ${scenario.name}...`);
  
  // Clear related keys
  localStorage.clear(); // Safe for testing in this context

  // Inject scenario data
  Object.keys(scenario).forEach(key => {
    if (key === 'name' || key === 'stage') return;
    localStorage.setItem(key, JSON.stringify(scenario[key]));
  });

  // Special handling for startup_profile to sync with Stage
  localStorage.setItem('startup_profile', JSON.stringify({
    name: scenario.name,
    stage: scenario.stage,
    industry: "Tech"
  }));

  console.log("Scenario Loaded. Reloading page...");
  window.location.reload();
};
