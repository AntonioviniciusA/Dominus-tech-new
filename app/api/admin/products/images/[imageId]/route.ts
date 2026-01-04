import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    await turso.execute({
      sql: "DELETE FROM product_images WHERE id = ?",
      args: [imageId],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product image:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
