const express = require("express");
const app = express();
const port = 4000;
const apiRoutes = require("./routes/api_routes");

//# Headers
app.disable("x-powered-by");

//# Cors
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

//# Middleware
app.use(express.json()); // for parsing application/json

//# Routes
app.use("/api/v1/", apiRoutes);

//# Error Middleware
app.use((err, req, res, next) => {
    let message = "Internal Error";
    let status = 500;
    let errors = [];

    if (err.status && err.message) {
        res.status(err.status);
        message = err.message;
        status = err.status;

        if (err.errors.length !== 0) {
            errors = err.errors;
        }
    } else {
        res.status(500);
    }

    res.json({
        message,
        status,
        errors,
    });
});

const server = app.listen(port, () => {
    console.log(`Demo app listening on port ${port}`);
    console.log(`In ${process.env.NODE_ENV}`);
});

module.exports = server;
