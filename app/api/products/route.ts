import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const categoryId = url.searchParams.get("categoryId");
    const departmentId = url.searchParams.get("departmentId");
    console.log("[API] /api/products GET params:", {
      categoryId,
      departmentId,
    });

    let sql = "SELECT * FROM products";
    const args: any[] = [];

    if (categoryId) {
      sql += " WHERE category_id = ?";
      args.push(categoryId);
    } else if (departmentId) {
      sql += " WHERE department_id = ?";
      args.push(departmentId);
    }

    sql += " ORDER BY created_at DESC";
    console.log("[API] /api/products SQL:", sql, "args:", args);

    const result = await turso.execute({
      sql,
      args,
    });
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
    }));
    console.log("[API] /api/products result count:", products.length);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error(
      "[API] /api/products error:",
      error?.message || String(error)
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      name,
      description,
      price,
      image,
      departmentId,
      categoryId,
      installments,
      installmentPrice,
    } = await req.json();

    if (!name || price === undefined || !departmentId || !categoryId) {
      return NextResponse.json(
        { error: "Nome, preço, departamento e categoria são obrigatórios" },
        { status: 400 }
      );
    }

    const id = `prod_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;

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
    });

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
    };

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
