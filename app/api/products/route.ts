import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { gmcSyncService } from "@/lib/services/gmc-sync-service";

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
      // Validação: categoryId deve ser uma string não vazia e apenas alfanumérica
      if (
        typeof categoryId !== "string" ||
        !categoryId ||
        !/^[a-zA-Z0-9\-_]+$/.test(categoryId)
      ) {
        return NextResponse.json(
          { error: "ID de categoria inválido" },
          { status: 400 },
        );
      }
      sql += " WHERE category_id = ?";
      args.push(categoryId);
    } else if (departmentId) {
      // Validação: departmentId deve ser uma string não vazia e apenas alfanumérica
      if (
        typeof departmentId !== "string" ||
        !departmentId ||
        !/^[a-zA-Z0-9\-_]+$/.test(departmentId)
      ) {
        return NextResponse.json(
          { error: "ID de departamento inválido" },
          { status: 400 },
        );
      }
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
      // Campos de sincronização com Google Merchant Center
      gmcProductId: row.gmc_product_id as string | undefined,
      gmcSyncStatus: row.gmc_sync_status as string | undefined,
      gmcLastSync: row.gmc_last_sync as string | undefined,
      gmcError: row.gmc_error as string | undefined,
      retryCount: row.retry_count as number | undefined,
      lastRetry: row.last_retry as string | undefined,
    }));
    console.log("[API] /api/products result count:", products.length);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error(
      "[API] /api/products error:",
      error?.message || String(error),
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
        { status: 400 },
      );
    }

    const id = `prod_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    await turso.execute({
      sql: `INSERT INTO products (id, name, description, price, image, department_id, category_id, installments, installment_price, gmc_sync_status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
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
        "PENDING", // Status inicial de sincronização com GMC
      ],
    });

    // Adiciona à fila de sincronização com o Google Merchant Center
    try {
      await gmcSyncService.enqueueProduct(id, "CREATE");
      console.log(`✅ Produto ${id} adicionado à fila de sincronização GMC`);
    } catch (syncError) {
      console.error(
        `⚠️ Erro ao adicionar produto ${id} à fila GMC:`,
        syncError,
      );
      // Não falha a criação do produto se a sincronização falhar
    }

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
      // Campos de sincronização com Google Merchant Center
      gmcSyncStatus: "PENDING" as const,
      gmcProductId: undefined,
      gmcLastSync: undefined,
      gmcError: undefined,
      retryCount: 0,
      lastRetry: undefined,
    };

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
