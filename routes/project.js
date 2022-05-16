const { Router } = require('express');
const router = Router();

const { 
    getProjectsAll, getProjectByUsuario
    } = require('../controllers/project')

router.get('/getProjectsAll', getProjectsAll) 
router.get('/getProjectByUsuario', getProjectByUsuario)   

module.exports = router;