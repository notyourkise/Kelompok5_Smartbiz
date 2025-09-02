// Usage (PowerShell):
//   $env:DATABASE_URL="<your_neon_url>"; node scripts/create_admin.js admin yourpassword
const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function main() {
  const [username, password, roleArg] = process.argv.slice(2);
  const role = roleArg || "superadmin";
  if (!username || !password) {
    console.error(
      "Usage: node scripts/create_admin.js <username> <password> [role]"
    );
    process.exit(1);
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const res = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING id, username, role",
      [username, hash, role]
    );
    if (res.rows.length === 0) {
      console.log(`User '${username}' already exists. No changes made.`);
    } else {
      console.log("Created user:", res.rows[0]);
    }
  } catch (err) {
    console.error("Failed to create admin user:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
