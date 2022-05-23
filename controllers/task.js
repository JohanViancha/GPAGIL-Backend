const { response, request } = require('express');
const pool = require('../database/config');


const getTaskByProject = async (req=request, res=response)=>{

    const {idProject}  = req.body;
    const tasks = await pool.query(`select * from tasks task inner join projects pro on task.id_project = pro.id_project 
    inner join users us on us.id_user = task.id_user_task where pro.id_project = ${idProject}`)

    res.status(200).json(
        tasks.rows
    );
}

const updateStateTaskBy = async (req=request, res=response)=>{

    const {idTask, state}  = req.body;
    const tasks = await pool.query(`update tasks set state_task = ${state} where id_task = ${idTask}`)

    if(tasks.rowCount === 1){
        res.status(200).json({
            'rowCount': tasks.rowCount,
            'updateState':true,
            'message': "El estado de la tarea ha sido modificada"
            }
        );
    }
   
}

const createTask = async (req=request, res=response)=>{

    try{  
        const {nameTask, descriptionTask, assignment, dateEnd, idProject}  = req.body;
        console.log(nameTask);
        const task = await pool.query(`insert into tasks (id_project,id_user_task, name_task,
        description_task, state_task,assignment_date_task,end_date_task) values (${idProject},
        ${assignment}, '${nameTask}','${descriptionTask}','1', NOW(),'${dateEnd}')`)
      
        if(task.rowCount === 1){
            res.status(200).json({
                'rowCount': task.rowCount,
                'updateState':true,
                'message': "La tarea ha sido creada"
                }
            );
        }else{
            res.status(500).json({
                'rowCount': task.rowCount,
                'updateState':false,
                'message': "Error al crear la tarea"
                }
            );
        }

    }catch(err){
        res.status(400).json({
            'rowCount': 0,
            'updateState':false,
            'message': err.message
            }
        );
    }
   
   
}

module.exports ={
    getTaskByProject,
    updateStateTaskBy,
    createTask
}