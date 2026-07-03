import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, newPassword } = body

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token e nova senha são obrigatórios" },
        { status: 400 },
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 },
      )
    }

    // Busca o token de reset
    const resetResult = await turso.execute({
      sql: "SELECT id, admin_id, expires_at, used FROM password_resets WHERE token = ?",
      args: [token],
    })

    if (resetResult.rows.length === 0) {
      return NextResponse.json({ error: "Token inválido" }, { status: 400 })
    }

    const resetToken = resetResult.rows[0]
    const resetId = resetToken.id as string
    const adminId = resetToken.admin_id as string
    const expiresAt = new Date(resetToken.expires_at as string)
    const used = resetToken.used as number

    // Verifica se o token foi usado
    if (used === 1) {
      return NextResponse.json(
        { error: "Este link de redefinição já foi utilizado" },
        { status: 400 },
      )
    }

    // Verifica se o token expirou
    if (new Date() > expiresAt) {
      return NextResponse.json(
        { error: "Link de redefinição expirou. Solicite um novo." },
        { status: 400 },
      )
    }

    // Atualiza a senha do admin
    const passwordHash = hashPassword(newPassword)
    await turso.execute({
      sql: "UPDATE admins SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [passwordHash, adminId],
    })

    // Marca o token como usado
    await turso.execute({
      sql: "UPDATE password_resets SET used = 1 WHERE id = ?",
      args: [resetId],
    })

    return NextResponse.json(
      { success: true, message: "Senha redefinida com sucesso! Faça login com sua nova senha." },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("[API] /api/admin/reset-password error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET para validar se o token é válido (antes de enviar o formulário)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 })
    }

    const resetResult = await turso.execute({
      sql: "SELECT id, expires_at, used FROM password_resets WHERE token = ?",
      args: [token],
    })

    if (resetResult.rows.length === 0) {
      return NextResponse.json({ valid: false, error: "Token inválido" }, { status: 400 })
    }

    const resetToken = resetResult.rows[0]
    const expiresAt = new Date(resetToken.expires_at as string)
    const used = resetToken.used as number

    if (used === 1) {
      return NextResponse.json(
        { valid: false, error: "Este link já foi utilizado" },
        { status: 400 },
      )
    }

    if (new Date() > expiresAt) {
      return NextResponse.json(
        { valid: false, error: "Link expirou" },
        { status: 400 },
      )
    }

    return NextResponse.json({ valid: true, message: "Token válido" }, { status: 200 })
  } catch (error: any) {
    console.error("[API] /api/admin/reset-password GET error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
