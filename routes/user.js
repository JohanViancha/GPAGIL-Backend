const { Router } = require('express');
const { getUsersAll, 
        getUserById,
        getUserByAuthentication,
        createUser,
        getUserByProject,
        verifyUser,
        sendEmailForRecoverPassword,
        verifyCodeSecurity,
        updatePassword,
        clearCodeSecurity
        } = require('../controllers/user')

const router = Router();

router.get('/getUsersAll', getUsersAll)  
router.get('/getUserById/:id', getUserById)  
router.post('/getUserByAuthentication/', getUserByAuthentication) 
router.post('/createUser', createUser)   
router.post('/getUserByProject', getUserByProject)
router.post('/verifyUser', verifyUser)   
router.post('/sendEmailForRecoverPassword', sendEmailForRecoverPassword)   
router.post('/verifyCodeSecurity', verifyCodeSecurity)   
router.post('/updatePassword', updatePassword)   
router.post('/clearCodeSecurity', clearCodeSecurity)   


module.exports = router;
