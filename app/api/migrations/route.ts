import { NextResponse } from "next/server"
import { runMigrations } from "@/lib/db/migrations"

export async function POST() {
  try {
    await runMigrations()
    return NextResponse.json({ success: true, message: "Migrações executadas com sucesso" })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

