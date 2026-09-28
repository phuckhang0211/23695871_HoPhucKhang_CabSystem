const db = require("../config/database");

const getProfile = async (userId) =>
  (await db.query("SELECT * FROM profiles WHERE user_id = $1", [userId]))
    .rows[0];

const saveProfile = async (userId, data) =>
  (
    await db.query(
      `
      INSERT INTO profiles (
        user_id,
        display_name,
        phone,
        email,
        updated_at
      )
      VALUES ($1, $2, $3, $4, NOW())

      ON CONFLICT (user_id)
      DO UPDATE SET
        display_name = EXCLUDED.display_name,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        updated_at = NOW()

      RETURNING *
      `,
      [userId, data.displayName, data.phone || null, data.email || null],
    )
  ).rows[0];

module.exports = {
  getProfile,
  saveProfile,
};
