import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

// In a real app, this would be imported from the JSON or a DB
import articlesData from "@/data/academy_articles.json";

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-[#f2f6fa] text-[#022f42] font-sans pt-12">
      <div className="max-w-[1280px] mx-auto px-6 mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="bg-[#ffd800] text-[#022f42] px-3 py-1 text-xs font-black uppercase tracking-widest rounded-sm shadow-sm inline-flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" /> FUNDABILITYOS ACADEMY
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[#022f42] tracking-tight leading-tight mb-4">
          The Science of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#022f42] to-[#1b4f68]">Raising Capital.</span>
        </h1>
        <p className="text-[#1e4a62] text-lg max-w-2xl leading-relaxed">
          Access the exact frameworks, methodologies, and mindsets our founders use to scale across Asia and secure institutional funding.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articlesData.map((article: any, i: number) => (
          <Link href={`/academy/${article.slug}`} key={i} className="group flex flex-col h-full bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-t-[4px] border-transparent hover:border-[#ffd800] rounded-sm">
            <div className="mb-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-[#1e4a62]/60 uppercase tracking-widest">
                  Module {article.source_module}
                </span>
                <div className="w-4 h-px bg-[#1e4a62]/20"></div>
                <span className="text-[10px] font-bold text-[#ffd800] uppercase tracking-widest">
                  Guide
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#022f42] group-hover:text-[#1b4f68] transition-colors leading-snug mb-3">
                {article.title}
              </h3>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm font-bold text-[#1e4a62] group-hover:text-[#ffd800] transition-colors">
              <span className="uppercase tracking-widest text-[11px]">Read Article</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
