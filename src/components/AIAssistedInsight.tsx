import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AIAssistedInsightProps {
  content: string;
}

export function AIAssistedInsight({ content }: AIAssistedInsightProps) {
  if (!content) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -5 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="mt-6 flex items-start gap-4 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 shadow-sm rounded-sm"
    >
      <div className="bg-yellow-100 p-2 rounded-full shrink-0">
        <Sparkles className="w-5 h-5 text-yellow-600" />
      </div>
      <div className="flex-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-1 flex items-center gap-2">
          AI Assisted Insight
        </h4>
        <p className="text-sm text-yellow-900 font-medium leading-relaxed">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
