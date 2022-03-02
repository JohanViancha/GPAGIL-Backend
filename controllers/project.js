const { response, request } = require('express');
const pool = require('../database/config');


const getProjectsAll = async (req=request, res=response)=>{

    const projects = await pool.query('select * from projects')

    res.status(200).json(
        projects.rows
    );
}


module.exports ={
    getProjectsAll
}