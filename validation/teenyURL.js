const { body, param } = require("express-validator");
const TeenyURL = require("../models/teenyURL");

const validateRequestBody = [
    body("alias")
        .isLength({ min: 1, max: 20 })
        .withMessage(
            "An alias between 1 and 20 characters in length, is required."
        )
        .bail()
        .custom((value) => {
            return TeenyURL.findByAlias(value).then(([rows]) => {
                if (rows.length !== 0) {
                    return Promise.reject("Alias already in use");
                }
            });
        }),
    body("long_url")
        .isURL({
            require_protocol: true,
            require_valid_protocol: true,
            protocols: ["http", "https"],
        })
        .withMessage(
            "A valid url is required. Excepted protocols: [http, https]."
        ),
];

const validateRequestParams = [param("alias").isLength({ min: 1, max: 20 }).withMessage("Alias exceeds 20 character limit.")];

module.exports = {
    validateRequestBody,
    validateRequestParams,
};
