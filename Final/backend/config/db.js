// config/db.js
const { Pool } = require("pg");

// Create a singleton pool and read config from environment variables for Neon/Vercel
// Supported envs:
// - DATABASE_URL: full Postgres connection string (recommended)
// - PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT
// Neon usually requires SSL in production.

let pool; // singleton across serverless invocations

function createPool() {
  const {
    DATABASE_URL,
    PGHOST,
    PGUSER,
    PGPASSWORD,
    PGDATABASE,
    PGPORT,
    NODE_ENV,
  } = process.env;

  const usingConnectionString = !!DATABASE_URL;

  // Enable SSL automatically on production or when using Neon
  const sslRequired =
    NODE_ENV === "production" ||
    (DATABASE_URL && /neon\.tech/.test(DATABASE_URL));

  const config = usingConnectionString
    ? {
        connectionString: DATABASE_URL,
        ssl: sslRequired ? { rejectUnauthorized: false } : false,
      }
    : {
        host: PGHOST || "localhost",
        user: PGUSER || "postgres",
        password: PGPASSWORD || "1",
        database: PGDATABASE || "smartbizadmin",
        port: PGPORT ? Number(PGPORT) : 5432,
        ssl: sslRequired ? { rejectUnauthorized: false } : false,
      };

  return new Pool(config);
}

if (!globalThis._smartbizPgPool) {
  globalThis._smartbizPgPool = createPool();
}

pool = globalThis._smartbizPgPool;

module.exports = pool;
