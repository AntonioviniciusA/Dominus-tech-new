import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID de categoria inválido" },
        { status: 400 }
      );
    }

    console.log("[API] /api/categories/[id]/products GET id:", id);
    const result = await turso.execute({
      sql: "SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC",
      args: [id.trim()],
    });

    const products = result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      description: (row.description as string) ?? null,
      price: Number(row.price),
      image: (row.image as string) ?? null,
      departmentId: row.department_id as string,
      categoryId: row.category_id as string,
      installments:
        row.installments !== null && row.installments !== undefined
          ? Number(row.installments)
          : null,
      installmentPrice:
        row.installment_price !== null && row.installment_price !== undefined
          ? Number(row.installment_price)
          : null,
    }));

    console.log(
      "[API] /api/categories/[id]/products result count:",
      products.length
    );
    return NextResponse.json(products);
  } catch (error: any) {
    console.error(
      "[API] /api/categories/[id]/products error:",
      error?.message || String(error)
    );
    return NextResponse.json(
      { error: error?.message || "Erro ao buscar produtos da categoria" },
      { status: 500 }
    );
  }
}
