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
                origin:true,
                credentials:true,
                methods:["GET","POST"]
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
            socket.on('getMessageByProjectUser',(idProject)=>{
                axios.post(`${process.env.url}${this.chatPath}/getMessageByProjectUser`,{idProject})
                .then(response => {
                    socket.emit("getMessageByProjectUser",response.data);
                })           
            })

            socket.on('sendMessageByProjectUser',({idUserProject, message})=>{
                console.log(message);
                axios.post(`${process.env.url}${this.chatPath}/sendMessageByProjectUser`,{idUserProject,message})
                .then(response => {
                    socket.emit("sendMessageByProjectUser",message);
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