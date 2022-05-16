const { response, request } = require('express');
const pool = require('../database/config');


const getProjectsAll = async (req=request, res=response)=>{

    const projects = await pool.query('select * from projects')

    res.status(200).json(
        projects.rows
    );
}

const getProjectByUsuario = async(req=request, res=response)=>{

    const {idProject}  = req.body;

    if(!idProject){
        res.status(200).json({                
                msg: "Error al tratar de listar los proyectos del usuario",
                state: 'requerid'
            }  
         );
    }
    const projects = await pool.query(`select * from projects pr inner join users_projects userpro 
    on pr.id_project = userpro.id_project where userpro.id_user = ${idProject}`);

    res.status(200).json(
        projects.rows
     );
}


module.exports ={
    getProjectsAll,
    getProjectByUsuario
}