const { response, request } = require('express');
const pool = require('../database/config');

const getUsersAll = async (req = request, res = response) =>{

    const restUsers = await pool.query('select * from users')
    res.json(
       restUsers.rows
    );
}

const getUserById = async (req = request, res = response) =>{
    const id  = req.params.id;

    if(!id){
        res.status(400).json({              
                msg: "El es id del usuario es requerido"
            }  
         );
    }else{

        try{
            const restUser = await pool.query(`select * from users where id_user=${id}`)
        
            if(restUser.rows.length === 0){
                res.status(400).json({              
                    msg: "El id recibido no existe"
                }  
             );
            }else{
                res.json(restUser.rows[0]);
            }
        }catch(err){
            res.status(400).json({              
                msg: "El id recibido es incorrecto"
            });
        }
        
        
    }
    
}



const getUserByAuthentication = async (req = request, res = response) =>{
    const {email,password}  = req.body;
    
    if(!email || !password){
        res.status(400).json({              
                msg: "El email y el password son requeridos"
            }  
         );
    }else{
        const restUser = await pool.query(`select * from users where email_user='${email}' and password_user='${password}'`)
        console.log(restUser.rows.length);
        if(restUser.rows.length === 0){
            res.status(400).json({              
                msg: "El usuario o la contraseña son incorrectos"
            }  
         );
        }
        res.json(restUser.rows[0]);
    }
    
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
    getUsersAll,
    getUserByAuthentication,
    getUserById
}