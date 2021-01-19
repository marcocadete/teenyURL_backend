const TeenyURL = require("../models/teenyURL");
const { validationResult } = require("express-validator");
const {
    badRequest,
    internalServerError,
    notFound,
} = require("../helpers/errors");

exports.showAll = async (req, res, next) => {
    try {
        const page = req.query.page || "0";
        // LIMIT is set to 50 on the SQL query. Check the model class.
        const limit = req.query.limit || "50"; // Defaults to 50 per page
        let offset = parseInt(page) * parseInt(limit);
        offset = offset.toString();
        const [rows] = await TeenyURL.fetchAll(limit, offset);
        res.json({ teenyURLs: rows });
    } catch (err) {
        console.log(err);
        next(internalServerError);
    }
};

exports.showOne = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(badRequest(errors.array()));
    }

    try {
        const [rows] = await TeenyURL.findByAlias(req.params.alias);

        if (rows.length === 0) {
            return next(notFound());
        }

        res.json(rows[0]);
    } catch (err) {
        console.log(err);
        next(internalServerError);
    }
};

exports.createOne = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(badRequest(errors.array()));
    }

    try {
        const teenyURL = new TeenyURL();
        teenyURL.alias = req.body.alias;
        teenyURL.long_url = req.body.long_url;

        await teenyURL.save();
        const [rows] = await TeenyURL.findByAlias(teenyURL.alias);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.log(err);
        next(internalServerError);
    }
};
