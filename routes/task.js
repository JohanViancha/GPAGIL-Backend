const { Router } = require('express');
const router = Router();

const { 
    getTaskByProject, updateStateTaskBy, createTask,getTaskPriorityByUser,
    updateStateSubTask
    } = require('../controllers/task')

router.post('/getTaskByProject', getTaskByProject) 
router.post('/updateStateTask', updateStateTaskBy) 
router.post('/createTask', createTask) 
router.post('/getTaskPriorityByUser', getTaskPriorityByUser) 
router.post('/updateStateSubTask', updateStateSubTask) 

module.exports = router;