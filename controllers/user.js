const { response, request } = require('express');

const userGet = (req = request, res) =>{
    const params = req.query;

    res.json({
        msg:'get APIff -controlador',
        params
    });
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
    userGet
}