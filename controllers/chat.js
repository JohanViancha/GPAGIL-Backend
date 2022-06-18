const { response, request } = require('express');
const pool = require('../database/config');


const getMessageByProjectUser = async(req=request, res=response)=>{

    const {idProject}  = req.body;

    const messages = await pool.query(`select chat.message, chat.datetime_send, us.name_user, us.lastname_user from chat_message chat inner join users_projects
    userproj on chat.id_user_projects = userproj.id_user_project 
    inner join users us on us.id_user = userproj.id_user
    where userproj.id_project = ${idProject}`);

    res.status(200).json(
        messages.rows
     );
}


const getAllMessage = async(req=request, res=response)=>{

    const messages = await pool.query(`select chat.message, chat.datetime_send, us.name_user, us.lastname_user,userproj.id_project  from chat_message chat inner join users_projects
    userproj on chat.id_user_projects = userproj.id_user_project 
    inner join users us on us.id_user = userproj.id_user`);

    res.status(200).json(
        messages.rows
     );
}



const sendMessageByProjectUser = async(req=request, res=response)=>{

    try{
        const {idUserProject,message}  = req.body
        const messages = await pool.query(`insert into chat_message (id_user_projects, 
            message, datetime_send) values (${idUserProject}, '${message}', NOW())`);
    
        
        if(messages.rowCount>0){
            res.status(200).json({
                'rowCount': messages.rowCount,
                'updateState':true,
                'message': 'Mensaje guardado'
                }
            );
        }else{
            res.status(500).json({
                'rowCount': 0,
                'updateState':false,
                'message':'Error al guardar el mensaje'
                }
            );
        }    

    }catch(err){
        console.log(err)
        res.status(500).json({
            'rowCount': 0,
            'updateState':false,
            'message': idUserProject
            }
        );

    }
 
}

module.exports ={
    getMessageByProjectUser,
    sendMessageByProjectUser,
    getAllMessage
}