import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import articlesData from "@/data/academy_articles.json";
import { notFound, redirect } from "next/navigation";
import { AcademyCTA } from "@/components/AcademyCTA";
import { promises as fs } from "fs";
import path from "path";

// Simple Markdown to HTML converter for basic elements
function parseMarkdown(md: string) {
  if (!md) return "";
  
  return md
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-[#022f42]">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-[#022f42]">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black mt-10 mb-6 text-[#022f42]">$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#022f42] font-bold underline hover:text-[#ffd800] transition-colors">$1</a>')
    // Special Alerts (GitHub style)
    .replace(/^> \[!TIP\]\s*\n(.*?)$/gim, '<div class="bg-[#fffcf0] p-6 border-l-[4px] border-[#ffd800] rounded-sm my-8"><p class="m-0 font-bold">$1</p></div>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[#1e4a62]/20 pl-6 italic my-8 text-[#1e4a62]/80">$1</blockquote>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
    // Paragraphs (simplified)
    .split('\n\n').map(p => p.trim().startsWith('<') ? p : `<p class="mb-6">${p}</p>`).join('\n');
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articlesData.find((a: any) => 
    a.slug === params.slug || (a.redirects && a.redirects.includes(params.slug))
  );

  if (!article) {
    notFound();
  }

  // Handle Redirects
  if (article.slug !== params.slug) {
    redirect(`/academy/${article.slug}`);
  }

  // Load unique content if it exists
  let dynamicContent = null;
  try {
    const filePath = path.join(process.cwd(), "src/content/academy", `${article.slug}.md`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    dynamicContent = parseMarkdown(fileContent);
  } catch (e) {
    // Fallback if no specific markdown file exists
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
        
        <article className="prose prose-lg max-w-none text-[#1e4a62] prose-headings:text-[#022f42] prose-headings:font-bold prose-a:text-[#022f42] prose-a:font-bold prose-a:underline hover:prose-a:text-[#ffd800] hover:prose-a:no-underline prose-strong:text-[#022f42] leading-relaxed">
          {dynamicContent ? (
            <div dangerouslySetInnerHTML={{ __html: dynamicContent }} />
          ) : (
            <>
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
            </>
          )}
          
          <AcademyCTA 
            moduleName={article.module_name} 
            sourceModule={article.source_module} 
          />
        </article>
      </div>
    </div>
  );
}
