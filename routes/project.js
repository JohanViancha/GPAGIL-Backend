const { Router } = require('express');
const router = Router();

const { 
    getProjectsAll, getProjectByUsuario,createProject
    } = require('../controllers/project')

router.get('/getProjectsAll', getProjectsAll) 
router.post('/getProjectByUsuario', getProjectByUsuario)   
router.post('/createProject', createProject)  

module.exports = router;