import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

export async function GET() {
  try {
    const result = await turso.execute("SELECT * FROM departments ORDER BY name")
    const departments = result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
    }))
    return NextResponse.json(departments)
  } catch (error: any) {
    console.error("Erro ao buscar departamentos:", error)
    
    // Verifica se o erro é de tabela não encontrada
    if (error.message?.includes("no such table") || error.message?.includes("does not exist")) {
      return NextResponse.json(
        { 
          error: "Tabela não encontrada. Execute as migrações primeiro: POST /api/migrations",
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Erro ao buscar departamentos", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 })
    }

    const id = `dept_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    await turso.execute({
      sql: "INSERT INTO departments (id, name, slug) VALUES (?, ?, ?)",
      args: [id, name, slug],
    })

    return NextResponse.json({ id, name, slug }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

