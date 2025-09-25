// migrate.js
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pg;

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });

  await client.connect();

  // installations: one per oauth install
  await client.query(`
    CREATE TABLE IF NOT EXISTS installations (
      id SERIAL PRIMARY KEY,
      account_id TEXT,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // board_tokens: map monday board_id -> installation.id
  await client.query(`
    CREATE TABLE IF NOT EXISTS board_tokens (
      id SERIAL PRIMARY KEY,
      board_id BIGINT UNIQUE NOT NULL,
      installation_id INTEGER REFERENCES installations(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("✅ Migrations complete.");
  await client.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
