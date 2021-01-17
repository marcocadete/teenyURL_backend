const express = require("express");
const app = express();
const port = 4000;

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

const server = app.listen(port, () => {
    console.log(`Demo app listening on port ${port}`);
    console.log(`In ${process.env.NODE_ENV}`);
});

module.exports = server;
