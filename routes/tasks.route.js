// Modules
const express = require('express');

const router = express.Router();

// Controllers
const tasks_controllers = require('../controllers/tasks.controller');

router.get('/', );
router.get('/:id', );
router.post('/', tasks_controllers.uploadImg, tasks_controllers.create);
router.put('/audios/:id', tasks_controllers.uploadAudio, tasks_controllers.update);
router.put('/:id', );
router.delete('/:id', );

module.exports = router;