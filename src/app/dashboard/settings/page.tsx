"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Globe, Coins, Briefcase, Target, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PrivacyConsentGate from "@/components/PrivacyConsentGate";

// Massive global standard arrays
const COUNTRIES = [
  "United States", "United Kingdom", "Singapore", "Canada", "Australia", 
  "---",
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan", 
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
  "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", 
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", 
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", 
  "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", 
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", 
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", 
  "Romania", "Russia", "Rwanda", "Saint Kitts & Nevis", "Saint Lucia", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", 
  "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const CURRENCIES = [
  { code: "USD ($)", name: "Primary: USD ($)" },
  { code: "EUR (€)", name: "Primary: EUR (€)" },
  { code: "GBP (£)", name: "Primary: GBP (£)" },
  { code: "SGD (S$)", name: "Primary: SGD (S$)" },
  { code: "JPY (¥)", name: "Primary: JPY (¥)" },
  { code: "AUD (A$)", name: "Primary: AUD (A$)" },
  { code: "CAD (C$)", name: "Primary: CAD (C$)" },
  { code: "CHF (Fr)", name: "Primary: CHF (Fr)" },
  { code: "CNY (¥)", name: "Primary: CNY (¥)" },
  { code: "HKD (HK$)", name: "Primary: HKD (HK$)" },
  { code: "NZD (NZ$)", name: "Primary: NZD (NZ$)" },
  { code: "INR (₹)", name: "Primary: INR (₹)" },
  { code: "BRL (R$)", name: "Primary: BRL (R$)" },
  { code: "ZAR (R)", name: "Primary: ZAR (R)" },
  { code: "MXN ($)", name: "Primary: MXN ($)" },
  { code: "KRW (₩)", name: "Primary: KRW (₩)" },
  { code: "SEK (kr)", name: "Primary: SEK (kr)" },
  { code: "NOK (kr)", name: "Primary: NOK (kr)" },
  { code: "DKK (kr)", name: "Primary: DKK (kr)" },
  { code: "MYR (RM)", name: "Primary: MYR (RM)" },
  { code: "THB (฿)", name: "Primary: THB (฿)" },
  { code: "IDR (Rp)", name: "Primary: IDR (Rp)" },
  { code: "PHP (₱)", name: "Primary: PHP (₱)" },
  { code: "VND (₫)", name: "Primary: VND (₫)" },
  { code: "AED (د.إ)", name: "Primary: AED (د.إ)" }
];

const SEC_CURRENCIES = [{ code: "None", name: "Secondary: None" }].concat(
  CURRENCIES.map(c => ({ code: c.code, name: c.name.replace("Primary:", "Secondary:") }))
);

export default function StartupSettingsPage() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    companyName: "",
    founderName: "",
    industry: "",
    country: "United States",
    primaryCurrency: "USD ($)",
    secondaryCurrency: "None",
    oneLiner: "",
    // Financial metrics — read by Investor Dashboard
    mrr: "",
    burnRate: "",
    initialCash: "",
    cac: "",
    ltv: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Merge registration user name if profile is empty
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`startup_profile_${user.id}`);
      if (saved) {
        try { 
           const parsed = JSON.parse(saved);
           if (!parsed.companyName && user?.company) parsed.companyName = user.company;
           if (!parsed.founderName && (user as any)?.founderName) parsed.founderName = (user as any).founderName;
           setProfile(parsed);
        } catch(e) {}
      } else {
        setProfile(p => ({...p, 
          companyName: user?.company || "",
          founderName: (user as any)?.founderName || user?.email || "" 
        }));
      }
    }
  }, [user?.id, user?.email, user?.company]); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`startup_profile_${user.id}`, JSON.stringify(profile));
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  const [sessionCleared, setSessionCleared] = useState(false);
  const clearSessionData = () => {
    if (user?.id && typeof window !== "undefined") {
      localStorage.removeItem(`startup_profile_${user.id}`);
      setProfile(p => ({ ...p, mrr: "", burnRate: "", initialCash: "", cac: "", ltv: "", strategyMilestones: [] }));
      setSessionCleared(true);
      setTimeout(() => setSessionCleared(false), 3000);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      <div className="mb-10">
         <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
           Operations
         </div>
         <h1 className="text-3xl font-bold text-[#022f42] mb-3">Company Settings</h1>
         <p className="text-[#1e4a62] text-sm leading-relaxed max-w-2xl">
           Configure your core startup identity. These details will be synced into your Investor Snapshot and presented directly to investors in the Deal Flow Portal.
         </p>
         {/* Privacy data controls */}
         <div className="mt-4 flex flex-wrap items-center gap-3">
           <button onClick={clearSessionData} className="inline-flex items-center gap-2 text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-4 py-2 hover:bg-red-100 transition-colors rounded-sm">
             🗑 Clear Session Data
           </button>
           <a href="/privacy-promise" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e4a62] hover:text-[#022f42] underline">🔒 Our Privacy Promise</a>
           {sessionCleared && <span className="text-xs text-green-700 font-bold bg-green-50 border border-green-200 px-3 py-1 rounded-sm">✓ Financial metrics cleared from browser storage</span>}
         </div>
      </div>

      <div className="bg-white border border-[#1e4a62]/10 rounded-sm shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] p-8">
        
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-green-50 border-l-4 border-green-500 p-4 flex items-center shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-sm text-green-800 font-bold">Company Profile Secured.</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                <span>Company Name</span>
              </label>
              <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><Building2 className="w-4 h-4 text-[#1e4a62]"/></div>
                <input required value={profile.companyName} onChange={e => setProfile({...profile, companyName: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm" placeholder="e.g. NextBlaze AI" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                <span>Founder Full Name (Auto-synced)</span>
              </label>
              <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><Briefcase className="w-4 h-4 text-[#1e4a62]"/></div>
                <input required value={profile.founderName} onChange={e => setProfile({...profile, founderName: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm" placeholder="e.g. Jane Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                <span>HQ / Country of Incorporation</span>
              </label>
              <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><Globe className="w-4 h-4 text-[#1e4a62]"/></div>
                <select required value={profile.country} onChange={e => setProfile({...profile, country: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm bg-transparent appearance-none">
                  {COUNTRIES.map((country, idx) => (
                     <option key={idx} value={country} disabled={country === "---"}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                 <span>Operating Currencies</span>
               </label>
               <div className="flex space-x-2">
                 <div className="flex w-1/2 border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                    <div className="bg-[#f2f6fa] px-2 flex items-center border-r border-[#1e4a62]/10"><Coins className="w-3.5 h-3.5 text-[#1e4a62]"/></div>
                    <select required value={profile.primaryCurrency} onChange={e => setProfile({...profile, primaryCurrency: e.target.value})} className="w-full p-3 font-bold text-[#022f42] text-xs outline-none bg-transparent">
                        {CURRENCIES.map((c, i) => <option key={i} value={c.code}>{c.name}</option>)}
                    </select>
                 </div>
                 <div className="flex w-1/2 border border-[#1e4a62]/15 bg-[#f2f6fa] focus-within:border-[#022f42] rounded-sm overflow-hidden cursor-pointer hover:bg-white transition-colors">
                    <select value={profile.secondaryCurrency} onChange={e => setProfile({...profile, secondaryCurrency: e.target.value})} className="w-full p-3 font-bold text-[#1e4a62] text-xs outline-none bg-transparent">
                        {SEC_CURRENCIES.map((c, i) => <option key={i} value={c.code}>{c.name}</option>)}
                    </select>
                 </div>
               </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                <span>Primary Industry / Sector</span>
              </label>
              <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><Briefcase className="w-4 h-4 text-[#1e4a62]"/></div>
                <select required value={profile.industry} onChange={e => setProfile({...profile, industry: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm bg-transparent appearance-none">
                  <option value="" disabled>Select your sector...</option>
                  <option value="B2B SaaS / Enterprise">B2B SaaS / Enterprise</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Deep Tech / AI">Deep Tech / AI</option>
                  <option value="HealthTech / MedTech">HealthTech / MedTech</option>
                  <option value="EdTech">EdTech</option>
                  <option value="E-Commerce / D2C">E-Commerce / D2C</option>
                  <option value="Marketplace">Marketplace / Network</option>
                  <option value="CleanTech / Climate">CleanTech / Climate</option>
                  <option value="Logistics / Supply Chain">Logistics / Supply Chain</option>
                  <option value="PropTech / Real Estate">PropTech / Real Estate</option>
                  <option value="Hardware / IoT">Hardware / IoT</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Consumer Social / Media">Consumer Social / Media</option>
                  <option value="Web3 / Crypto">Web3 / Crypto</option>
                  <option value="Mobility / Auto">Mobility / Auto</option>
                  <option value="Other / Niche">Other / Niche</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                <span>The One-Liner (Value Proposition)</span>
              </label>
              <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                <div className="bg-[#f2f6fa] px-3 pt-3 border-r border-[#1e4a62]/10"><Target className="w-4 h-4 text-[#1e4a62]"/></div>
                <textarea required value={profile.oneLiner} onChange={e => setProfile({...profile, oneLiner: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm min-h-[100px]" placeholder="e.g. We help enterprise legal teams automate contract reviews using proprietary LLMs, reducing billable hours by 40%." />
              </div>
            </div>
          </div>


          {/* Financial Metrics Section — wrapped in consent gate */}
          <PrivacyConsentGate
            config={{
              consentKey: "settings_financial_metrics",
              sensitivity: "high-level",
              title: "Enable your Investor Dashboard with financial metrics",
              aiExplanation:
                "Your Investor Dashboard charts — Runway Burn Trajectory, Expenses vs Revenue Map, and EBITDA Breakeven — are powered entirely by the numbers you enter here. FundabilityOS uses them to calculate how many months of runway you have, your burn multiple, and whether your unit economics are investor-grade. These are high-level business metrics, not sensitive bank data. You can use estimates and update them anytime.",
              dataUsage: "Drive Investor Dashboard charts, calculate runway, benchmark LTV:CAC ratio, and populate the Strategy Canvas with live context.",
              storageNote: "Saved in your browser's localStorage under your user ID — never transmitted to our servers. You can wipe them instantly with the 'Clear Session Data' button above.",
              dataPoints: [
                "Monthly Recurring Revenue (MRR)",
                "Monthly Burn Rate",
                "Current Cash Balance",
                "Customer Acquisition Cost (CAC)",
                "Lifetime Value per Customer (LTV)",
              ],
              skippable: true,
            }}
            onConsent={() => {}}
            onSkip={() => {}}
          >
          <div className="mt-8 pt-8 border-t border-[#1e4a62]/10">
            <div className="mb-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#ffd800] bg-[#022f42] inline-flex items-center px-3 py-1 rounded-sm mb-2">
                <span className="mr-1">📊</span> Financial Metrics — Powers Your Investor Dashboard
              </div>
              <p className="text-xs text-[#1e4a62] leading-relaxed">
                These numbers drive your Runway Burn Trajectory, Expenses vs Revenue Map, and EBDAT Breakeven charts.
                Leave at 0 if pre-revenue. All values are in your primary currency.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block">Monthly Recurring Revenue (MRR)</label>
                <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">RM</div>
                  <input type="number" min="0" value={profile.mrr} onChange={e => setProfile({...profile, mrr: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm" placeholder="0" />
                </div>
                <p className="text-[10px] text-[#1e4a62]">Your monthly subscription / recurring revenue</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block">Monthly Burn Rate</label>
                <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">RM</div>
                  <input type="number" min="0" value={profile.burnRate} onChange={e => setProfile({...profile, burnRate: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm" placeholder="0" />
                </div>
                <p className="text-[10px] text-[#1e4a62]">Total monthly cash spent (payroll, infra, ops)</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block">Current Cash Balance</label>
                <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">RM</div>
                  <input type="number" min="0" value={profile.initialCash} onChange={e => setProfile({...profile, initialCash: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm" placeholder="0" />
                </div>
                <p className="text-[10px] text-[#1e4a62]">Cash in bank right now — used for runway calculation</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block">Customer Acquisition Cost (CAC)</label>
                <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">RM</div>
                  <input type="number" min="0" value={profile.cac} onChange={e => setProfile({...profile, cac: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm" placeholder="0" />
                </div>
                <p className="text-[10px] text-[#1e4a62]">Average cost to acquire one customer</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block">Lifetime Value per Customer (LTV)</label>
                <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">RM</div>
                  <input type="number" min="0" value={profile.ltv} onChange={e => setProfile({...profile, ltv: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm" placeholder="0" />
                </div>
                <p className="text-[10px] text-[#1e4a62]">Total revenue a customer generates over their lifetime</p>
              </div>
            </div>
          </div>
          </PrivacyConsentGate>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 mt-8 font-bold tracking-widest uppercase text-xs border-2 transition-all flex items-center justify-center rounded-sm shadow-md ${
              isSubmitting ? "bg-white text-[rgba(2,47,66,0.4)] border-transparent cursor-not-allowed" : "bg-[#022f42] text-white border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-[#1e4a62] border-t-transparent rounded-full animate-spin mr-3"></div> Syncing Profile...</>
            ) : (
              <><span className="mr-2">Save Company Profile & Financial Metrics</span> <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
