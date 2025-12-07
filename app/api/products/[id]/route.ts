import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, price, image, departmentId, categoryId, installments, installmentPrice } =
      await req.json()
    const { id } = params

    const updates: string[] = []
    const args: any[] = []

    if (name !== undefined) {
      updates.push("name = ?")
      args.push(name)
    }
    if (description !== undefined) {
      updates.push("description = ?")
      args.push(description)
    }
    if (price !== undefined) {
      updates.push("price = ?")
      args.push(price)
    }
    if (image !== undefined) {
      updates.push("image = ?")
      args.push(image)
    }
    if (departmentId !== undefined) {
      updates.push("department_id = ?")
      args.push(departmentId)
    }
    if (categoryId !== undefined) {
      updates.push("category_id = ?")
      args.push(categoryId)
    }
    if (installments !== undefined) {
      updates.push("installments = ?")
      args.push(installments)
    }
    if (installmentPrice !== undefined) {
      updates.push("installment_price = ?")
      args.push(installmentPrice)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 })
    }

    args.push(id)

    await turso.execute({
      sql: `UPDATE products SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args,
    })

    const result = await turso.execute({
      sql: "SELECT * FROM products WHERE id = ?",
      args: [id],
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    const row = result.rows[0]
    const product = {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | null,
      price: row.price as number,
      image: row.image as string | null,
      departmentId: row.department_id as string,
      categoryId: row.category_id as string,
      installments: row.installments as number | null,
      installmentPrice: row.installment_price as number | null,
    }

    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await turso.execute({
      sql: "DELETE FROM products WHERE id = ?",
      args: [id],
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

