const { response, request } = require('express');
const pool = require('../database/config');
const {sendMail} = require('../mail/config');


const getProjectsAll = async (req=request, res=response)=>{

    const projects = await pool.query('select * from projects')
    res.status(200).json(
        projects.rows
    );
}

const getProjectByUsuario = async(req=request, res=response)=>{

    const {idUsuario}  = req.body;

    if(!idUsuario){
        res.status(200).json({                
                msg: "Error al tratar de listar los proyectos del usuario",
                state: 'requerid'
            }  
         );
    }
    const projects = await pool.query(`select * from projects pr inner join users_projects userpro 
    on pr.id_project = userpro.id_project where userpro.id_user = ${idUsuario}`);

    res.status(200).json(
        projects.rows
     );
}


const createProject = async (req=request, res=response)=>{
    
    try{  
        const {nameProject, descriptionProject, assignment, dateEnd, idUser}  = req.body;

        console.log(req.body);
        const project = await pool.query(`insert into projects (name_project,
        description_project, state_project,startdate_project,enddate_project,id_user_admin) 
        values ('${nameProject}','${descriptionProject}','1', NOW(),'${dateEnd}',${idUser}) RETURNING id_project`)

        if(project.rowCount === 1){

            await assignment.forEach(async ({id_user})=>{
                await pool.query(`insert into users_projects (id_project, id_user)
                values (${project.rows[0].id_project}, ${id_user})`)
            })

            const emailsAtSend = assignment.map(({email_user})=>email_user).join(",");

            const sendEmailUser = await sendMail({
                from: 'Asignación de proyecto', // sender address
                to: emailsAtSend, // list of receivers
                subject: "Asignación de proyecto", // Subject line
                html: `<b>Hola,te han incluido en el proyecto ${nameProject}</b>`, // html body
            })

                res.status(200).json({
                    'rowCount': project.rowCount,
                    'updateState':true,
                    'message': "El proyecto ha sido creado, hemos enviado correos a los usuarios notificando la partipación en este proyecto"
                    }
                );
            
        }else{
            res.status(500).json({
                'rowCount': project.rowCount,
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
    getProjectsAll,
    getProjectByUsuario,
    createProject
}