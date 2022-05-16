const { Router } = require('express');
const router = Router();

const { 
    getTaskByProject
    } = require('../controllers/task')

router.get('/getTaskByProject', getTaskByProject) 

module.exports = router;