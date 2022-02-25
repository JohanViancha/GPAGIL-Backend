require('dotenv').config();
const { Pool } = require("pg")

const dbConnection = async() =>{
    try{
        const pool = new Pool({
            user: process.env.dbuser,
            host: process.env.dbhost,
            database: process.env.dbname,
            password: process.env.dbpassword,
            port: process.env.dbport
        })    
        
        console.log('Conexión establecida con la base de datos')
        return pool;
    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de establecer la conexión con la base de datos')
    }
}


const getUser = async () =>{
    const restUsers = await pool.query('select * from users');
    console.log(restUsers.rows);
}
module.exports = dbConnection;
