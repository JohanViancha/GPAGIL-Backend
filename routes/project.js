const { Router } = require('express');
const router = Router();

const { 
    getProjectsAll, 
    getProjectByUsuario,
    createProject,
    getProjectById
    } = require('../controllers/project')

router.get('/getProjectsAll', getProjectsAll) 
router.post('/getProjectByUsuario', getProjectByUsuario)   
router.post('/createProject', createProject)  
router.post('/getProjectById', getProjectById)  

module.exports = router;