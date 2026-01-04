import { type NextRequest, NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { verifyPassword, generateToken } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca o admin no banco de dados
    const result = await turso.execute({
      sql: "SELECT id, username, email, password_hash, is_active FROM admins WHERE email = ?",
      args: [username],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const admin = result.rows[0];

    // Verifica se o admin está ativo
    if (admin.is_active !== 1) {
      return NextResponse.json(
        { error: "Conta desativada. Entre em contato com o administrador." },
        { status: 403 }
      );
    }

    // Verifica a senha
    const isValidPassword = verifyPassword(
      password,
      admin.password_hash as string
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Gera token de autenticação
    const token = await generateToken({
      id: admin.id,
      username: admin.username,
      email: admin.email,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
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
