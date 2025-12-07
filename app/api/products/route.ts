import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

export async function GET() {
  try {
    const result = await turso.execute("SELECT * FROM products ORDER BY created_at DESC")
    const products = result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | null,
      price: row.price as number,
      image: row.image as string | null,
      departmentId: row.department_id as string,
      categoryId: row.category_id as string,
      installments: row.installments as number | null,
      installmentPrice: row.installment_price as number | null,
    }))
    return NextResponse.json(products)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, price, image, departmentId, categoryId, installments, installmentPrice } =
      await req.json()

    if (!name || price === undefined || !departmentId || !categoryId) {
      return NextResponse.json(
        { error: "Nome, preço, departamento e categoria são obrigatórios" },
        { status: 400 },
      )
    }

    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    await turso.execute({
      sql: `INSERT INTO products (id, name, description, price, image, department_id, category_id, installments, installment_price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        name,
        description || null,
        price,
        image || null,
        departmentId,
        categoryId,
        installments || null,
        installmentPrice || null,
      ],
    })

    const product = {
      id,
      name,
      description: description || null,
      price,
      image: image || null,
      departmentId,
      categoryId,
      installments: installments || undefined,
      installmentPrice: installmentPrice || undefined,
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

