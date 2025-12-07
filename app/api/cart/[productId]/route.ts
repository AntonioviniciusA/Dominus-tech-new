import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"
import { getSessionId } from "@/lib/db/session"

export async function PUT(req: Request, { params }: { params: { productId: string } }) {
  try {
    const { quantity } = await req.json()
    const { productId } = params
    const sessionId = await getSessionId()

    if (quantity === undefined) {
      return NextResponse.json({ error: "Quantity é obrigatório" }, { status: 400 })
    }

    if (quantity <= 0) {
      // Remove o item se a quantidade for 0 ou menor
      await turso.execute({
        sql: "DELETE FROM cart WHERE session_id = ? AND product_id = ?",
        args: [sessionId, productId],
      })
      return NextResponse.json({ success: true })
    }

    // Atualiza a quantidade
    await turso.execute({
      sql: "UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ? AND product_id = ?",
      args: [quantity, sessionId, productId],
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params
    const sessionId = await getSessionId()

    await turso.execute({
      sql: "DELETE FROM cart WHERE session_id = ? AND product_id = ?",
      args: [sessionId, productId],
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

