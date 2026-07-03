import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"
import type { ItemCarrinho, FormaPagamento } from "@/types"

interface SaleRequest {
  clienteId: string
  itens: ItemCarrinho[]
  subtotal: number
  desconto: number
  total: number
  formaPagamento: FormaPagamento
}

export async function POST(req: Request) {
  try {
    const body: SaleRequest = await req.json()
    const { clienteId, itens, subtotal, desconto, total, formaPagamento } = body

    if (!itens || itens.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    if (!formaPagamento) {
      return NextResponse.json(
        { error: "Forma de pagamento é obrigatória" },
        { status: 400 },
      )
    }

    // Gera ID da venda
    const saleId = `sale_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    // Insere a venda
    await turso.execute({
      sql: "INSERT INTO sales (id, client_id, subtotal, discount, total, payment_method) VALUES (?, ?, ?, ?, ?, ?)",
      args: [
        saleId,
        clienteId === "avulso" ? null : clienteId,
        subtotal,
        desconto,
        total,
        formaPagamento,
      ],
    })

    // Insere os itens da venda
    for (const item of itens) {
      const itemId = `sale_item_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}`
      const itemTotal = item.preco * item.quantidade

      await turso.execute({
        sql: "INSERT INTO sale_items (id, sale_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)",
        args: [itemId, saleId, item.id, item.quantidade, item.preco, itemTotal],
      })
    }

    return NextResponse.json(
      {
        success: true,
        saleId,
        message: "Venda registrada com sucesso",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[API] /api/pdv/sales POST error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const clientId = url.searchParams.get("clientId")
    const limit = url.searchParams.get("limit") || "50"

    let sql = "SELECT * FROM sales ORDER BY created_at DESC LIMIT ?"
    const args: any[] = [limit]

    if (clientId) {
      sql = "SELECT * FROM sales WHERE client_id = ? ORDER BY created_at DESC LIMIT ?"
      args.unshift(clientId)
    }

    const result = await turso.execute({ sql, args })

    const sales = result.rows.map((row) => ({
      id: row.id as string,
      clienteId: row.client_id as string | null,
      subtotal: row.subtotal as number,
      desconto: row.discount as number,
      total: row.total as number,
      formaPagamento: row.payment_method as string,
      dataCriacao: row.created_at as string,
    }))

    return NextResponse.json(sales)
  } catch (error: any) {
    console.error("[API] /api/pdv/sales GET error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
