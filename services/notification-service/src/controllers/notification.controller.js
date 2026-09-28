const service = require("../services/notification.service");
async function create(req, res, next) {
  try {
    return res.status(201).json(await service.create(req.body));
  } catch (error) {
    return next(error);
  }
}
async function list(req, res, next) {
  try {
    return res.json({ data: await service.list(req.query.recipientId) });
  } catch (error) {
    return next(error);
  }
}
async function update(req, res, next) {
  try {
    return res.json(
      await service.update(req.params.notificationId, Boolean(req.body.isRead)),
    );
  } catch (error) {
    return next(error);
  }
}
module.exports = { create, list, update };
