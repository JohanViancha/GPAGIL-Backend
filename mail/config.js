const nodemailer = require("nodemailer");
const {google} = require("googleapis")
require('dotenv').config();

const CLIENT_ID = "510114538657-vbcuk81lgr7p3ds637kkfid5c1ipuqi1.apps.googleusercontent.com"
const CLIENT_SECRET= "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"
const REDIRECT_URI="https://developers.google.com/oauthplayground"
const REFRESH_TOKEN=process.env.refreshToken

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});
let accessToken ="";

  accessToken = oAuth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type:"OAuth2",
      user: 'notificaciones.jfva@gmail.com', // generated ethereal user
      clientId:CLIENT_ID,
      clientSecret:CLIENT_SECRET,
      refreshToken:REFRESH_TOKEN,
      accessToken: accessToken
    },
  });

  const sendMail = async (options)=>{
      await transporter.sendMail(options).then(()=>{
        return true;
      })
      .catch((err)=>{
        console.log(err);
        return false;
      });
  }

  module.exports ={
    sendMail
}