import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { triggerMockUpload } = await req.json();
    if (!triggerMockUpload) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const db = getDb();
    const userId = session.id as number;

    // Simulate recording the connection
    const connResult = db.prepare(
      "INSERT INTO financial_connections (user_id, provider_type, provider_name, status) VALUES (?, ?, ?, ?)"
    ).run(userId, "csv", "Manual Upload", "active");

    const connId = connResult.lastInsertRowid;

    // Simulate inserting monthly metrics (Unit Economics base)
    db.prepare(`
       INSERT INTO monthly_metrics (user_id, month_date, revenue, expenses, burn_rate, runway_months, new_customers, churned_customers, cac, ltv, gross_margin, calculation_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ai')
    `).run(userId, new Date().toISOString().substring(0, 7), 11000, 26000, 15000, 6.5, 42, 3, 650, 4500, 77.5);
    
    // Update user profile
    db.prepare("UPDATE users SET bank_connected = 1, last_data_sync = datetime('now'), data_quality_score = 92 WHERE id = ?").run(userId);

    return NextResponse.json({ success: true, connectionId: connId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
