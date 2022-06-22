const { Router } = require('express');
const router = Router();

const { 
    getProjectsAll, 
    getProjectByUsuario,
    createProject,
    getProjectById,
    finishProjectById,
    getProjectByIdUserIdProject,
    getTotalyByUser
    } = require('../controllers/project')

router.get('/getProjectsAll', getProjectsAll) 
router.post('/getProjectByUsuario', getProjectByUsuario)   
router.post('/createProject', createProject)  
router.post('/getProjectById', getProjectById)
router.put('/finishProjectById', finishProjectById)  
router.post('/getProjectByIdUserIdProject', getProjectByIdUserIdProject) 
router.post('/getTotalyByUser', getTotalyByUser)  


module.exports = router;