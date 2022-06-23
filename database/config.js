require('dotenv').config();
const { Pool } = require("pg")

const pool = new Pool({
    user: process.env.dbuser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbpassword,
    port: process.env.dbport,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});


module.exports = pool;
