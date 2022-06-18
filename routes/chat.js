const { Router } = require('express');
const router = Router();

const { 
    getMessageByProjectUser,sendMessageByProjectUser,getAllMessage
    } = require('../controllers/chat')

router.post('/getMessageByProjectUser', getMessageByProjectUser)   
router.post('/sendMessageByProjectUser', sendMessageByProjectUser)   
router.get('/getAllMessage', getAllMessage)  

module.exports = router;