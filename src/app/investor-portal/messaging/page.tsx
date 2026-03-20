"use client";

import { useState } from "react";
import { MessageSquare, Send, ArrowRight } from "lucide-react";
import Link from "next/link";

const threads = [
  { founder: "PayLater.my", lastMessage: "Thanks for your interest! Happy to schedule a call.", time: "2h ago", unread: true },
  { founder: "AgroSense AI", lastMessage: "Our IP portfolio details are now in the data room.", time: "1d ago", unread: false },
  { founder: "GridSolar Systems", lastMessage: "We can share our government contract pipeline under NDA.", time: "3d ago", unread: false },
];

export default function MessagingPage() {
  const [activeThread, setActiveThread] = useState(0);
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "investor", text: "Hi, I reviewed your deal memo. Impressive MRR growth. Can you share more about your customer acquisition strategy?" },
    { from: "founder", text: "Thanks for your interest! Happy to schedule a call. Our primary channel is LinkedIn outreach + referral partnerships. CAC is $120 and trending down." },
  ]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => [...prev, { from: "investor", text: newMsg }]);
    setNewMsg("");
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "founder", text: "Thanks for the message! I will get back to you within 24 hours with more details." }]);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-[#022f42] mb-2">Module E: Secure Introductions</h1>
      <p className="text-[#1e4a62] mb-8">Connect with founders directly within the platform. All conversations are recorded and secure.</p>

      <div className="bg-white shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] flex overflow-hidden" style={{ height: "500px" }}>
        <div className="w-72 border-r border-[rgba(2,47,66,0.12)] overflow-y-auto shrink-0">
          {threads.map((t, i) => (
            <div key={i} onClick={() => setActiveThread(i)}
              className={`p-4 cursor-pointer border-b border-[rgba(2,47,66,0.08)] transition-colors ${activeThread === i ? "bg-[#f2f6fa] border-l-4 border-l-[#ffd800]" : "hover:bg-[#f7f9fb]"}`}>
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-[#022f42]">{t.founder}</h4>
                {t.unread && <span className="w-2 h-2 rounded-full bg-[#ffd800]"></span>}
              </div>
              <p className="text-xs text-[#1e4a62] mt-1 line-clamp-1">{t.lastMessage}</p>
              <p className="text-[10px] text-[#1e4a62]/60 mt-1">{t.time}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[rgba(2,47,66,0.12)] bg-[#f8fafc]">
            <h3 className="font-bold text-[#022f42]">{threads[activeThread].founder}</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "investor" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-3 text-sm ${m.from === "investor" ? "bg-[#022f42] text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl" : "bg-[#f2f6fa] text-[#022f42] border border-[rgba(2,47,66,0.12)] rounded-tl-xl rounded-tr-xl rounded-br-xl"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[rgba(2,47,66,0.12)] flex gap-3">
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..." className="flex-1 px-4 py-3 bg-[#f2f6fa] border-2 border-transparent focus:border-[#ffd800] focus:outline-none text-sm text-[#022f42]" />
            <button onClick={sendMessage} className="px-6 py-3 bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/investor-portal/due-diligence" className="inline-flex items-center px-8 py-4 bg-[#022f42] text-white font-bold uppercase tracking-widest text-sm border-2 border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] transition-all">
          Due Diligence Room <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
