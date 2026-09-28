const crypto = require("node:crypto");
const db = require("../config/database");
const create = async (data) =>
  (
    await db.query(
      "INSERT INTO notifications (notification_id, recipient_id, type, title, message) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        crypto.randomUUID(),
        data.recipientId,
        data.type,
        data.title,
        data.message,
      ],
    )
  ).rows[0];
const list = async (recipientId) =>
  (
    await db.query(
      "SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY created_at DESC",
      [recipientId],
    )
  ).rows;
const update = async (id, isRead) =>
  (
    await db.query(
      "UPDATE notifications SET is_read = $1 WHERE notification_id = $2 RETURNING *",
      [isRead, id],
    )
  ).rows[0];
module.exports = { create, list, update };
