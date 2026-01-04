import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(req.url);
    const rawIdParam =
      (params as any)?.id ?? url.pathname.split("/").pop() ?? "";
    const id = String(rawIdParam).trim();
    if (!id) {
      return NextResponse.json(
        { error: "ID inválido para atualização" },
        { status: 400 }
      );
    }
    console.log(id);
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

    // Validações básicas com suporte a strings numéricas
    if (
      price !== undefined &&
      !(
        typeof price === "number" ||
        (typeof price === "string" &&
          price.trim() !== "" &&
          Number.isFinite(Number(price)))
      )
    ) {
      return NextResponse.json({ error: "Preço inválido" }, { status: 400 });
    }
    if (
      installmentPrice !== undefined &&
      !(
        typeof installmentPrice === "number" ||
        (typeof installmentPrice === "string" &&
          installmentPrice.trim() !== "" &&
          Number.isFinite(Number(installmentPrice)))
      )
    ) {
      return NextResponse.json(
        { error: "Valor de parcela inválido" },
        { status: 400 }
      );
    }
    if (name !== undefined && typeof name !== "string") {
      return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
    }

    // Normalização dos valores para tipos suportados pelo SQLite
    const nameNorm = typeof name === "string" ? name : undefined;
    const descNorm =
      description === null
        ? null
        : typeof description === "string"
        ? description
        : undefined;
    const priceNorm =
      price === null
        ? null
        : typeof price === "string"
        ? price.trim() === ""
          ? null
          : Number(price)
        : typeof price === "number"
        ? price
        : undefined;
    if (typeof priceNorm === "number" && Number.isNaN(priceNorm)) {
      // se conversão resultou em NaN, tratar como null
      (priceNorm as unknown as null) = null;
    }
    const imageNorm =
      image === null
        ? null
        : typeof image === "string"
        ? image.trim() === ""
          ? null
          : image
        : undefined;
    const deptNorm =
      typeof departmentId === "string" ? departmentId : undefined;
    const catNorm = typeof categoryId === "string" ? categoryId : undefined;
    const instNorm =
      installments === null
        ? null
        : typeof installments === "string"
        ? installments.trim() === ""
          ? null
          : Number.parseInt(installments)
        : typeof installments === "number"
        ? installments
        : undefined;
    if (typeof instNorm === "number" && Number.isNaN(instNorm)) {
      (instNorm as unknown as null) = null;
    }
    const instPriceNorm =
      installmentPrice === null
        ? null
        : typeof installmentPrice === "string"
        ? installmentPrice.trim() === ""
          ? null
          : Number(installmentPrice)
        : typeof installmentPrice === "number"
        ? installmentPrice
        : undefined;
    if (typeof instPriceNorm === "number" && Number.isNaN(instPriceNorm)) {
      (instPriceNorm as unknown as null) = null;
    }

    const updates: string[] = [];
    const args: (string | number | null)[] = [];

    if (nameNorm !== undefined) {
      updates.push("name = ?");
      args.push(nameNorm);
    }
    if (descNorm !== undefined) {
      updates.push("description = ?");
      args.push(descNorm);
    }
    if (priceNorm !== undefined) {
      updates.push("price = ?");
      args.push(priceNorm as number | null);
    }
    if (imageNorm !== undefined) {
      updates.push("image = ?");
      args.push(imageNorm);
    }
    if (deptNorm !== undefined) {
      updates.push("department_id = ?");
      args.push(deptNorm);
    }
    if (catNorm !== undefined) {
      updates.push("category_id = ?");
      args.push(catNorm);
    }
    if (instNorm !== undefined) {
      updates.push("installments = ?");
      args.push(instNorm as number | null);
    }
    if (instPriceNorm !== undefined) {
      updates.push("installment_price = ?");
      args.push(instPriceNorm as number | null);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo para atualizar" },
        { status: 400 }
      );
    }

    args.push(id);

    await turso.execute({
      sql: `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
      args,
    });

    const result = await turso.execute({
      sql: "SELECT * FROM products WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const row = result.rows[0];
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
    };

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      {
        error: "Erro interno ao atualizar produto",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(req.url);
    const rawId = (params as any)?.id ?? url.pathname.split("/").pop() ?? "";
    const sanitizedId = String(rawId).trim();
    console.log(sanitizedId);

    if (!sanitizedId) {
      return NextResponse.json(
        { error: "ID inválido para exclusão" },
        { status: 400 }
      );
    }

    // Remover dependências antes de deletar o produto (evita violação de FK)
    await turso.execute({
      sql: "DELETE FROM cart WHERE product_id = ?",
      args: [sanitizedId],
    });
    await turso.execute({
      sql: "DELETE FROM analytics WHERE product_id = ?",
      args: [sanitizedId],
    });
    // product_images tem ON DELETE CASCADE

    await turso.execute({
      sql: "DELETE FROM products WHERE id = ?",
      args: [sanitizedId],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar produto:", error);
    return NextResponse.json(
      {
        error: "Erro interno ao deletar produto",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
