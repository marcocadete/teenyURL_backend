const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { showAll, showOne, createOne } = require("../controllers/api_controller");
const {validateRequestBody, validateRequestParams} = require("../validation/teenyURL");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        message: "Too many requests",
        status: 429,
        errors: [{msg: "Too many requests, Please try again later."}]
    }
});

router.get("/teenyurls", showAll);

router.get("/teenyurls/:alias", validateRequestParams, showOne);

router.post("/shorten", apiLimiter, validateRequestBody, createOne);

module.exports = router;
