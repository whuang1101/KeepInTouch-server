const router = require("express").Router()
const friendRequest = require("../controllers/friendRequestController");

router.post("/", friendRequest.post);


module.exports = router;