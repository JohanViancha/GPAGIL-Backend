const { response, request } = require('express');
const pool = require('../database/config');
const { param } = require('../routes/task');

const getUsersAll = async (req = request, res = response) =>{

    const restUsers = await pool.query('select * from users')
    res.status(200).json(
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
        res.status(200).json({                
                msg: "El email y el password son requeridos",
                state: 'requerid'
            }  
         );
    }else{
        const restUser = await pool.query(`select id_user, email_user, img_user, lastname_user, name_user from users where email_user='${email}' and password_user='${password}'`)
        
        if(restUser.rows.length === 0){
            res.status(200).json({           
                msg: "El usuario o la contraseña son incorrectos",
                state: 'incorrect'
            }  
         );
        }else{
            res.status(200).json({  
                user: restUser.rows[0],
                state: 'correct'
            });
        }     
    }
}


const createUser = async (req = request, res = response) =>{
    const {name, lastname,email,password,img='img.png'} = req.body;

    try{
        const result = await pool.query(`insert into users 
        (name_user,lastname_user, email_user, 
        password_user, img_user) 
        values ('${name}', '${lastname}',
        '${email}','${password}','${img}')`);

        if(!name || !lastname || !email || !password){
            res.status(200).json({
                state:'requerid',
                msg:"El nombre, apellido, email y password son obligatorios"
            });

        }

        if(result.rowCount === 1){
            res.status(200).json({
                state:'correct',
                msg:"El usuario ha sido creado"
            });
        }else{
            res.status(500).json({
                state:'error',
                msg:"No se pudo insertar el usuario"
            });  
        }
    }catch(error){
        console.log(error)
        if(error.constraint === 'email_unique'){
            res.status(400).json({
                state:'email_unique',
                msg: `El correo ${email} ya existe`
            });
        }
       
    }
}

const getUserByProject = async (req = request, res = response)=> {
    const {idProyect} =  req.body;

    const users = await pool.query(`select us.id_user, us.name_user, us.lastname_user from users us inner join users_projects uspro on us.id_user = uspro.id_user
    where uspro.id_project = ${idProyect}`)
    res.status(200).json(
        users.rows
    );
}
       
module.exports = {
    getUsersAll,
    getUserByAuthentication,
    getUserById,
    createUser,
    getUserByProject
}