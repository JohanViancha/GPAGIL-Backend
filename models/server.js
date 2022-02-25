const express = require('express')

class Server{

    constructor(){
        this.app = express()
        this.port = process.env.PORT;
        
        //Middlewares
        this.middleeares();
        
        //Rutas de la aplicación
        this.routes();


    }

    middleeares(){
        this.app.use(express.static('public'))
    }

    routes(){
        this.app.get('/api',(req, res) =>{
            res.json({
                msg:'get APIff'
            });
        })  
        
        this.app.put('/api',(req, res) =>{
            res.json({
                msg:'put APIff'
            });
        })   


        this.app.post('/api',(req, res) =>{
            res.json({
                msg:'post APIff'
            });
        })   


        this.app.delete('/api',(req, res) =>{
            res.json({
                msg:'delete APIff'
            });
        })   
    }


    listen(){
        this.app.listen(this.port,()=>{
            console.log("El servidor está corriendo ", this.port);
        })
    }
}

module.exports = Server