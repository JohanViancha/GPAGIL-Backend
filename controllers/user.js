const { response, request } = require('express');
const res = require('express/lib/response');
const pool = require('../database/config');
const {sendMail} = require('../mail/config');
const { templateEmail} = require('../mail/template');

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
    const {name_user, lastname_user,email_user,password_user,img_user="images/image_user",id_role} = req.body;
    try{
       
        if(!name_user || !lastname_user || !email_user || !password_user || id_role){
            res.status(200).json({
                state:'requerid',
                msg:"El nombre, apellido, email, tipo de usuario y contraseña son obligatorios"
            });

        }
        const result = await pool.query(`insert into users 
        (name_user,lastname_user, email_user, 
        password_user, img_user, verify_user, id_role) 
        values ('${name_user}', '${lastname_user}',
        '${email_user}','${password_user}','${img_user}', false,${id_role}) RETURNING id_user`);

        if(result.rowCount === 1){
            const sendEmailUser = await sendMail({
                from: 'Verificación de la cuenta', // sender address
                to: email_user, // list of receivers
                subject: "Verificación de la cuenta", // Subject line
                html: templateEmail('verify',{idUser:result.rows[0].id_user,name_user,lastname_user})
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
      console.log(error);
        if(error.constraint === 'email_unique'){
            res.status(400).json({
                state:'email_unique',
                msg: `El correo ${email_user} ya existe`
            });
        }
       
    }
}




const updateUser = async (req = request, res = response) =>{
    const {id_user, name_user, lastname_user,img_user="images/image_user",id_role} = req.body;


    try{
        const result = await pool.query(`update users 
        set name_user = '${name_user}',lastname_user = '${lastname_user}', 
        img_user = '${img_user}', id_role=${id_role}
        where id_user = ${id_user}`);

        if(result.rowCount === 1){
                res.status(200).json({
                    'rowCount': result.rowCount,
                    'updateState':true,
                    'message': "El usuario ha sido modificdo"
                });
        }else{
            res.status(400).json({
                'rowCount': 0,
                'updateState':false,
                'message': "El usuario no fue modificado"
            });
           
        } 
    }catch(error){
        console.log(error);   
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


const sendEmailForRecoverPassword = async (req = request, res = response)=> {
  const {email} =  req.body;

  const codeRandom = Math.round(Math.random()*(999999-100000)+100000);
  const result = await pool.query(`update users set cod_seg_user = '${codeRandom}' 
  where email_user = '${email}' RETURNING name_user,lastname_user`);
  
  if(email){
    const sendEmailUser = await sendMail({
      from: 'Recuperación de la cuenta', // sender address
      to: email, // list of receivers
      subject: "Recuperación de la cuenta", // Subject line
      html: templateEmail('recovery',{name_user: result.rows[0].name_user, lastname_user: result.rows[0].lastname_user, codeRandom:codeRandom}) // html body
  })

  res.status(200).json({
    'rowCount': 1,
    'updateState':true,
    'message': "La cuenta ha sido verificada"
    }
);
  }
}

const verifyCodeSecurity = async (req = request, res = response)=>{
  const {code}  = req.body;
  const restUsers = await pool.query(`select * from users where cod_seg_user = '${code}'`);
  if(restUsers.rowCount === 1){
    res.status(200).json({
        'rowCount': restUsers.rowCount,
        'updateState':true,
        'message': restUsers.rows[0]
      });
  }else{
    res.status(200).json({
      'rowCount': 0,
      'updateState':false,
      'message': "El codigo de seguridad ingresado es incorrecto"
    });
  }
 
}

const updatePassword = async (req = request, res = response)=>{
  const {email,password}  = req.body;
  const restUsers = await pool.query(`update users set password_user = '${password}'
  where email_user = '${email}'`);
  if(restUsers.rowCount === 1){
    res.status(200).json({
        'rowCount': restUsers.rowCount,
        'updateState':true,
        'message': restUsers.rows
      });
  }else{
    res.status(200).json({
      'rowCount': 0,
      'updateState':false,
      'message': "El codigo de seguridad ingresado es incorrecto"
    });
  }
}



const clearCodeSecurity = async (req = request, res = response)=>{
  const {email}  = req.body;
  const restUsers = await pool.query(`update users set cod_seg_user = null
  where email_user = '${email}'`);
  if(restUsers.rowCount === 1){
    res.status(200).json({
        'rowCount': restUsers.rowCount,
        'updateState':true,
        'message': 'Codigo limpiado'
      });
  }else{
    res.status(200).json({
      'rowCount': 0,
      'updateState':false,
      'message': "Error al actualizar el codigo de seguridad"
    });
  }
}

       
module.exports = {
    getUsersAll,
    getUserByAuthentication,
    getUserById,
    createUser,
    getUserByProject,
    verifyUser,
    sendEmailForRecoverPassword,
    verifyCodeSecurity,
    updatePassword,
    clearCodeSecurity,
    updateUser
}