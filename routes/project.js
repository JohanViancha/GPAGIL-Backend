const { Router } = require('express');
const router = Router();

const { 
    getProjectsAll
    } = require('../controllers/project')

router.get('/getProjectsAll', getProjectsAll)  

module.exports = router;