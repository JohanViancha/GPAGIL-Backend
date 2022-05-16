const { response, request } = require('express');
const pool = require('../database/config');


const getTaskByProject = async (req=request, res=response)=>{

    const {idProject}  = req.body;
    const tasks = await pool.query(`select * from tasks task inner join projects pro on task.id_project = pro.id_project 
    where pro.id_project = ${idProject}`)

    res.status(200).json(
        tasks.rows
    );
}

module.exports ={
    getTaskByProject
}