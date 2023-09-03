const router = require("express").Router();
const routerController = require("../controllers/messageController");
router.post("/", routerController.postPrivateMessage);
router.get("/:senderId/:recipientId",routerController.getAllMessages);
module.exports = router;