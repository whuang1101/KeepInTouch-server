const router = require("express").Router()
const userController = require("../controllers/userController");

router.get("/:id", userController.getAllPotentialFriends);
router.get("/friends/:id", userController.getAllFriends);

module.exports = router;