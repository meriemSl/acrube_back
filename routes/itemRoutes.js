const express = require("express");
const { getOriginUrl, createUrl } = require("../controllers/itemController");

const router = express.Router();

router.get("/:shortened_id", getOriginUrl);
router.post("/createUrl", createUrl);

module.exports = router;