const { response, request } = require('express');
const res = require('express/lib/response');
const pool = require('../database/config');
const {sendMail} = require('../mail/config');

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
        const restUser = await pool.query(`select id_user, email_user, img_user, lastname_user, name_user, verify_user,id_role from users where email_user='${email}' and password_user='${password}'`)
        
        if(restUser.rows.length === 0){
            res.status(200).json({           
                msg: "El usuario o la contraseña son incorrectos",
                state: 'incorrect'
            }  
         );
        }else if(!restUser.rows[0].verify_user){

            res.status(200).json({           
                msg: "El usuario aun no ha sido verificado",
                state: 'no-verify'
            });

        }else{
            res.status(200).json({  
                user: restUser.rows[0],
                state: 'correct'
            });
        }     
    }
}

const verifyUser = async (req = request, res = response)=>{
    try{
        const {idUser} = req.body;
        console.log(idUser);
        if(idUser){
            const result = await pool.query(`update users set verify_user = true 
            where id_user = ${idUser} RETURNING name_user,lastname_user`);

            if(result.rowCount === 1){

                res.status(200).json({
                    'rowCount': result.rowCount,
                    'updateState':true,
                    'message': "La cuenta ha sido verificada"
                    }
                );
            }else{
                res.status(200).json({
                    'rowCount': 0,
                    'updateState':false,
                    'message': "La cuenta no ha sido verificada, por favor comuniquese con soporte"
                });
            }
        }
        
    }catch(err){
        res.status(200).json({
            'rowCount': 0,
            'updateState':false,
            'message': err.message
        });
    }
    
}


const createUser = async (req = request, res = response) =>{
    const {name_user, lastname_user,email_user,password_user,img='img.png',tipo_user} = req.body;

    try{
       
        if(!name_user || !lastname_user || !email_user || !password_user){
            res.status(200).json({
                state:'requerid',
                msg:"El nombre, apellido, email y password son obligatorios"
            });

        }
        const result = await pool.query(`insert into users 
        (name_user,lastname_user, email_user, 
        password_user, img_user, verify_user, id_role) 
        values ('${name_user}', '${lastname_user}',
        '${email_user}','${password_user}','${img}', false,${tipo_user}) RETURNING id_user`);

        if(result.rowCount === 1){
            const sendEmailUser = await sendMail({
                from: 'Verificación de la cuenta', // sender address
                to: email_user, // list of receivers
                subject: "Verificación de la cuenta", // Subject line
                html: `<b>Hola ${name_user} ${lastname_user}, hemos recibido el registro de tu usuario, para continuar por favor da clic en el botón de verificar <a href="http://localhost:4200/verify/${result.rows[0].id_user}" target="_blank" >Verificar cuenta</a></b>`, // html body
            })

            if(sendEmailUser){
                res.status(200).json({
                    state:'correct',
                    msg:"El usuario ha sido creado"
                });
            }else{
                res.status(200).json({
                    state:'correct-noendemail',
                    msg:"El usuario ha sido creado pero no se ha podido enviar el correo"
                });
            }
           
        }else{
            res.status(500).json({
                state:'error',
                msg:"No se pudo insertar el usuario"
            });  
        }
    }catch(error){

        if(error.constraint === 'email_unique'){
            res.status(400).json({
                state:'email_unique',
                msg: `El correo ${email_user} ya existe`
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
    getUserByProject,
    verifyUser
}