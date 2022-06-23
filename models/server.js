require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dbConnection = require('../database/config');
const pool = require('../database/config');
const corsOpts = {
    origin: '*',
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE'
    ],  
    allowedHeaders: [
      'Content-Type',
    ],
  };



class Server{

    constructor(){
        this.app = express()
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server,{
            cors:{
                origin: '*',
                credentials:true,
                methods:['GET','POST']
            }
        })

        this.usersPath="/api/users";
        this.projectsPath = "/api/projects";
        this.taskPath = "/api/tasks";
        this.chatPath = "/api/chats";
   

        //Socket
        this.sockets();

        //Middlewares
        this.middleeares();
        
        //Rutas de la aplicación
        this.routes();


    }

    middleeares(){
        //CORS
        this.app.use(cors(corsOpts));

        //Lectura y perseo del body
        this.app.use(express.json())

        //Directorio publico
        this.app.use(express.static('public'))
    }


    routes(){
        this.app.use(this.usersPath, require('../routes/user'))
        this.app.use(this.projectsPath, require('../routes/project'))
        this.app.use(this.taskPath, require('../routes/task'))
        this.app.use(this.chatPath, require('../routes/chat'))
    }

    sockets(){        
        this.io.on('connection', (socket) => {
            console.log('Conectado')
            socket.on('sendMessageByProjectUser',({idUserProject, message})=>{
                axios.post(`${process.env.url}${this.chatPath}/sendMessageByProjectUser`,{idUserProject,message})
                .then(response => {
                    if(response.data.updateState){
                        axios.get(`${process.env.url}${this.chatPath}/getAllMessage`)
                        .then((response)=>{
                            socket.emit("getAllMessage",response.data);
                            socket.broadcast.emit("getAllMessage",response.data);
                        })

                    }else{
                        console.log(response.data.message)
                    }
                   
                })      
                     
            })


        socket.on('getAllMessage',()=>{
                axios.get(`${process.env.url}${this.chatPath}/getAllMessage`)
                .then((response)=>{
                    socket.emit("getAllMessage",response.data);
                    socket.broadcast.emit("getAllMessage",response.data);
                })
            })      
                     
        });
  
    }

    listen(){
        this.server.listen(this.port || 3000,()=>{
            console.log("El servidor está corriendo ", this.port);
        })

    }
}


module.exports = Server