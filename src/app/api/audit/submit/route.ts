import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { responses } = await req.json();
    // responses: Array<{ questionId, category, answerValue, answerScore }>

    const db = getDb();
    const userId = session.id as number;

    // Create audit session
    const sessionResult = db.prepare(
      "INSERT INTO audit_sessions (user_id) VALUES (?)"
    ).run(userId);
    const sessionId = sessionResult.lastInsertRowid;

    // Save all responses
    const insertResp = db.prepare(
      "INSERT INTO audit_responses (session_id, user_id, question_id, category, answer_value, answer_score) VALUES (?, ?, ?, ?, ?, ?)"
    );

    const saveAll = db.transaction(() => {
      for (const r of responses) {
        insertResp.run(sessionId, userId, r.questionId, r.category, r.answerValue, r.answerScore);
      }
    });
    saveAll();

    // Calculate scores per category
    const categories = ["team", "market", "traction", "financials", "ip"];
    const weights: Record<string, number> = { team: 20, market: 20, traction: 25, financials: 25, ip: 10 };
    const categoryScores: Record<string, number> = {};
    let overallScore = 0;

    for (const cat of categories) {
      const catResponses = responses.filter((r: { category: string }) => r.category === cat);
      if (catResponses.length > 0) {
        const avgScore = catResponses.reduce((sum: number, r: { answerScore: number }) => sum + r.answerScore, 0) / catResponses.length;
        categoryScores[cat] = Math.round(avgScore);
        overallScore += avgScore * (weights[cat] / 100);
      } else {
        categoryScores[cat] = 0;
      }
    }

    const finalScore = Math.round(overallScore);

    // Save score snapshot
    db.prepare(
      "INSERT INTO score_snapshots (user_id, session_id, overall_score, category_scores) VALUES (?, ?, ?, ?)"
    ).run(userId, sessionId, finalScore, JSON.stringify(categoryScores));

    // Update user record
    db.prepare("UPDATE users SET fundability_score = ? WHERE id = ?").run(finalScore, userId);

    // Mark session complete
    db.prepare("UPDATE audit_sessions SET completed = 1, completed_at = datetime('now') WHERE id = ?").run(sessionId);

    // Generate gap analysis
    const gaps = [];
    const sortedCats = Object.entries(categoryScores).sort(([,a], [,b]) => a - b);

    const gapDescriptions: Record<string, { title: string; why: string; action: string }> = {
      team: { title: "Team & Leadership Gaps", why: "Investors bet on teams first. A weak team profile signals execution risk and reduces investor confidence significantly.", action: "Ensure all co-founders are full-time, document prior startup experience, and identify critical hires needed (CTO, CFO)." },
      market: { title: "Market Positioning Weakness", why: "Investors need to see a large, growing market with clear customer personas. Vague market definitions kill deals.", action: "Define your TAM/SAM/SOM with data sources. Create detailed customer personas with pain points and willingness to pay." },
      traction: { title: "Insufficient Traction Evidence", why: "Revenue and user growth are the strongest signals of product-market fit. Without traction data, investors see too much risk.", action: "Focus on measurable metrics: MRR, user growth rate, pilot customers, LOIs. Even pre-revenue startups need milestone evidence." },
      financials: { title: "Weak Financial Governance", why: "Financial discipline separates fundable startups from hobby projects. Investors need visibility into burn rate, runway, and projections.", action: "Build a 24-month financial model, track monthly burn rate, and formalize your cap table structure immediately." },
      ip: { title: "Undefined IP & Differentiation", why: "Without defensible IP or a clear moat, investors worry about copycats and commoditization.", action: "Document all proprietary technology, file provisional patents if applicable, and articulate your competitive moat clearly." },
    };

    for (const [cat, score] of sortedCats.slice(0, 3)) {
      if (score < 80) {
        const desc = gapDescriptions[cat];
        gaps.push({
          category: cat,
          score,
          severity: score < 40 ? "critical" : score < 60 ? "warning" : "moderate",
          ...desc,
          evidence: `Your ${cat} score is ${score}% — below the investor-ready threshold of 80%.`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      sessionId,
      score: finalScore,
      categoryScores,
      gaps,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
