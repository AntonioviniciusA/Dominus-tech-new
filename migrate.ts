import * as dotenv from "dotenv";

// Load environment variables from .env.local
const result = dotenv.config({ path: ".env.local" });

if (result.error) {
  console.error("Error loading .env.local:", result.error);
} else {
  console.log("Environment variables loaded successfully.");
}

async function main() {
  console.log("Starting migrations...");
  try {
    // Dynamic import to ensure env vars are loaded first
    const { runMigrations } = await import("./lib/db/migrations");
    await runMigrations();
    console.log("Migrations completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
