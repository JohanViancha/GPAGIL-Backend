const { response, request } = require('express');
const pool = require('../database/config');

const userGetAll = async (req = request, res = response) =>{

    const restUsers = await pool.query('select * from users')
    res.json(
        restUsers.rows
    );
}

const userPost =(req, res) =>{

    const {nombre, edad} = req.body;

    res.json({
        msg:'post APIff - controlador',
        nombre,
        edad
    });
}

const userPut = (req, res) =>{

    const id = req.params.id;
    res.json({
        msg:'put APIff - controlador' + id
    });
}

const userDelete = (req, res) =>{
    res.json({
        msg:'delete APIff - controlador'
    });
}
module.exports = {
    userPost,
    userPut,
    userDelete,
    userGetAll
}