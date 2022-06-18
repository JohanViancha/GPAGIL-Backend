const { Router } = require('express');
const router = Router();

const { 
    getProjectsAll, 
    getProjectByUsuario,
    createProject,
    getProjectById,
    finishProjectById,
    getProjectByIdUserIdProject
    } = require('../controllers/project')

router.get('/getProjectsAll', getProjectsAll) 
router.post('/getProjectByUsuario', getProjectByUsuario)   
router.post('/createProject', createProject)  
router.post('/getProjectById', getProjectById)
router.put('/finishProjectById', finishProjectById)  
router.post('/getProjectByIdUserIdProject', getProjectByIdUserIdProject)  

module.exports = router;