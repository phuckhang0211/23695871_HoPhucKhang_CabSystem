const { Pool } = require("pg");

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.DB_POOL_SIZE || 10),
  });
}

async function waitForDatabase(pool, attempts = 30) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

const pool = createPool();
pool.createPool = createPool;
pool.waitForDatabase = (attempts = 30) => waitForDatabase(pool, attempts);

module.exports = pool;
