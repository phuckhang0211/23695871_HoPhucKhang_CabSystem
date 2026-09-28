const db = require("../config/database");

async function createUser({ name, phone, email, role, passwordHash }) {
  const { rows } = await db.query(
    "INSERT INTO users (name, phone, email, role, password_hash) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [name, phone, email || null, role, passwordHash],
  );
  return rows[0];
}
async function findByIdentifier(identifier) {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE email = $1 OR phone = $1",
    [identifier],
  );
  return rows[0];
}
function present(user) {
  return {
    id: user.user_id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}
module.exports = { createUser, findByIdentifier, present };
