const { Router } = require('express');
const router = Router();

const { 
    getMessageByProjectUser,sendMessageByProjectUser
    } = require('../controllers/chat')

router.post('/getMessageByProjectUser', getMessageByProjectUser)   
router.post('/sendMessageByProjectUser', sendMessageByProjectUser)   


module.exports = router;