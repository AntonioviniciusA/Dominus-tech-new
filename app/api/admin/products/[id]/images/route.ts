import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { randomUUID } from "crypto";

// Listar imagens de um produto
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const result = await turso.execute({
      sql: "SELECT * FROM product_images WHERE product_id = ? ORDER BY created_at DESC",
      args: [id],
    });

    const images = result.rows.map((row) => ({
      id: row.id,
      productId: row.product_id,
      imageData: row.image_data,
      createdAt: row.created_at,
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching product images:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Adicionar nova imagem
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { imageData } = await request.json();

    if (!id || !imageData) {
      return NextResponse.json(
        { error: "Product ID and image data are required" },
        { status: 400 }
      );
    }

    const imageId = randomUUID();

    await turso.execute({
      sql: "INSERT INTO product_images (id, product_id, image_data) VALUES (?, ?, ?)",
      args: [imageId, id, imageData],
    });

    return NextResponse.json({
      id: imageId,
      productId: id,
      imageData,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding product image:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
