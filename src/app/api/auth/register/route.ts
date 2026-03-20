import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { company, founderName, email, password, role } = await req.json();

    if (!company || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const userRole = role === "investor" ? "investor" : "startup";

    const result = db.prepare(
      "INSERT INTO users (company, email, password, role) VALUES (?, ?, ?, ?)"
    ).run(company, email, hash, userRole);

    const userId = result.lastInsertRowid;

    // Create role-specific profile
    if (userRole === "startup") {
      db.prepare("INSERT INTO startup_profiles (user_id) VALUES (?)").run(userId);
    } else {
      db.prepare("INSERT INTO investor_profiles (user_id) VALUES (?)").run(userId);
    }

    const token = await createToken({ id: userId, email, role: userRole, company, founderName: founderName || "" });

    const response = NextResponse.json({ success: true, role: userRole });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
