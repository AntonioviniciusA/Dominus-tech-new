import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"
import { getSessionId } from "@/lib/db/session"

export async function GET() {
  try {
    const sessionId = await getSessionId()
    console.log("[API] cart GET sessionId:", sessionId)

    // Busca o carrinho com os dados completos dos produtos
    const result = await turso.execute({
      sql: `SELECT 
              c.id,
              c.quantity,
              p.id as product_id,
              p.name as product_name,
              p.description as product_description,
              p.price as product_price,
              p.image as product_image,
              p.department_id as product_department_id,
              p.category_id as product_category_id,
              p.installments as product_installments,
              p.installment_price as product_installment_price
            FROM cart c
            INNER JOIN products p ON c.product_id = p.id
            WHERE c.session_id = ?`,
      args: [sessionId],
    })

    const cart = result.rows.map((row) => ({
      product: {
        id: row.product_id as string,
        name: row.product_name as string,
        description: row.product_description as string | null,
        price: row.product_price as number,
        image: row.product_image as string | null,
        departmentId: row.product_department_id as string,
        categoryId: row.product_category_id as string,
        installments: row.product_installments as number | null,
        installmentPrice: row.product_installment_price as number | null,
      },
      quantity: row.quantity as number,
    }))

    console.log("[API] cart GET items:", cart.length)
    return NextResponse.json(cart)
  } catch (error: any) {
    console.error("[API] cart GET error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const productId = String(body?.productId ?? "").trim()
    const qRaw = body?.quantity
    const quantity = typeof qRaw === "string" ? Number.parseInt(qRaw) : Number(qRaw)
    const sessionId = await getSessionId()
    console.log("[API] cart POST productId:", productId, "raw quantity:", qRaw, "sessionId:", sessionId)

    if (!productId || !quantity) {
      return NextResponse.json({ error: "ProductId e quantity são obrigatórios" }, { status: 400 })
    }

    // Verifica se o produto já está no carrinho
    const existing = await turso.execute({
      sql: "SELECT id, quantity FROM cart WHERE session_id = ? AND product_id = ?",
      args: [sessionId, productId],
    })

    if (existing.rows.length > 0) {
      // Atualiza a quantidade
      const newQuantity = (existing.rows[0].quantity as number) + quantity
      await turso.execute({
        sql: "UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [newQuantity, existing.rows[0].id],
      })
    } else {
      // Adiciona novo item
      const id = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      await turso.execute({
        sql: "INSERT INTO cart (id, session_id, product_id, quantity) VALUES (?, ?, ?, ?)",
        args: [id, sessionId, productId, quantity],
      })
    }

    console.log("[API] cart POST ok")
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: any) {
    console.error("[API] cart POST error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const sessionId = await getSessionId()
    console.log("[API] cart DELETE ALL sessionId:", sessionId)

    await turso.execute({
      sql: "DELETE FROM cart WHERE session_id = ?",
      args: [sessionId],
    })

    console.log("[API] cart DELETE ALL ok")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API] cart DELETE ALL error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

