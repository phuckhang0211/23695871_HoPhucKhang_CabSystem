const crypto = require("node:crypto");
const db = require("../config/database");
const createIncident = async (data) =>
  (
    await db.query(
      "INSERT INTO incidents (incident_id, resource_type, resource_id, type, description) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        crypto.randomUUID(),
        data.resourceType,
        data.resourceId,
        data.type,
        data.description,
      ],
    )
  ).rows[0];
const listIncidents = async () =>
  (await db.query("SELECT * FROM incidents ORDER BY created_at DESC")).rows;
module.exports = { createIncident, listIncidents };
