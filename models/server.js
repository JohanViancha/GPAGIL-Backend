const express = require('express')
const cors = require('cors');
const dbConnection = require('../database/config');
const pool = require('../database/config');
class Server{

    constructor(){
        this.app = express()
        this.port = process.env.PORT;

        this.usersPath="/api/users";

        //Conectar a base de datos
        this.conectarDB();
        
        //Middlewares
        this.middleeares();
        
        //Rutas de la aplicación
        this.routes();


    }

    conectarDB(){
        pool.connect().then(res=>{
            console.log('Conexión de base de datos establecida')
        })
    }

    middleeares(){
        //CORS
        this.app.use(cors());

        //Lectura y perseo del body
        this.app.use(express.json())

        //Directorio publico
        this.app.use(express.static('public'))
    }

    routes(){
        this.app.use(this.usersPath, require('../routes/user'))
    }


    listen(){
        this.app.listen(this.port,()=>{
            console.log("El servidor está corriendo ", this.port);
        })
    }
}

module.exports = Server