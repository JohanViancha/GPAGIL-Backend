const { response, request } = require('express');
const pool = require('../database/config');


const getTaskByProject = async (req=request, res=response)=>{

    try{
        const {idProject}  = req.body;
        const tasks = await pool.query(`select * from tasks task inner join projects pro on task.id_project = pro.id_project 
        inner join users us on us.id_user = task.id_user_task where pro.id_project = ${idProject}`)
    
        const subTasks = await pool.query(`select id_subtask, task.id_task, name_subtask, 
        time_subtask, state_subtask from tasks task inner join projects pro 
        on task.id_project = pro.id_project inner join subtasks sub on 
        sub.id_task = task.id_task where pro.id_project = ${idProject}`)
        
        res.status(200).json({

           'tasks': tasks.rows,
            'subtasks': subTasks.rows
            }
        );
    }catch(err){
        console.log(err)

    }
   
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
        console.log(assignment);
        const task = await pool.query(`insert into tasks (id_project,id_user_task, name_task,
        description_task, state_task,assignment_date_task,end_date_task, priority_task) values (${idProject},
        ${assignment}, '${nameTask}','${descriptionTask}','1', NOW(),'${dateEnd}','${priorityTask}') RETURNING id_task`)
      
        if(task.rowCount === 1){
           subTasks.forEach( async (element) => {
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
    where us.id_user =${idUser} and state_task in ('1','2','3') group by priority_task 
        `)

    res.status(200).json(
        tasks.rows
    );
}

const updateStateSubTask = async (req=request, res=response)=>{

    const {idSubTask}  = req.body;
    const tasks = await pool.query(`update subtasks set state_subtask = true where id_subtask = ${idSubTask}`)

    if(tasks.rowCount === 1){
        res.status(200).json({
            'rowCount': tasks.rowCount,
            'updateState':true,
            'message': "El estado de la subtarea ha sido modificada"
            }
        );
    }else{
        res.status(200).json({
            'rowCount': tasks.rowCount,
            'updateState':false,
            'message': "Error al cambiar el estado de la subtarea ha sido modificada"
            }
        );
    }
   
}


const getTaskByAssignment = async (req=request, res=response)=>{
   

    try{
        const {idUser}  = req.body;
        const tasks = await pool.query(`select tas.id_user_task,pro.id_project, pro.name_project, 
        tas.name_task, case when tas.state_task='1' then 'Por hacer'
        when tas.state_task='2' or tas.state_task='3' then 'Haciendo'
        end as state_task, case when priority_task='1' then 'Baja'
        when priority_task='2' then 'Media'
        else 'Alta' end as priority_task,tas.end_date_task
        from tasks tas inner join projects pro on tas.id_project = pro.id_project
        where tas.id_user_task =${idUser} and tas.state_task != '4'`)
        res.status(200).json(
           tasks.rows,
            
        );
    }catch(err){
        console.log(err)
    }
   
}



module.exports ={
    getTaskByProject,
    updateStateTaskBy,
    createTask,
    getTaskPriorityByUser,
    updateStateSubTask,
    getTaskByAssignment
    
}