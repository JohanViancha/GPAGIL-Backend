const { Router } = require('express');
const { getUsersAll, 
        userPost, 
        userPut, 
        getUserById,
        getUserByAuthentication,
        userDelete } = require('../controllers/user')

const router = Router();


router.get('/getUsersAll', getUsersAll)  
router.get('/getUserById/:id', getUserById)  
router.get('/getUserByAuthentication/', getUserByAuthentication) 
router.post('/', userPost)   
router.put('/:id',userPut)   
router.delete('/', userDelete)   


module.exports = router;