import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

export async function GET() {
  try {
    const result = await turso.execute("SELECT * FROM categories ORDER BY name")
    const categories = result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
    }))
    return NextResponse.json(categories)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 })
    }

    const id = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    await turso.execute({
      sql: "INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)",
      args: [id, name, slug],
    })

    return NextResponse.json({ id, name, slug }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

