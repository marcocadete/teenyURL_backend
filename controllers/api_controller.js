const TeenyURL = require("../models/teenyURL");
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
