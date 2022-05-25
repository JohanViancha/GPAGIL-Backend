const { Router } = require('express');
const router = Router();

const { 
    getTaskByProject, updateStateTaskBy, createTask,getTaskPriorityByUser
    } = require('../controllers/task')

router.post('/getTaskByProject', getTaskByProject) 
router.post('/updateStateTask', updateStateTaskBy) 
router.post('/createTask', createTask) 
router.post('/getTaskPriorityByUser', getTaskPriorityByUser) 

module.exports = router;