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
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
                  <title>New Assignment</title>
                  <style type="text/css">
                    /* reset */
                    article,
                    aside,
                    details,
                    figcaption,
                    figure,
                    footer,
                    header,
                    hgroup,
                    nav,
                    section,
                    summary {
                      display: block
                    }
                
                    audio,
                    canvas,
                    video {
                      display: inline-block;
                      *display: inline;
                      *zoom: 1
                    }
                
                    audio:not([controls]) {
                      display: none;
                      height: 0
                    }
                
                    [hidden] {
                      display: none
                    }
                
                    html {
                      font-size: 100%;
                      -webkit-text-size-adjust: 100%;
                      -ms-text-size-adjust: 100%
                    }
                
                    html,
                    button,
                    input,
                    select,
                    textarea {
                      font-family: sans-serif
                    }
                
                    body {
                      margin: 0
                    }
                
                    a:focus {
                      outline: thin dotted
                    }
                
                    a:active,
                    a:hover {
                      outline: 0
                    }
                
                    h1 {
                      font-size: 2em;
                      margin: 0 0.67em 0
                    }
                
                    h2 {
                      font-size: 1.5em;
                      margin: 0 0 .83em 0
                    }
                
                    h3 {
                      font-size: 1.17em;
                      margin: 1em 0
                    }
                
                    h4 {
                      font-size: 1em;
                      margin: 1.33em 0
                    }
                
                    h5 {
                      font-size: .83em;
                      margin: 1.67em 0
                    }
                
                    h6 {
                      font-size: .75em;
                      margin: 2.33em 0
                    }
                
                    abbr[title] {
                      border-bottom: 1px dotted
                    }
                
                    b,
                    strong {
                      font-weight: bold
                    }
                
                    blockquote {
                      margin: 1em 40px
                    }
                
                    dfn {
                      font-style: italic
                    }
                
                    mark {
                      background: #ff0;
                      color: #000
                    }
                
                    p,
                    pre {
                      margin: 1em 0
                    }
                
                    code,
                    kbd,
                    pre,
                    samp {
                      font-family: monospace, serif;
                      _font-family: 'courier new', monospace;
                      font-size: 1em
                    }
                
                    pre {
                      white-space: pre;
                      white-space: pre-wrap;
                      word-wrap: break-word
                    }
                
                    q {
                      quotes: none
                    }
                
                    q:before,
                    q:after {
                      content: '';
                      content: none
                    }
                
                    small {
                      font-size: 75%
                    }
                
                    sub,
                    sup {
                      font-size: 75%;
                      line-height: 0;
                      position: relative;
                      vertical-align: baseline
                    }
                
                    sup {
                      top: -0.5em
                    }
                
                    sub {
                      bottom: -0.25em
                    }
                
                    dl,
                    menu,
                    ol,
                    ul {
                      margin: 1em 0
                    }
                
                    dd {
                      margin: 0 0 0 40px
                    }
                
                    menu,
                    ol,
                    ul {
                      padding: 0 0 0 40px
                    }
                
                    nav ul,
                    nav ol {
                      list-style: none;
                      list-style-image: none
                    }
                
                    img {
                      border: 0;
                      -ms-interpolation-mode: bicubic
                    }
                
                    svg:not(:root) {
                      overflow: hidden
                    }
                
                    figure {
                      margin: 0
                    }
                
                    form {
                      margin: 0
                    }
                
                    fieldset {
                      border: 1px solid #c0c0c0;
                      margin: 0 2px;
                      padding: .35em .625em .75em
                    }
                
                    legend {
                      border: 0;
                      padding: 0;
                      white-space: normal;
                      *margin-left: -7px
                    }
                
                    button,
                    input,
                    select,
                    textarea {
                      font-size: 100%;
                      margin: 0;
                      vertical-align: baseline;
                      *vertical-align: middle
                    }
                
                    button,
                    input {
                      line-height: normal
                    }
                
                    button,
                    html input[type="button"],
                    input[type="reset"],
                    input[type="submit"] {
                      -webkit-appearance: button;
                      cursor: pointer;
                      *overflow: visible
                    }
                
                    button[disabled],
                    input[disabled] {
                      cursor: default
                    }
                
                    input[type="checkbox"],
                    input[type="radio"] {
                      box-sizing: border-box;
                      padding: 0;
                      *height: 13px;
                      *width: 13px
                    }
                
                    input[type="search"] {
                      -webkit-appearance: textfield;
                      -moz-box-sizing: content-box;
                      -webkit-box-sizing: content-box;
                      box-sizing: content-box
                    }
                
                    input[type="search"]::-webkit-search-cancel-button,
                    input[type="search"]::-webkit-search-decoration {
                      -webkit-appearance: none
                    }
                
                    button::-moz-focus-inner,
                    input::-moz-focus-inner {
                      border: 0;
                      padding: 0
                    }
                
                    textarea {
                      overflow: auto;
                      vertical-align: top
                    }
                
                    table {
                      border-collapse: collapse;
                      border-spacing: 0
                    }
                
                    /* custom client-specific styles including styles for different online clients */
                    .ReadMsgBody {
                      width: 100%;
                    }
                
                    .ExternalClass {
                      width: 100%;
                    }
                
                    /* hotmail / outlook.com */
                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                      line-height: 100%;
                    }
                
                    /* hotmail / outlook.com */
                    table,
                    td {
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                    }
                
                    /* Outlook */
                    #outlook a {
                      padding: 0;
                    }
                
                    /* Outlook */
                    img {
                      -ms-interpolation-mode: bicubic;
                      display: block;
                      outline: none;
                      text-decoration: none;
                    }
                
                    /* IExplorer */
                    body,
                    table,
                    td,
                    p,
                    a,
                    li,
                    blockquote {
                      -ms-text-size-adjust: 100%;
                      -webkit-text-size-adjust: 100%;
                      font-weight: normal !important;
                    }
                
                    .ExternalClass td[class="ecxflexibleContainerBox"] h3 {
                      padding-top: 10px !important;
                    }
                
                    /* hotmail */
                    /* email template styles */
                    h1 {
                      display: block;
                      font-size: 26px;
                      font-style: normal;
                      font-weight: normal;
                      line-height: 100%;
                    }
                
                    h2 {
                      display: block;
                      font-size: 20px;
                      font-style: normal;
                      font-weight: normal;
                      line-height: 120%;
                    }
                
                    h3 {
                      display: block;
                      font-size: 17px;
                      font-style: normal;
                      font-weight: normal;
                      line-height: 110%;
                    }
                
                    h4 {
                      display: block;
                      font-size: 18px;
                      font-style: italic;
                      font-weight: normal;
                      line-height: 100%;
                    }
                
                    .flexibleImage {
                      height: auto;
                    }
                
                    table[class=flexibleContainerCellDivider] {
                      padding-bottom: 0 !important;
                      padding-top: 0 !important;
                    }
                
                    body,
                    #bodyTbl {
                      background-color: #E1E1E1;
                    }
                
                    #emailHeader {
                      background-color: #E1E1E1;
                    }
                
                    #emailBody {
                      background-color: #FFFFFF;
                    }
                
                    #emailFooter {
                      background-color: #E1E1E1;
                    }
                
                    .textContent {
                      color: #8B8B8B;
                      font-family: Helvetica;
                      font-size: 16px;
                      line-height: 125%;
                      text-align: Left;
                    }
                
                    .textContent a {
                      color: #205478;
                      text-decoration: underline;
                    }
                
                    .emailButton {
                      background-color: #205478;
                      border-collapse: separate;
                    }
                
                    .buttonContent {
                      color: #FFFFFF;
                      font-family: Helvetica;
                      font-size: 18px;
                      font-weight: bold;
                      line-height: 100%;
                      padding: 15px;
                      text-align: center;
                    }
                
                    .buttonContent a {
                      color: #FFFFFF;
                      display: block;
                      text-decoration: none !important;
                      border: 0 !important;
                    }
                
                    #invisibleIntroduction {
                      display: none;
                      display: none !important;
                    }
                
                    /* hide the introduction text */
                    /* other framework hacks and overrides */
                    span[class=ios-color-hack] a {
                      color: #275100 !important;
                      text-decoration: none !important;
                    }
                
                    /* Remove all link colors in IOS (below are duplicates based on the color preference) */
                    span[class=ios-color-hack2] a {
                      color: #205478 !important;
                      text-decoration: none !important;
                    }
                
                    span[class=ios-color-hack3] a {
                      color: #8B8B8B !important;
                      text-decoration: none !important;
                    }
                
                    /* phones and sms */
                    .a[href^="tel"],
                    a[href^="sms"] {
                      text-decoration: none !important;
                      color: #606060 !important;
                      pointer-events: none !important;
                      cursor: default !important;
                    }
                
                    .mobile_link a[href^="tel"],
                    .mobile_link a[href^="sms"] {
                      text-decoration: none !important;
                      color: #606060 !important;
                      pointer-events: auto !important;
                      cursor: default !important;
                    }
                
                    /* responsive styles */
                    @media only screen and (max-width: 480px) {
                      body {
                        width: 100% !important;
                        min-width: 100% !important;
                      }
                
                      table[id="emailHeader"],
                      table[id="emailBody"],
                      table[id="emailFooter"],
                      table[class="flexibleContainer"] {
                        width: 100% !important;
                      }
                
                      td[class="flexibleContainerBox"],
                      td[class="flexibleContainerBox"] table {
                        display: block;
                        width: 100%;
                        text-align: left;
                      }
                
                      td[class="imageContent"] img {
                        height: auto !important;
                        width: 100% !important;
                        max-width: 100% !important;
                      }
                
                      img[class="flexibleImage"] {
                        height: auto !important;
                        width: 100% !important;
                        max-width: 100% !important;
                      }
                
                      img[class="flexibleImageSmall"] {
                        height: auto !important;
                        width: auto !important;
                      }
                
                      table[class="flexibleContainerBoxNext"] {
                        padding-top: 10px !important;
                      }
                
                      table[class="emailButton"] {
                        width: 100% !important;
                      }
                
                      td[class="buttonContent"] {
                        padding: 0 !important;
                      }
                
                      td[class="buttonContent"] a {
                        padding: 15px !important;
                      }
                    }
                  </style>
                  <!--
                      MS Outlook custom styles
                    -->
                  <!--[if mso 12]>
                      <style type="text/css">
                        .flexibleContainer{display:block !important; width:100% !important;}
                      </style>
                    <![endif]-->
                  <!--[if mso 14]>
                      <style type="text/css">
                        .flexibleContainer{display:block !important; width:100% !important;}
                      </style>
                    <![endif]-->
                </head>
                
                <body bgcolor="#E1E1E1" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
                  <center style="background-color:#E1E1E1;">
                    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTbl" style="table-layout: fixed;max-width:100% !important;width: 100% !important;min-width: 100% !important;">
                      <tr>
                        <td align="center" valign="top" id="bodyCell">
                
                          <table bgcolor="#E1E1E1" border="0" cellpadding="0" cellspacing="0" width="500" id="emailHeader">
                            <tr>
                              <td align="center" valign="top">
                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td align="center" valign="top">
                
                                      <table border="0" cellpadding="10" cellspacing="0" width="500" class="flexibleContainer">
                                        <tr>
                                          <td valign="top" width="500" class="flexibleContainerCell">
                
                                            <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                              <tr>
                                                <td align="left" valign="middle" id="invisibleIntroduction" class="flexibleContainerBox" style="display:none;display:none !important;">
                                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%;">
                                                    <tr>
                                                      <td align="left" class="textContent">
                                                        <div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;">
                                                          Here you can put short introduction of your email template.
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                
                                    </td>
                                  </tr>
                                </table>
                
                              </td>
                            </tr>
                          </table>
                
                          <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="500" id="emailBody">
                
                            <tr>
                              <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color:#FFFFFF;" bgcolor="#0d6efd">
                                  <tr>
                                    <td align="center" valign="top">
                                      <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                                        <tr>
                                          <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                            <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                              <tr>
                                                <td align="center" valign="top" class="textContent">
                                                  <h1 style="color:#FFFFFF;line-height:100%;font-family:Helvetica,Arial,sans-serif;font-size:35px;font-weight:normal;margin-bottom:5px;text-align:center;">GPAGIL</h1>
                                                  <h2 style="text-align:center;font-weight:normal;font-family:Helvetica,Arial,sans-serif;font-size:23px;margin-bottom:10px;color:#FFF;line-height:135%;">Verificación de la cuenta</h2>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td align="center" valign="top">
                                      <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                                        <tr>
                                          <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                            <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                              <tr>
                                                <td align="center" valign="top">
                
                                                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                      <td valign="top" class="textContent">
                                                        <h3 style="color:#5F5F5F;line-height:125%;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:normal;margin-top:0;margin-bottom:3px;text-align:left;">${name_user} ${lastname_user}</h3>
                                                        <div style="text-align:left;font-family:Helvetica,Arial,sans-serif;font-size:15px;margin-bottom:0;margin-top:3px;color:#5F5F5F;line-height:135%;">Hola, te damos la bienvenida a GPAGIL, estamos muy emocionados que hayas decidido iniciar con nosotros. Para continuar necesitamos tu confirmación de la cuenta. Presiona el botón de "Verificar cuenta"</div>
                                                      </td>
                                                    </tr>
                                                  </table>
                
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                
                            <tr>
                              <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F8F8F8">
                                  <tr>
                                    <td align="center" valign="top">
                                      <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                                        <tr>
                                          <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                            <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                              <tr>
                                                <td align="center" valign="top">
                                                  <table border="0" cellpadding="0" cellspacing="0" width="50%" class="emailButton" style="background-color: #0d6efd;">
                                                    <tr>
                                                      <td align="center" valign="middle" class="buttonContent" style="padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;">
                                                      <a style="color:#FFFFFF;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:20px;line-height:135%;" href="http://localhost:4200/verify/${result.rows[0].id_user}" target="_blank">Verificar cuenta</a>
                                                      </td>
                                                    </tr>
                                                  </table>
                
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                
                          </table>
                
                          <!-- footer -->
                          <table bgcolor="#E1E1E1" border="0" cellpadding="0" cellspacing="0" width="500" id="emailFooter">
                            <tr>
                              <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td align="center" valign="top">
                                      <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                                        <tr>
                                          <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                            <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                              <tr>
                                                <td valign="top" bgcolor="#E1E1E1">
                
                                                  <div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;">
                                                    <div>Copyright &#169; 2022. All rights reserved.</div>
                                                    <div>Por favor no responder este correo</div>
                                                  </div>
                
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <!-- // end of footer -->
                
                        </td>
                      </tr>
                    </table>
                  </center>
                </body>          
                </html>`, // html body
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


const sendEmailForRecoverPassword = async (req = request, res = response)=> {
  const {email} =  req.body;

  const codeRandom = Math.round(Math.random()*(999999-100000)+100000);
  const result = await pool.query(`update users set cod_seg_user = '${codeRandom}' 
  where email_user = '${email}' RETURNING name_user,lastname_user`);
  
  console.log(codeRandom);
  if(email){
    const sendEmailUser = await sendMail({
      from: 'Recuperación de la cuenta', // sender address
      to: email, // list of receivers
      subject: "Verificación de la cuenta", // Subject line
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>New Assignment</title>
        <style type="text/css">
          /* reset */
          article,
          aside,
          details,
          figcaption,
          figure,
          footer,
          header,
          hgroup,
          nav,
          section,
          summary {
            display: block
          }
      
          audio,
          canvas,
          video {
            display: inline-block;
            *display: inline;
            *zoom: 1
          }
      
          audio:not([controls]) {
            display: none;
            height: 0
          }
      
          [hidden] {
            display: none
          }
      
          html {
            font-size: 100%;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%
          }
      
          html,
          button,
          input,
          select,
          textarea {
            font-family: sans-serif
          }
      
          body {
            margin: 0
          }
      
          a:focus {
            outline: thin dotted
          }
      
          a:active,
          a:hover {
            outline: 0
          }
      
          h1 {
            font-size: 2em;
            margin: 0 0.67em 0
          }
      
          h2 {
            font-size: 1.5em;
            margin: 0 0 .83em 0
          }
      
          h3 {
            font-size: 1.17em;
            margin: 1em 0
          }
      
          h4 {
            font-size: 1em;
            margin: 1.33em 0
          }
      
          h5 {
            font-size: .83em;
            margin: 1.67em 0
          }
      
          h6 {
            font-size: .75em;
            margin: 2.33em 0
          }
      
          abbr[title] {
            border-bottom: 1px dotted
          }
      
          b,
          strong {
            font-weight: bold
          }
      
          blockquote {
            margin: 1em 40px
          }
      
          dfn {
            font-style: italic
          }
      
          mark {
            background: #ff0;
            color: #000
          }
      
          p,
          pre {
            margin: 1em 0
          }
      
          code,
          kbd,
          pre,
          samp {
            font-family: monospace, serif;
            _font-family: 'courier new', monospace;
            font-size: 1em
          }
      
          pre {
            white-space: pre;
            white-space: pre-wrap;
            word-wrap: break-word
          }
      
          q {
            quotes: none
          }
      
          q:before,
          q:after {
            content: '';
            content: none
          }
      
          small {
            font-size: 75%
          }
      
          sub,
          sup {
            font-size: 75%;
            line-height: 0;
            position: relative;
            vertical-align: baseline
          }
      
          sup {
            top: -0.5em
          }
      
          sub {
            bottom: -0.25em
          }
      
          dl,
          menu,
          ol,
          ul {
            margin: 1em 0
          }
      
          dd {
            margin: 0 0 0 40px
          }
      
          menu,
          ol,
          ul {
            padding: 0 0 0 40px
          }
      
          nav ul,
          nav ol {
            list-style: none;
            list-style-image: none
          }
      
          img {
            border: 0;
            -ms-interpolation-mode: bicubic
          }
      
          svg:not(:root) {
            overflow: hidden
          }
      
          figure {
            margin: 0
          }
      
          form {
            margin: 0
          }
      
          fieldset {
            border: 1px solid #c0c0c0;
            margin: 0 2px;
            padding: .35em .625em .75em
          }
      
          legend {
            border: 0;
            padding: 0;
            white-space: normal;
            *margin-left: -7px
          }
      
          button,
          input,
          select,
          textarea {
            font-size: 100%;
            margin: 0;
            vertical-align: baseline;
            *vertical-align: middle
          }
      
          button,
          input {
            line-height: normal
          }
      
          button,
          html input[type="button"],
          input[type="reset"],
          input[type="submit"] {
            -webkit-appearance: button;
            cursor: pointer;
            *overflow: visible
          }
      
          button[disabled],
          input[disabled] {
            cursor: default
          }
      
          input[type="checkbox"],
          input[type="radio"] {
            box-sizing: border-box;
            padding: 0;
            *height: 13px;
            *width: 13px
          }
      
          input[type="search"] {
            -webkit-appearance: textfield;
            -moz-box-sizing: content-box;
            -webkit-box-sizing: content-box;
            box-sizing: content-box
          }
      
          input[type="search"]::-webkit-search-cancel-button,
          input[type="search"]::-webkit-search-decoration {
            -webkit-appearance: none
          }
      
          button::-moz-focus-inner,
          input::-moz-focus-inner {
            border: 0;
            padding: 0
          }
      
          textarea {
            overflow: auto;
            vertical-align: top
          }
      
          table {
            border-collapse: collapse;
            border-spacing: 0
          }
      
          /* custom client-specific styles including styles for different online clients */
          .ReadMsgBody {
            width: 100%;
          }
      
          .ExternalClass {
            width: 100%;
          }
      
          /* hotmail / outlook.com */
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
      
          /* hotmail / outlook.com */
          table,
          td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
      
          /* Outlook */
          #outlook a {
            padding: 0;
          }
      
          /* Outlook */
          img {
            -ms-interpolation-mode: bicubic;
            display: block;
            outline: none;
            text-decoration: none;
          }
      
          /* IExplorer */
          body,
          table,
          td,
          p,
          a,
          li,
          blockquote {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            font-weight: normal !important;
          }
      
          .ExternalClass td[class="ecxflexibleContainerBox"] h3 {
            padding-top: 10px !important;
          }
      
          /* hotmail */
          /* email template styles */
          h1 {
            display: block;
            font-size: 26px;
            font-style: normal;
            font-weight: normal;
            line-height: 100%;
          }
      
          h2 {
            display: block;
            font-size: 20px;
            font-style: normal;
            font-weight: normal;
            line-height: 120%;
          }
      
          h3 {
            display: block;
            font-size: 17px;
            font-style: normal;
            font-weight: normal;
            line-height: 110%;
          }
      
          h4 {
            display: block;
            font-size: 18px;
            font-style: italic;
            font-weight: normal;
            line-height: 100%;
          }
      
          .flexibleImage {
            height: auto;
          }
      
          table[class=flexibleContainerCellDivider] {
            padding-bottom: 0 !important;
            padding-top: 0 !important;
          }
      
          body,
          #bodyTbl {
            background-color: #E1E1E1;
          }
      
          #emailHeader {
            background-color: #E1E1E1;
          }
      
          #emailBody {
            background-color: #FFFFFF;
          }
      
          #emailFooter {
            background-color: #E1E1E1;
          }
      
          .textContent {
            color: #8B8B8B;
            font-family: Helvetica;
            font-size: 16px;
            line-height: 125%;
            text-align: Left;
          }
      
          .textContent a {
            color: #205478;
            text-decoration: underline;
          }
      
          .emailButton {
            background-color: #205478;
            border-collapse: separate;
          }
      
          .buttonContent {
            color: #FFFFFF;
            font-family: Helvetica;
            font-size: 18px;
            font-weight: bold;
            line-height: 100%;
            padding: 15px;
            text-align: center;
          }
      
          .buttonContent a {
            color: #FFFFFF;
            display: block;
            text-decoration: none !important;
            border: 0 !important;
          }
      
          #invisibleIntroduction {
            display: none;
            display: none !important;
          }
      
          /* hide the introduction text */
          /* other framework hacks and overrides */
          span[class=ios-color-hack] a {
            color: #275100 !important;
            text-decoration: none !important;
          }
      
          /* Remove all link colors in IOS (below are duplicates based on the color preference) */
          span[class=ios-color-hack2] a {
            color: #205478 !important;
            text-decoration: none !important;
          }
      
          span[class=ios-color-hack3] a {
            color: #8B8B8B !important;
            text-decoration: none !important;
          }
      
          /* phones and sms */
          .a[href^="tel"],
          a[href^="sms"] {
            text-decoration: none !important;
            color: #606060 !important;
            pointer-events: none !important;
            cursor: default !important;
          }
      
          .mobile_link a[href^="tel"],
          .mobile_link a[href^="sms"] {
            text-decoration: none !important;
            color: #606060 !important;
            pointer-events: auto !important;
            cursor: default !important;
          }
      
          /* responsive styles */
          @media only screen and (max-width: 480px) {
            body {
              width: 100% !important;
              min-width: 100% !important;
            }
      
            table[id="emailHeader"],
            table[id="emailBody"],
            table[id="emailFooter"],
            table[class="flexibleContainer"] {
              width: 100% !important;
            }
      
            td[class="flexibleContainerBox"],
            td[class="flexibleContainerBox"] table {
              display: block;
              width: 100%;
              text-align: left;
            }
      
            td[class="imageContent"] img {
              height: auto !important;
              width: 100% !important;
              max-width: 100% !important;
            }
      
            img[class="flexibleImage"] {
              height: auto !important;
              width: 100% !important;
              max-width: 100% !important;
            }
      
            img[class="flexibleImageSmall"] {
              height: auto !important;
              width: auto !important;
            }
      
            table[class="flexibleContainerBoxNext"] {
              padding-top: 10px !important;
            }
      
            table[class="emailButton"] {
              width: 100% !important;
            }
      
            td[class="buttonContent"] {
              padding: 0 !important;
            }
      
            td[class="buttonContent"] a {
              padding: 15px !important;
            }
          }
        </style>
        <!--
            MS Outlook custom styles
          -->
        <!--[if mso 12]>
            <style type="text/css">
              .flexibleContainer{display:block !important; width:100% !important;}
            </style>
          <![endif]-->
        <!--[if mso 14]>
            <style type="text/css">
              .flexibleContainer{display:block !important; width:100% !important;}
            </style>
          <![endif]-->
      </head>
      
      <body bgcolor="#E1E1E1" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
        <center style="background-color:#E1E1E1;">
          <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTbl" style="table-layout: fixed;max-width:100% !important;width: 100% !important;min-width: 100% !important;">
            <tr>
              <td align="center" valign="top" id="bodyCell">
      
                <table bgcolor="#E1E1E1" border="0" cellpadding="0" cellspacing="0" width="500" id="emailHeader">
                  <tr>
                    <td align="center" valign="top">
      
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" valign="top">
      
                            <table border="0" cellpadding="10" cellspacing="0" width="500" class="flexibleContainer">
                              <tr>
                                <td valign="top" width="500" class="flexibleContainerCell">
      
                                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                      <td align="left" valign="middle" id="invisibleIntroduction" class="flexibleContainerBox" style="display:none;display:none !important;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:100%;">
                                          <tr>
                                            <td align="left" class="textContent">
                                              <div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;">
                                                Here you can put short introduction of your email template.
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
      
                          </td>
                        </tr>
                      </table>
      
                    </td>
                  </tr>
                </table>
      
                <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="500" id="emailBody">
      
                  <tr>
                    <td align="center" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color:#FFFFFF;" bgcolor="#0d6efd">
                        <tr>
                          <td align="center" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                              <tr>
                                <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                  <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                    <tr>
                                      <td align="center" valign="top" class="textContent">
                                        <h1 style="color:#FFFFFF;line-height:100%;font-family:Helvetica,Arial,sans-serif;font-size:35px;font-weight:normal;margin-bottom:5px;text-align:center;">GPAGIL</h1>
                                        <h2 style="text-align:center;font-weight:normal;font-family:Helvetica,Arial,sans-serif;font-size:23px;margin-bottom:10px;color:#FFF;line-height:135%;">Solicitud de recuperación de la cuenta</h2>
                                        <div style="text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:15px;margin-bottom:0;color:#FFFFFF;line-height:135%;">${email}</div>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                              <tr>
                                <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                  <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                    <tr>
                                      <td align="center" valign="top">
      
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                          <tr>
                                            <td valign="top" class="textContent">
                                              <div style="text-align:left;font-family:Helvetica,Arial,sans-serif;font-size:15px;margin-bottom:0;margin-top:3px;color:#5F5F5F;line-height:135%;">Hola ${result.rows[0].name_user} ${result.rows[0].lastname_user}, hemos recibido tu solicitud para recuperar tu contraseña. Se ha generado un codigo de 6 digitos el cual debes ingresar en la plataforma para hacer el cambio de tu contraseña </div>
                                            </td>
                                          </tr>
                                        </table>
      
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
      
                  <tr>
                    <td align="center" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F8F8F8">
                        <tr>
                          <td align="center" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                              <tr>
                                <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                  <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                    <tr>
                                      <td align="center" valign="top">
                                        <table border="0" cellpadding="0" cellspacing="0" width="50%" class="emailButton" style="background-color: #0d6efd;">
                                          <tr>
                                            <td align="center" valign="middle" class="buttonContent" style="padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;">
                                            <a style="color:#FFFFFF;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:20px;line-height:135%;" href="#" target="_blank">${codeRandom}</a>
                                            </td>
                                          </tr>
                                        </table>
      
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
      
                </table>
      
                <!-- footer -->
                <table bgcolor="#E1E1E1" border="0" cellpadding="0" cellspacing="0" width="500" id="emailFooter">
                  <tr>
                    <td align="center" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer">
                              <tr>
                                <td align="center" valign="top" width="500" class="flexibleContainerCell">
                                  <table border="0" cellpadding="30" cellspacing="0" width="100%">
                                    <tr>
                                      <td valign="top" bgcolor="#E1E1E1">
      
                                        <div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;">
                                          <div>Copyright &#169; 2022. Todos los derechos reservados.</div>
                                          <div>Por favor no responder este correo</div>
                                        </div>
      
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <!-- // end of footer -->
      
              </td>
            </tr>
          </table>
        </center>
      </body>          
      </html>`, // html body
  })

  res.status(200).json({
    'rowCount': 1,
    'updateState':true,
    'message': "La cuenta ha sido verificada"
    }
);
  }
}

       
module.exports = {
    getUsersAll,
    getUserByAuthentication,
    getUserById,
    createUser,
    getUserByProject,
    verifyUser,
    sendEmailForRecoverPassword
}