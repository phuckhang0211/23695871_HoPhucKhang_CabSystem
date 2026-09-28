const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function waitForDatabase(attempts = 30) {
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
pool.waitForDatabase = waitForDatabase;
module.exports = pool;
