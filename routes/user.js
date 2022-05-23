const { Router } = require('express');
const { getUsersAll, 
        getUserById,
        getUserByAuthentication,
        createUser,
        getUserByProject
        } = require('../controllers/user')

const router = Router();

router.get('/getUsersAll', getUsersAll)  
router.get('/getUserById/:id', getUserById)  
router.post('/getUserByAuthentication/', getUserByAuthentication) 
router.post('/createUser', createUser)   
router.post('/getUserByProject', getUserByProject)   

module.exports = router;
