const express = require("express");
const router = express.Router();
const { addSenderId, getSenderIds, deleteSenderId } = require("../../controllers/admin/senderIdController");

router.post("/add", addSenderId);
router.get("/", getSenderIds);
router.delete("/:id", deleteSenderId);

module.exports = router;
