const express = require('express')
const cors = require('cors');
class Server{

    constructor(){
        this.app = express()
        this.port = process.env.PORT;

        this.usersPath="/api/users";
        
        //Middlewares
        this.middleeares();
        
        //Rutas de la aplicación
        this.routes();


    }

    middleeares(){
        //CORS
        this.app.use(cors());

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