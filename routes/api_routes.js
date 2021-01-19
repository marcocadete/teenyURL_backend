const express = require("express");
const router = express.Router();
const { showAll, showOne } = require("../controllers/api_controller");
const {validateRequestBody, validateRequestParams} = require("../validation/teenyURL");

router.get("/teenyurls", showAll);

router.get("/teenyurls/:alias", validateRequestParams, showOne);

module.exports = router;
