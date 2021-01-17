require("dotenv").config();    
const mysql = require("mysql2");    
    
let config = {};

switch (process.env.NODE_ENV) {
    case "test":
        config.DB_HOST = process.env.TEST_DB_HOST;    
        config.DB_USER = process.env.TEST_DB_USER;    
        config.DB_PASSWORD = process.env.TEST_DB_PASSWORD;
        config.DB_DATABASE = process.env.TEST_DB_DATABASE;
       break;    
    case "development":
        config.DB_HOST = process.env.DEV_DB_HOST;
        config.DB_USER = process.env.DEV_DB_USER;
        config.DB_PASSWORD = process.env.DEV_DB_PASSWORD;
        config.DB_DATABASE = process.env.DEV_DB_DATABASE;
        break;    
    case "production":
        config.DB_HOST = process.env.PROD_DB_HOST;
        config.DB_USER = process.env.PROD_DB_USER;
        config.DB_PASSWORD = process.env.PROD_DB_PASSWORD;
        config.DB_DATABASE = process.env.PROD_DB_DATABASE;
        break;    
    default:
        config.DB_HOST = process.env.DEV_DB_HOST;
        config.DB_USER = process.env.DEV_DB_USER;
        config.DB_PASSWORD = process.env.DEV_DB_PASSWORD;
        config.DB_DATABASE = process.env.DEV_DB_DATABASE;    
}    
    
const pool = mysql.createPool({    
    host: config.DB_HOST,    
    user: config.DB_USER,    
    password: config.DB_PASSWORD,    
    database: config.DB_DATABASE,    
});    
    
module.exports = pool.promise();
