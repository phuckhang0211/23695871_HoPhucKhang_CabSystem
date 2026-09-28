const service = require("../services/operations.service");
async function createIncident(req, res, next) {
  try {
    return res.status(201).json(await service.createIncident(req.body));
  } catch (error) {
    return next(error);
  }
}
async function listIncidents(req, res, next) {
  try {
    return res.json({ data: await service.listIncidents() });
  } catch (error) {
    return next(error);
  }
}
module.exports = { createIncident, listIncidents };
