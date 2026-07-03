import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const categoryId = url.searchParams.get("categoryId")
    const search = url.searchParams.get("search")

    let sql = `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.image, 
        p.category_id,
        c.name as category_name,
        COALESCE((SELECT SUM(quantity) FROM cart WHERE product_id = p.id), 0) as estoque
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `
    const args: any[] = []

    if (categoryId) {
      sql += " AND p.category_id = ?"
      args.push(categoryId)
    }

    if (search) {
      sql += " AND (p.name LIKE ? OR p.id LIKE ?)"
      args.push(`%${search}%`, `%${search}%`)
    }

    sql += " ORDER BY p.name"

    const result = await turso.execute({ sql, args })

    const produtos = result.rows.map((row) => ({
      id: row.id as string,
      nome: row.name as string,
      codigo: row.id as string,
      categoria: (row.category_name as string) || "Sem categoria",
      preco: row.price as number,
      estoque: 100, // Valor padrão - em um cenário real, isso viria do banco
      estoqueMinimo: 5,
      imagem: (row.image as string) || "/placeholder.svg",
      descricao: row.description as string | null,
    }))

    return NextResponse.json(produtos)
  } catch (error: any) {
    console.error("[API] /api/pdv/products error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
