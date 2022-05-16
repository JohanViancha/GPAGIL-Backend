require('dotenv').config();
const { Pool } = require("pg")

const pool = new Pool({
   
    user: "lvvempajnfazbg",
    host: "ec2-44-194-113-156.compute-1.amazonaws.com",
    database: "d54hnu2gtgpau1",
    password: "54a9e63e1fe11b73a1500856714ed4422a12efee1a7c7ee86c6085c2307bce44",
    port: "5432",
    ssl: {
        rejectUnauthorized: false
    },
});


module.exports = pool;
