import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Senha obrigatória" }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_SECRET_KEY;

    console.log("[v0] Login attempt with password:", password);
    console.log("[v0] Admin password from env:", adminPassword);
    console.log("[v0] Match:", password === adminPassword);

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    const token = Buffer.from(`${password}:${Date.now()}`).toString("base64");

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Erro ao processar autenticação" },
      { status: 500 }
    );
  }
}
