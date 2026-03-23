import { getDb } from "@/lib/db";

export async function GET() {
  let dbStatus = "unknown";
  try {
    const db = getDb();
    db.prepare("SELECT 1").get();
    dbStatus = "connected";
  } catch (e: any) {
    dbStatus = "error: " + e.message;
  }

  return new Response(JSON.stringify({ 
    status: "ok", 
    database: dbStatus,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    uptime: process.uptime()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
