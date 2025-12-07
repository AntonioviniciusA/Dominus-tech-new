import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

export async function GET() {
  try {
    const result = await turso.execute("SELECT * FROM analytics ORDER BY clicks DESC")
    const analytics = result.rows.map((row) => ({
      productId: row.product_id as string,
      productName: row.product_name as string,
      clicks: row.clicks as number,
      lastClicked: row.last_clicked as string | null,
    }))
    return NextResponse.json(analytics)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { productId, productName } = await req.json()

    if (!productId || !productName) {
      return NextResponse.json({ error: "ProductId e productName são obrigatórios" }, { status: 400 })
    }

    // Verifica se já existe analytics para este produto
    const existing = await turso.execute({
      sql: "SELECT id, clicks FROM analytics WHERE product_id = ?",
      args: [productId],
    })

    if (existing.rows.length > 0) {
      // Atualiza o contador
      const newClicks = (existing.rows[0].clicks as number) + 1
      await turso.execute({
        sql: "UPDATE analytics SET clicks = ?, last_clicked = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [newClicks, existing.rows[0].id],
      })
    } else {
      // Cria nova entrada
      const id = `analytics_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      await turso.execute({
        sql: "INSERT INTO analytics (id, product_id, product_name, clicks, last_clicked) VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)",
        args: [id, productId, productName],
      })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

