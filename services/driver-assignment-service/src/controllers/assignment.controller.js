const service = require("../services/assignment.service");
async function create(req, res, next) {
  try {
    return res.status(201).json(await service.create(req.body));
  } catch (error) {
    return next(error);
  }
}
async function get(req, res, next) {
  try {
    const item = await service.get(req.params.assignmentId);
    return item ? res.json(item) : res.status(404).json({ code: "NOT_FOUND" });
  } catch (error) {
    return next(error);
  }
}
async function update(req, res, next) {
  try {
    return res.json(
      await service.update(req.params.assignmentId, req.body.status),
    );
  } catch (error) {
    return next(error);
  }
}
module.exports = { create, get, update };
