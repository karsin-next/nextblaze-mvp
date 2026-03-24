"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { PlayCircle, ShieldAlert, Sparkles, Navigation, Volume2, VolumeX } from "lucide-react";

export default function LandingPage() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleAudio = () => {
    if (videoRef.current) {
      const newState = !isMuted;
      videoRef.current.muted = newState;
      setIsMuted(newState);
      if (!newState) {
        videoRef.current.play().catch(e => console.log("Audio play blocked:", e));
      }
    }
  };
  return (
    <div className="bg-[#f2f6fa] text-[#022f42] selection:bg-[#ffd800] selection:text-[#022f42]">
      {/* HERO SECTION */}
      <section id="home" className="max-w-[1280px] mx-auto px-6 pt-10 pb-6">
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-5 py-1.5 mb-6 text-xs uppercase tracking-widest">
          GET YOUR STARTUP FUNDABLE TO SCALE ACROSS ASIA
        </div>
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex-1 min-w-[300px]">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-[#022f42]">
              BECOME FUNDABLE. FASTER.
            </h1>
            <p className="text-xl text-[#1e4a62] my-6 leading-relaxed">
              Finally, a fundability score that makes you investor‑ready. FundabilityOS prepares startups for fundraising.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="bg-[#022f42] text-white border-2 border-[#022f42] hover:bg-transparent hover:text-[#022f42] px-10 py-4 font-semibold text-sm uppercase tracking-widest transition-all">
                GET FUNDABILITY SCORE
              </Link>
            </div>
          </div>
          <div className="flex-1 min-w-[300px]">
            <div className="border-2 border-[#ffd800] shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] bg-[#022f42] aspect-video w-full relative overflow-hidden group">
              <video 
                ref={videoRef}
                autoPlay 
                muted={isMuted}
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              >
                <source src="/assets/videos/hero-placeholder.mp4" type="video/mp4" />
                <source src="/assets/videos/hero.mp4" type="video/mp4" />
              </video>
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={toggleAudio}
                  className="p-3 rounded-full bg-[#022f42]/40 hover:bg-[#022f42]/60 flex items-center justify-center cursor-pointer transition-all backdrop-blur-md border border-white/20 shadow-lg group/btn"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-[#ffd800]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#ffd800]" />
                  )}
                  <span className="max-w-0 overflow-hidden group-hover/btn:max-w-xs group-hover/btn:ml-2 transition-all duration-300 text-[10px] font-black text-[#ffd800] uppercase tracking-widest whitespace-nowrap">
                    {isMuted ? "Unmute" : "Sound On"}
                  </span>
                </button>
              </div>
              <div className="absolute bottom-4 right-4 text-[#ffd800] font-black text-[10px] tracking-[0.3em] opacity-40 uppercase z-0">NextBlaze Preview</div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM EXPLANATION: WHAT IS FundabilityOS */}
      <section id="system" className="max-w-[1280px] mx-auto px-6 py-6 md:py-10">
        <div className="bg-white border-l-[6px] border-[#ffd800] shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] p-0 flex flex-col md:flex-row overflow-hidden">
           <div className="bg-[#022f42] text-white p-10 md:w-2/5 flex flex-col justify-center">
             <div className="inline-block px-4 py-1.5 bg-[#ffd800] text-[#022f42] text-xs font-bold uppercase tracking-widest mb-6 self-start shadow-sm">
                100% Free for Early Adopters
             </div>
             <h2 className="text-4xl font-bold mb-4">What does FundabilityOS do?</h2>
             <p className="text-[#b0d0e0] leading-relaxed mb-6">
                 FundabilityOS is a continuous diagnostic engine. It bridges the fatal gap between scaling startups and institutional investors by providing a dual-sided ecosystem.
             </p>
             <Link href="/methodology" className="flex items-center text-[#ffd800] font-bold uppercase tracking-widest text-sm hover:underline decoration-2 underline-offset-4">
                View our methodology <Navigation className="w-4 h-4 ml-2" />
             </Link>
           </div>
           
           <div className="p-10 md:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-[#f2f6fa] rounded-full flex items-center justify-center border border-[rgba(2,47,66,0.12)]">
                   <Sparkles className="w-6 h-6 text-[#022f42]" />
                 </div>
                 <h4 className="text-xl font-bold text-[#022f42]">For Startups</h4>
                 <p className="text-[#1e4a62] text-sm leading-relaxed">
                   Stop guessing what investors want. Compute your exact fundraising readiness score instantly, track your live burn rate, and access a tailored curriculum to fix tactical gaps before you pitch.
                 </p>
              </div>
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-[#f2f6fa] rounded-full flex items-center justify-center border border-[rgba(2,47,66,0.12)]">
                   <ShieldAlert className="w-6 h-6 text-[#022f42]" />
                 </div>
                 <h4 className="text-xl font-bold text-[#022f42]">For Investors</h4>
                 <p className="text-[#1e4a62] text-sm leading-relaxed">
                   Access an exclusive, highly-curated deal flow pipeline. Every startup on our platform is pre-vetted with certified MRR, runway verifications, and cap table integrity algorithms.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* IMPACT SNAPSHOT */}
      <section id="impact" className="max-w-[1280px] mx-auto px-6 py-6">
        <h2 className="text-4xl font-bold text-[#022f42] mb-6 relative">
          Impact snapshot
          <span className="block w-20 h-1 bg-[#ffd800] mt-3"></span>
        </h2>
        <div className="flex flex-wrap gap-8 bg-white px-10 py-8 border-l-[6px] border-[#ffd800] shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] my-4">
          <div className="flex-1 min-w-[120px]">
            <div className="text-4xl md:text-5xl font-semibold text-[#022f42] leading-none mb-2">RM 60.8M</div>
            <div className="text-[#1e4a62] text-sm uppercase tracking-wider font-medium">Value creation</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-4xl md:text-5xl font-semibold text-[#022f42] leading-none mb-2">12</div>
            <div className="text-[#1e4a62] text-sm uppercase tracking-wider font-medium">International markets</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-4xl md:text-5xl font-semibold text-[#022f42] leading-none mb-2">118</div>
            <div className="text-[#1e4a62] text-sm uppercase tracking-wider font-medium">Innovators facilitated</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-4xl md:text-5xl font-semibold text-[#022f42] leading-none mb-2">25</div>
            <div className="text-[#1e4a62] text-sm uppercase tracking-wider font-medium">Global companies landed</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 justify-between bg-white px-10 py-6 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] text-[#1e4a62] text-lg">
          <span><strong className="text-[#022f42]">155</strong> international innovators</span>
          <span><strong className="text-[#022f42]">16</strong> expansion programmes</span>
          <span><strong className="text-[#022f42]">9</strong> Asian markets</span>
        </div>
      </section>

      {/* INNOVATOR CASE STUDIES */}
      <section id="cases" className="max-w-[1280px] mx-auto px-6 py-6 border-t border-[rgba(2,47,66,0.12)] mt-8">
        <h2 className="text-4xl font-bold text-[#022f42] mt-6 mb-4 relative">
          Case Studies: Innovators we accelerated
          <span className="block w-20 h-1 bg-[#ffd800] mt-3"></span>
        </h2>
        <p className="text-lg text-[#1e4a62] max-w-[800px] mb-6">
          Real stories from deep tech founders across Asia validating their business models through our system.
        </p>
        
        {/* Full 9 Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
          
          <div className="bg-white p-6 pb-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-b-4 border-transparent hover:border-[#ffd800] transition-all hover:shadow-[0_35px_55px_-18px_rgba(255,216,0,0.25)] flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[#ffd800] font-semibold mb-3">AgriTech / Carbon Capture</div>
            <h4 className="text-xl font-bold text-[#022f42] mb-3">Carbon-negative microalgae</h4>
            <p className="text-[#1e4a62] text-sm leading-relaxed mb-4 flex-grow">Proprietary systems transforming waste into regenerative soil input. Scaled to 700+ tanks in Malaysia.</p>
            <div className="font-semibold text-[10px] text-[#022f42] uppercase tracking-wider border-t border-[rgba(2,47,66,0.12)] pt-3 mt-3">700+ tanks · Gold Medal 2025 · Pilots in Japan</div>
          </div>

          <div className="bg-white p-6 pb-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-b-4 border-transparent hover:border-[#ffd800] transition-all hover:shadow-[0_35px_55px_-18px_rgba(255,216,0,0.25)] flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[#ffd800] font-semibold mb-3">Animal Health / AgriTech</div>
            <h4 className="text-xl font-bold text-[#022f42] mb-3">Livestock immunity booster</h4>
            <p className="text-[#1e4a62] text-sm leading-relaxed mb-4 flex-grow">Coconut-oil multivitamin reducing mortality 90%. Improved income 41% cutting medication costs.</p>
            <div className="font-semibold text-[10px] text-[#022f42] uppercase tracking-wider border-t border-[rgba(2,47,66,0.12)] pt-3 mt-3">90% survival rate · 162 breeders · Export</div>
          </div>

          <div className="bg-white p-6 pb-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-b-4 border-transparent hover:border-[#ffd800] transition-all hover:shadow-[0_35px_55px_-18px_rgba(255,216,0,0.25)] flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[#ffd800] font-semibold mb-3">EdTech / B2B SaaS</div>
            <h4 className="text-xl font-bold text-[#022f42] mb-3">Learning centre management</h4>
            <p className="text-[#1e4a62] text-sm leading-relaxed mb-4 flex-grow">Comprehensive SaaS for tuition centres supporting 2,700 locations across 5 ASEAN countries. Raised RM 8M.</p>
            <div className="font-semibold text-[10px] text-[#022f42] uppercase tracking-wider border-t border-[rgba(2,47,66,0.12)] pt-3 mt-3">2,700 centres · RM 8M raised · 5 countries</div>
          </div>

          <div className="bg-white p-6 pb-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-b-4 border-transparent hover:border-[#ffd800] transition-all hover:shadow-[0_35px_55px_-18px_rgba(255,216,0,0.25)] flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[#ffd800] font-semibold mb-3">Robotics / F&B Automation</div>
            <h4 className="text-xl font-bold text-[#022f42] mb-3">AI-powered robotic barista</h4>
            <p className="text-[#1e4a62] text-sm leading-relaxed mb-4 flex-grow">Autonomous robot ecosystem serving 200 cups/hour. Deployed in transport hubs across 6 countries.</p>
            <div className="font-semibold text-[10px] text-[#022f42] uppercase tracking-wider border-t border-[rgba(2,47,66,0.12)] pt-3 mt-3">200 cups/hour · RM 350M valuation · 6 countries</div>
          </div>

          <div className="bg-white p-6 pb-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-b-4 border-transparent hover:border-[#ffd800] transition-all hover:shadow-[0_35px_55px_-18px_rgba(255,216,0,0.25)] flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[#ffd800] font-semibold mb-3">IoT / Fleet Management</div>
            <h4 className="text-xl font-bold text-[#022f42] mb-3">AI-driven fleet telematics</h4>
            <p className="text-[#1e4a62] text-sm leading-relaxed mb-4 flex-grow">Comprehensive management platform combining GPS, IoT sensors. Collected 2.6B data points.</p>
            <div className="font-semibold text-[10px] text-[#022f42] uppercase tracking-wider border-t border-[rgba(2,47,66,0.12)] pt-3 mt-3">2.6B data points · Acquired · 130+ resellers</div>
          </div>

          <div className="bg-white p-6 pb-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-b-4 border-transparent hover:border-[#ffd800] transition-all hover:shadow-[0_35px_55px_-18px_rgba(255,216,0,0.25)] flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[#ffd800] font-semibold mb-3">5G / Telecom</div>
            <h4 className="text-xl font-bold text-[#022f42] mb-3">Bandwidth sharing network</h4>
            <p className="text-[#1e4a62] text-sm leading-relaxed mb-4 flex-grow">App allowing users to share unused WiFi, creating affordable access. 85,000 hotspots worldwide.</p>
            <div className="font-semibold text-[10px] text-[#022f42] uppercase tracking-wider border-t border-[rgba(2,47,66,0.12)] pt-3 mt-3">85k hotspots · 32 countries · Scaled organically</div>
          </div>

          <div className="bg-white p-6 pb-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-b-4 border-transparent hover:border-[#ffd800] transition-all hover:shadow-[0_35px_55px_-18px_rgba(255,216,0,0.25)] flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[#ffd800] font-semibold mb-3">HealthTech / MedDevice</div>
            <h4 className="text-xl font-bold text-[#022f42] mb-3">Point-of-care diagnostics</h4>
            <p className="text-[#1e4a62] text-sm leading-relaxed mb-4 flex-grow">Portable rapid testing platform for infectious diseases delivering lab-grade results in 15 minutes at rural clinics.</p>
            <div className="font-semibold text-[10px] text-[#022f42] uppercase tracking-wider border-t border-[rgba(2,47,66,0.12)] pt-3 mt-3">15-min results &middot; 3 countries &middot; RM 4.2M raised</div>
          </div>

          <div className="bg-white p-6 pb-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-b-4 border-transparent hover:border-[#ffd800] transition-all hover:shadow-[0_35px_55px_-18px_rgba(255,216,0,0.25)] flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[#ffd800] font-semibold mb-3">CleanEnergy / Solar</div>
            <h4 className="text-xl font-bold text-[#022f42] mb-3">Micro-grid solar distribution</h4>
            <p className="text-[#1e4a62] text-sm leading-relaxed mb-4 flex-grow">Pay-as-you-go solar micro-grids powering off-grid communities. IoT-monitored energy distribution across 4 provinces.</p>
            <div className="font-semibold text-[10px] text-[#022f42] uppercase tracking-wider border-t border-[rgba(2,47,66,0.12)] pt-3 mt-3">12,000 households &middot; 4 provinces &middot; Carbon neutral</div>
          </div>

          <div className="bg-white p-6 pb-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-b-4 border-transparent hover:border-[#ffd800] transition-all hover:shadow-[0_35px_55px_-18px_rgba(255,216,0,0.25)] flex flex-col">
            <div className="text-xs uppercase tracking-wider text-[#ffd800] font-semibold mb-3">FinTech / Islamic Finance</div>
            <h4 className="text-xl font-bold text-[#022f42] mb-3">Shariah-compliant micro-lending</h4>
            <p className="text-[#1e4a62] text-sm leading-relaxed mb-4 flex-grow">Digital platform enabling ethical micro-financing for underbanked SMEs across Southeast Asia with AI credit scoring.</p>
            <div className="font-semibold text-[10px] text-[#022f42] uppercase tracking-wider border-t border-[rgba(2,47,66,0.12)] pt-3 mt-3">8,500 SMEs &middot; 98.2% repayment &middot; 2 markets</div>
          </div>

        </div>
      </section>

      {/* PARTNER WITH US */}
      <section id="contact" className="max-w-[1280px] mx-auto px-6 py-12 md:py-16 grid lg:grid-cols-2 gap-12 border-t border-[rgba(2,47,66,0.12)] mt-6">
        <div className="bg-white p-10 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)]">
          <h2 className="text-4xl font-bold text-[#022f42] mb-6 relative">
            Ready to raise?
            <span className="block w-20 h-1 bg-[#ffd800] mt-3"></span>
          </h2>
          <p className="text-lg text-[#1e4a62] mb-8 leading-relaxed">
            You have tried the FundabilityOS but need more answers? Talk to a fundraising advisor. Our advisors are on community-service mode for now.
          </p>
          <a href="https://calendar.app.google/o4nL2doPBcnSne6v8" target="_blank" rel="noreferrer" className="bg-[#ffd800] text-[#022f42] border-2 border-[#ffd800] px-10 py-4 font-bold tracking-widest uppercase transition-all hover:bg-transparent hover:text-[#ffd800] inline-block">
            Book a 30-minute call
          </a>
        </div>

        <div className="bg-white p-10 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] border-l-4 border-[#022f42]">
          <h2 className="text-3xl font-bold text-[#022f42] mb-4">Ready to sequence your raise?</h2>
          <p className="text-[#1e4a62] mb-8">Start with a free FundabilityOS account. Your startup snapshot will be sent to our Deal Desk team for review within 24h.</p>
          <Link href="/login" className="block text-center bg-[#022f42] text-white border-2 border-[#022f42] py-4 font-bold uppercase tracking-widest hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] transition-colors text-sm shadow-md">
            Contact Deal Desk — Sign In Required
          </Link>
          <hr className="my-8 border-t border-[rgba(2,47,66,0.12)]" />
          <div className="flex justify-between items-center text-[#1e4a62] font-medium text-sm border-l-2 border-[#ffd800] pl-4">
            <span>✉ karsin@nextblaze.asia</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="bg-[#022f42] text-white text-center py-12 px-6 border-b-[3px] border-[#ffd800] mt-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let&apos;s co-create the future</h2>
        <p className="text-lg max-w-[700px] mx-auto mb-8 text-[#b0d0e0]">
          We bridge innovators with markets, funding, and partners across Asia.
        </p>
        <Link href="/login" className="bg-transparent border-2 border-[#ffd800] text-[#ffd800] px-10 py-3 font-bold uppercase tracking-widest hover:bg-[#ffd800] hover:text-[#022f42] transition-colors inline-block text-sm">
          Access FundabilityOS
        </Link>
      </div>
    </div>
  );
}
