import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 },
      );
    }

    // Busca o admin pelo email
    const adminResult = await turso.execute({
      sql: "SELECT id, email, username FROM admins WHERE email = ?",
      args: [email],
    });

    if (adminResult.rows.length === 0) {
      // Por segurança, não revela se o email existe ou não
      return NextResponse.json(
        {
          success: true,
          message: "Se o email existe, um link de redefinição foi enviado.",
        },
        { status: 200 },
      );
    }

    const admin = adminResult.rows[0];
    const adminId = admin.id as string;

    // Gera um token único
    const token = crypto.randomBytes(32).toString("hex");

    // Define expiração de 1 hora
    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    // Salva o token no banco
    const resetId = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    await turso.execute({
      sql: "INSERT INTO password_resets (id, admin_id, token, expires_at) VALUES (?, ?, ?, ?)",
      args: [resetId, adminId, token, expiresAt],
    });

    // Em ambiente de desenvolvimento, loga o URL no console para teste
    // Em produção, isso seria enviado por email de verdade
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/reset-password?token=${token}`;

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Link de redefinição de senha gerado para ${email}:`);
      console.log(`   ${resetUrl}`);
      console.log(`   Válido por 1 hora`);
    }

    // NUNCA retorne o token ou URL na resposta - isso é inseguro
    // Mesmo em desenvolvimento, isso pode treinar maus hábitos
    return NextResponse.json(
      {
        success: true,
        message: "Se o email existe, um link de redefinição foi enviado.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "[API] /api/admin/forgot-password error:",
      error?.message || String(error),
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
