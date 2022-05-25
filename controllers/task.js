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
        const {nameTask, descriptionTask, assignment, dateEnd,priorityTask,subTasks, idProject}  = req.body;
        console.log(nameTask);
        const task = await pool.query(`insert into tasks (id_project,id_user_task, name_task,
        description_task, state_task,assignment_date_task,end_date_task, priority_task) values (${idProject},
        ${assignment}, '${nameTask}','${descriptionTask}','1', NOW(),'${dateEnd}','${priorityTask}') RETURNING id_task`)
      
        if(task.rowCount === 1){

            console.log(task.rows[0].id_task);
           subTasks.forEach( async (element) => {
               console.log(element);
                const subTask = await pool.query(`insert into subtasks
                 (id_task,name_subtask) values (${task.rows[0].id_task}, 
                '${element.name}') `)

            });

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

const getTaskPriorityByUser= async (req=request, res=response)=>{
    const {idUser}  = req.body;
    const tasks = await pool.query(`
    select 
    case when priority_task='1' then 'Baja'
     when priority_task='2' then 'Media'
     else 'Alta' end as name, count(*) as value from tasks task inner join 
        users us on us.id_user = task.id_user_task 
    where us.id_user =${idUser} and state_task in ('1','2') group by priority_task 
        `)

    res.status(200).json(
        tasks.rows
    );
}

module.exports ={
    getTaskByProject,
    updateStateTaskBy,
    createTask,
    getTaskPriorityByUser
}