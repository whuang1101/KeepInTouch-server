const router = require("express").Router()
const friendRequest = require("../controllers/friendRequestController");

router.post("/", friendRequest.post);
router.post("/accept",friendRequest.acceptPost);
router.post("/decline", friendRequest.declinePost)
router.get("/pending/:id", friendRequest.getPendingRequests)
router.get("/:id", friendRequest.get);
module.exports = router;