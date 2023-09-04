const router = require("express").Router()
const userController = require("../controllers/userController");

router.post("/", userController.createUser);
router.get("/email/:email",userController.verifyEmail);
router.get("/username/:username",userController.verifyUsername);
router.get("/:id", userController.getAllPotentialFriends);
router.get("/friends/:id", userController.getAllFriends);
router.get("/friend/:id",userController.getOne)
module.exports = router;