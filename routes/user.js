const { Router } = require('express');
const { userGetAll, 
        userPost, 
        userPut, 
        userDelete } = require('../controllers/user')

const router = Router();


router.get('/userGetAll', userGetAll)  
router.post('/', userPost)   
router.put('/:id',userPut)   
router.delete('/', userDelete)   


module.exports = router;