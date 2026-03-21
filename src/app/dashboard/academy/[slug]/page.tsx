import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import articlesData from "@/data/academy_articles.json";
import { notFound } from "next/navigation";

export default function DashboardArticlePage({ params }: { params: { slug: string } }) {
  const article = articlesData.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#1e4a62] hover:text-[#022f42] font-bold text-sm uppercase tracking-widest transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      
      <div className="bg-white p-8 md:p-12 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#ffd800] rounded-sm">
        <div className="mb-10 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#022f42] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm">
              Module {article.source_module}
            </span>
            <span className="bg-[#ffd800] text-[#022f42] px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm shadow-sm">
              {article.module_name}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-[#022f42] tracking-tight leading-tight mb-6">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-[#1e4a62] text-sm font-medium">
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
        
        <article className="prose prose-lg max-w-none text-[#1e4a62] prose-headings:text-[#022f42] prose-headings:font-black prose-a:text-[#022f42] prose-a:font-bold prose-a:underline hover:prose-a:text-[#ffd800] hover:prose-a:no-underline prose-strong:text-[#022f42] leading-relaxed">
          <div className="bg-[#f2f6fa] p-8 border-l-[4px] border-[#022f42] mb-8 rounded-sm">
            <p className="font-bold m-0 text-[#022f42]">
              Executive Summary
            </p>
            <p className="text-sm mt-2 mb-0 italic">
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
        </article>
      </div>
    </div>
  );
}
