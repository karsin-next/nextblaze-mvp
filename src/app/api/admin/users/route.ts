import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const startups = db.prepare("SELECT id, company, email, created_at, role, fundability_score FROM users WHERE role = 'startup' ORDER BY created_at DESC").all();
    const investors = db.prepare("SELECT id, company, email, created_at, role FROM users WHERE role = 'investor' ORDER BY created_at DESC").all();
    return NextResponse.json({ startups, investors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;
    if (!id) return NextResponse.json({ error: "Missing Target ID" }, { status: 400 });

    const db = getDb();

    // Disable FK checks so we can delete in any order safely
    db.pragma("foreign_keys = OFF");

    const safeDelete = (sql: string, params: any[]) => {
      try { db.prepare(sql).run(...params); } catch (e: any) {
        console.warn(`[ADMIN DELETE] Skipped: ${sql} — ${e.message}`);
      }
    };

    // Delete child rows first (tables with session_id FK)
    safeDelete("DELETE FROM audit_responses WHERE session_id IN (SELECT session_id FROM audit_sessions WHERE user_id = ?)", [id]);
    safeDelete("DELETE FROM question_responses WHERE user_id = ?", [id]);
    safeDelete("DELETE FROM audit_sessions WHERE user_id = ?", [id]);

    // Delete child rows for financial connections FK
    safeDelete("DELETE FROM transactions WHERE connection_id IN (SELECT connection_id FROM financial_connections WHERE user_id = ?)", [id]);
    safeDelete("DELETE FROM financial_connections WHERE user_id = ?", [id]);

    // Remaining user-level tables
    safeDelete("DELETE FROM score_snapshots WHERE user_id = ?", [id]);
    safeDelete("DELETE FROM monthly_metrics WHERE user_id = ?", [id]);
    safeDelete("DELETE FROM metric_overrides WHERE user_id = ?", [id]);
    safeDelete("DELETE FROM ai_logs WHERE user_id = ?", [id]);
    safeDelete("DELETE FROM startup_profiles WHERE user_id = ?", [id]);
    safeDelete("DELETE FROM investor_profiles WHERE user_id = ?", [id]);

    // Finally purge the user record
    const result = db.prepare("DELETE FROM users WHERE id = ?").run(id);

    // Re-enable FK checks
    db.pragma("foreign_keys = ON");

    if (result.changes === 0) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error("[ADMIN DELETE] Fatal error:", error.message);
    return NextResponse.json({ error: error.message || "Deletion failed" }, { status: 500 });
  }
}
