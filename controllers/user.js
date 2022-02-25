const { response } = require('express');

const userGet = (req, res) =>{
    res.json({
        msg:'get APIff -controlador'
    });
}

const userPost =(req, res) =>{
    res.json({
        msg:'post APIff - controlador'
    });
}

const userPut = (req, res) =>{
    res.json({
        msg:'put APIff - controlador'
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