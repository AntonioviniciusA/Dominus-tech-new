import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, slug } = await req.json();
    const { id } = await params;
    console.log(id);
    const updates: string[] = [];
    const args: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      args.push(name);
    }
    if (slug !== undefined) {
      updates.push("slug = ?");
      args.push(slug);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo para atualizar" },
        { status: 400 }
      );
    }

    args.push(id);

    await turso.execute({
      sql: `UPDATE categories SET ${updates.join(", ")} WHERE id = ?`,
      args,
    });

    const result = await turso.execute({
      sql: "SELECT * FROM categories WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    const category = result.rows[0];
    return NextResponse.json({
      id: category.id as string,
      name: category.name as string,
      slug: category.slug as string,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await turso.execute({
      sql: "DELETE FROM categories WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar categoria:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao deletar categoria" },
      { status: 500 }
    );
  }
}
