import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"
import { getSessionId } from "@/lib/db/session"

export async function PUT(req: Request, { params }: { params: { productId: string } }) {
  try {
    const body = await req.json()
    const qRaw = body?.quantity
    const url = new URL(req.url)
    const productId = String(((params as any)?.productId ?? url.pathname.split("/").pop() ?? "")).trim()
    const sessionId = await getSessionId()

    console.log("[API] cart PUT productId:", productId, "raw quantity:", qRaw, "sessionId:", sessionId)

    if (!productId) {
      return NextResponse.json({ error: "ProductId é obrigatório" }, { status: 400 })
    }

    const quantity = typeof qRaw === "string" ? Number.parseInt(qRaw) : Number(qRaw)

    if (quantity === undefined) {
      return NextResponse.json({ error: "Quantity é obrigatório" }, { status: 400 })
    }

    if (quantity <= 0) {
      // Remove o item se a quantidade for 0 ou menor
      await turso.execute({
        sql: "DELETE FROM cart WHERE session_id = ? AND product_id = ?",
        args: [sessionId, productId],
      })
      console.log("[API] cart PUT delete <=0 quantity ok")
      return NextResponse.json({ success: true })
    }

    // Atualiza a quantidade
    await turso.execute({
      sql: "UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ? AND product_id = ?",
      args: [quantity, sessionId, productId],
    })

    console.log("[API] cart PUT update ok")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API] cart PUT error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
  try {
    const url = new URL(req.url)
    const productId = String(((params as any)?.productId ?? url.pathname.split("/").pop() ?? "")).trim()
    const sessionId = await getSessionId()

    console.log("[API] cart DELETE productId:", productId, "sessionId:", sessionId)

    if (!productId) {
      return NextResponse.json({ error: "ProductId é obrigatório" }, { status: 400 })
    }

    await turso.execute({
      sql: "DELETE FROM cart WHERE session_id = ? AND product_id = ?",
      args: [sessionId, productId],
    })

    console.log("[API] cart DELETE ok")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API] cart DELETE error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

