const express = require("express");
const router = express.Router();
const { showAll } = require("../controllers/api_controller");

router.get("/teenyurls", showAll);

module.exports = router;
