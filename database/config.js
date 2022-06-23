require('dotenv').config();
const pg = require("pg")

const pool = new pg.Client({
    user: process.env.dbuser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbpassword,
    port: process.env.dbport,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.connect();
module.exports = pool;
