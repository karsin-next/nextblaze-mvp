import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import articlesData from "@/data/academy_articles.json";
import { notFound } from "next/navigation";

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articlesData.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f2f6fa] text-[#022f42] font-sans">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <Link href="/academy" className="inline-flex items-center gap-2 text-[#1e4a62] hover:text-[#ffd800] font-bold text-sm uppercase tracking-widest transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Academy
        </Link>
        
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#022f42] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm">
              Module {article.source_module}
            </span>
            <span className="bg-[#ffd800] text-[#022f42] px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm">
              {article.module_name}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-[#022f42] tracking-tight leading-tight mb-6">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-[#1e4a62] text-sm font-medium border-t border-b border-[#1e4a62]/10 py-4">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#ffd800]" />
              <span>FundabilityOS Methodology</span>
            </div>
            <div className="flex items-center gap-1.5 ml-4">
              <Clock className="w-4 h-4 text-[#ffd800]" />
              <span>5 min read</span>
            </div>
          </div>
        </div>
        
        <article className="prose prose-lg max-w-none text-[#1e4a62] prose-headings:text-[#022f42] prose-headings:font-bold prose-a:text-[#ffd800] hover:prose-a:text-[#022f42] prose-strong:text-[#022f42] leading-relaxed">
          <div className="bg-white p-8 border-l-[4px] border-[#ffd800] shadow-sm mb-8 rounded-sm">
            <p className="font-bold m-0 italic">
              &quot;This article details the exact frameworks used by investors to evaluate your startup during the Due Diligence phase. Applying these principles will directly impact your Fundability Score.&quot;
            </p>
          </div>
          
          <h2>The Fundamentals</h2>
          <p>
            You are reading the official methodology guide for <strong>{article.title}</strong>, a core component of the FundabilityOS system. 
          </p>
          <p>
            When preparing your startup for institutional funding, it is critical to understand not just <em>what</em> data investors ask for, but <em>why</em> they ask for it, and how they interpret your answers.
          </p>
          
          <h2>Actionable Mastery</h2>
          <ul>
            <li>Understand the metrics that matter most to VCs.</li>
            <li>Identify red flags before they derail your fundraise.</li>
            <li>Structure your data room for maximum transparency and speed.</li>
          </ul>
          
          <div className="bg-[#022f42] text-white p-8 mt-12 rounded-sm text-center">
            <h3 className="text-white text-2xl font-black mb-4">Ready to test your {article.module_name}?</h3>
            <p className="text-[#b0d0e0] mb-6">Log into FundabilityOS to run the dedicated diagnostic module for this framework.</p>
            <Link href="/login" className="bg-[#ffd800] text-[#022f42] px-8 py-3 font-bold text-sm uppercase tracking-widest shadow-md hover:bg-white transition-colors inline-block rounded-sm">
              Launch Module {article.source_module}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
