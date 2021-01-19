const express = require("express");
const router = express.Router();
const { showAll, showOne, createOne } = require("../controllers/api_controller");
const {validateRequestBody, validateRequestParams} = require("../validation/teenyURL");

router.get("/teenyurls", showAll);

router.get("/teenyurls/:alias", validateRequestParams, showOne);

router.post("/shorten", validateRequestBody, createOne);

module.exports = router;
