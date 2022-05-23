const { Router } = require('express');
const router = Router();

const { 
    getTaskByProject, updateStateTaskBy, createTask
    } = require('../controllers/task')

router.post('/getTaskByProject', getTaskByProject) 
router.post('/updateStateTask', updateStateTaskBy) 
router.post('/createTask', createTask) 

module.exports = router;