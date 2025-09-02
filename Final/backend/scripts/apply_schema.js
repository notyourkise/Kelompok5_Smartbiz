// Apply schema.sql to the Postgres database pointed by DATABASE_URL
// Usage (PowerShell):
//   $env:DATABASE_URL="postgresql://...sslmode=require"; node scripts/apply_schema.js
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

async function main() {
  const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
  try {
    const sql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(sql);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Failed to apply schema:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
